const express = require('express')
const Op = require('sequelize').Op

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

  router.get('/finish', (req, res) => {
    if (req.user.session_phase === 'OUTRO') {
      res.render('finish', { config: App.config })
    } else {
      res.redirect('/map')
    }
  })

  router.get('/sessiondone', async (req, res) => {
    if (req.user.session_phase === 'OUTRO') {
      req.user.session_phase = 'DONE'
      await req.user.save()
    }
    res.redirect('/map')
  })

  router.get('/endsession', async (req, res) => {
    if (req.user.session_phase === 'ACTIVE') {
      req.user.session_score = req.user.score
      req.user.session_phase = 'OUTRO'
      await req.user.save()
      res.redirect('/finish')
      return
    }
    res.redirect('/map')
  })

  App.periodic.add(5, async () => {
    const expiredUsers = await App.db.models.User.findAll({
      where: {
        session_phase: 'ACTIVE',
        session_startTime: { [Op.lte]: App.moment().subtract(30, 'minutes') },
      },
    })
    for (const user of expiredUsers) {
      user.session_phase = 'OUTRO'
      user.session_score = user.score
      await user.save()
    }
  })

  router.use(async (req, res, next) => {
    if (req.user.session_phase === 'ACTIVE') {
      const expired = App.moment(req.user.session_startTime)
        .add(30, 'minutes')
        .isBefore(App.moment())
      if (expired) {
        res.redirect('/endsession')
        return
      }
    }
    if (req.user.session_phase === 'OUTRO') {
      res.redirect('/finish')
      return
    }
    next()
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

  router.use('/challenge/:id', (req, res, next) => {
    // rate limit
    const id = parseInt(req.params.id)

    if (
      id &&
      req.user.id &&
      req.body.answer &&
      challenges.some((c) => c.id === id)
    ) {
      const key = req.user.id + '-' + id
      req.session.rates = req.session.rates || {}
      const rate = req.session.rates[key]
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
        req.session.rates[key] = { count: 1, lockedUntil: -1 }
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
          correct:
            challenge.solution && answer === challenge.solution.toLowerCase(),
        }
      }

    const { answer, correct } = check(req.body.answer || '', { req, App })

    if (correct) {
      try {
        const [, created] = await App.db.models.Solution.findOrCreate({
          where: { cid: id, UserId: req.user.id },
        })
        if (created) {
          if (req.user.score > 0) {
            // add a small bonus for fast solving
            const pausetime =
              (new Date().getTime() - req.user.updatedAt.getTime()) /
              (60 * 1000)
            const tinterval = Math.floor(pausetime / 3)
            req.user.score += Math.pow(0.5, tinterval) * 2
          } else {
            req.user.score += 2
            if (req.user.session_phase === 'READY') {
              req.user.session_phase = 'ACTIVE'
              req.user.session_startTime = new Date()
            }
          }
          req.user.score += 10
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
    res.render('profile', { user: req.user, config: App.config, room: '123' })
  })

  App.express.get('/highscore', async (req, res) => {})

  router.get('/roomscore', async (req, res) => {
    const room = await App.db.models.Room.findOne({where: {id:req.user.RoomId}})
    if (req.user.RoomId && room) {
      const dbUsers = await App.db.models.User.findAll({
        attributes: ['name', 'score', 'session_score', 'updatedAt'],
        where: {
          roomId:req.user.RoomId
        },
        order: [['session_score', 'DESC']],
        limit: App.config.highscoreLimit,
      })
      const users = dbUsers.map(user => {
        return {
          name: user.name,
          score: Math.floor(user.score),
          sessionScore: user.session_score ? Math.floor(user.session_score) : '...',
          lastActive: App.moment(user.updatedAt).fromNow(),
        }
      })
      users.forEach((user, i) => {
        if (i > 0 && users[i - 1].score == user.score) {
          user.rank = users[i - 1].rank
        } else {
          user.rank = i + 1
        }
      })
      res.render('roomscore', {config: App.config, user:req.user, room:room.name, users})
      return
    }
    res.redirect('/map')
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
