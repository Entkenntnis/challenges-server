const express = require('express')

module.exports = function (App) {
  const router = express.Router()
  let challenges = require(App.dataDirectory + '/challenges')

  router.use(async (req, res, next) => {
    if (req.session.userId) {
      const user = await App.db.models.User.findOne({
        where: { id: req.session.userId },
      })
      if (user) {
        req.user = user
        next()
        return
      }
    }
    req.session.userId = undefined
    res.redirect('/')
  })

  router.get('/map', async (req, res) => {
    const solvedDb = await App.db.models.Solution.findAll({
      where: { UserId: req.user.id },
    })

    const solved = solvedDb.map((s) => s.cid)

    const window = require('svgdom')
    const SVG = require('svg.js')(window)
    const document = window.document
    const element = document.createElement('svg')
    const canvas = SVG(element).size('100%', '100%')

    const points = []

    function drawPoint(p) {
      const link = canvas.link('/challenge/' + p.id).addClass('no-underline')
      link.circle(18).attr({
        fill: p.isSolved ? '#666699' : '#0ce3ac',
        cx: p.pos.x,
        cy: p.pos.y,
      })
      const text = link.text(p.title).fill('#ffffff')
      text.center(p.pos.x, p.pos.y - 20)
    }

    function drawConnection(c) {
      canvas
        .line(c.start.x, c.start.y, c.end.x, c.end.y)
        .stroke({ width: 10 })
        .stroke('#464545')
        .attr('stroke-linecap', 'round')
    }

    challenges.map((challenge) => {
      const isSolved = solved.includes(challenge.id)
      const point = {
        id: challenge.id,
        pos: challenge.pos,
        title: challenge.title,
        isSolved,
      }
      const visible =
        isSolved ||
        challenge.deps.some((c) => solved.includes(c)) ||
        challenge.deps.length === 0
      if (visible) {
        points.push(point)
        challenge.deps.forEach((dep) => {
          const previous = challenges.filter((c) => c.id === dep)[0]
          if (solved.includes(previous.id))
            drawConnection({ start: challenge.pos, end: previous.pos })
        })
      }
    })
    points.map(drawPoint)

    res.render('map', { user: req.user, config: App.config, map: canvas.svg() })
  })

  const rates = {}

  router.use('/challenge/:id', (req, res, next) => {
    // rate limit
    const id = parseInt(req.params.id)

    if (id && req.user.id && req.body.answer) {
      const key = req.user.id + '-' + id
      const rate = rates[key]
      if (rate) {
        if (rate.lockedUntil > 0) {
          if (Date.now() < rate.lockedUntil) {
            var secs = Math.round((rate.lockedUntil - Date.now()) / 1000)
            res.send(
              App.config.i18n.challenge.locked + ' ' + secs.toString() + 's.'
            )
            return
          } else {
            rate.lockedUntil = -1
            rate.count = 1
          }
        } else {
          rate.count++
          if (rate.count > App.config.accounts.solveRateLimit) {
            rate.lockedUntil =
              Date.now() + 1000 * App.config.accounts.solveRateTimeout
          }
        }
      } else {
        rates[key] = { count: 1, lockedUntil: -1 }
      }
    }
    next()
  })

  router.use('/challenge/:id', async (req, res) => {
    reloadChallenges()

    const id = parseInt(req.params.id)

    if (!challenges.some((c) => c.id === id)) {
      res.redirect('/map')
      return
    }

    const challenge = challenges.filter((c) => c.id === id)[0]
    const solvedBy = await App.db.models.Solution.count({ where: { cid: id } })

    const check =
      challenge.check ||
      function (raw) {
        const answer = raw.toLowerCase()
        return {
          answer,
          correct: challenge.solution && answer === challenge.solution.toLowerCase(),
        }
      }

    const { answer, correct } = check(req.body.answer || '', { req, App })

    if (correct) {
      try {
        const [, created] = await App.db.models.Solution.findOrCreate({
          where: { cid: id, UserId: req.user.id },
        })
        if (created) {
          req.user.score += 10
          if (req.user.score !== 0) {
            // add a small bonus for fast solving
            const pausetime =
              (new Date().getTime() - req.user.updatedAt.getTime()) /
              (60 * 1000)
            const tinterval = Math.floor(pausetime / 3)
            req.user.score += Math.pow(0.5, tinterval) * 2
          } else {
            req.user.score += 2
            // TODO start session
          }
          await req.user.save()
        }
      } catch (e) {
        console.log(e)
      }
    }

    res.render('challenge', {
      config: App.config,
      challenge,
      correct,
      answer,
      user: req.user,
      solvedBy,
    })
  })

  router.get('/profile', async (req, res) => {
    res.end('profile')
  })

  router.get('/roomscore', async (req, res) => {
    res.end('roomscore')
  })

  App.express.use(router)

  function reloadChallenges() {
    if (App.config.reloadChallenges) {
      delete require.cache[
        require.resolve(App.dataDirectory + '/challenges.js')
      ]
      challenges = require(App.dataDirectory + '/challenges')
    }
  }
}
