const express = require('express')
const Op = require('sequelize').Op

module.exports = function (App) {
  // REMARK: the encapsulation with router is not working too great, so may be removed
  const router = express.Router()

  // REMARK: allow hot reloading
  let challenges = require(App.config.challengesDir + '/challenges')

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
    delete req.session.userId
    res.redirect('/')
  })

  router.get('/finish', (req, res) => {
    if (req.user.session_phase === 'OUTRO') {
      res.renderPage({ page: 'finish', backButton: false })
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

  router.get('/startsession', async (req, res) => {
    if (req.user.session_phase === 'READY') {
      req.user.session_phase = 'ACTIVE'
      req.user.session_startTime = new Date()
      await req.user.save()
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
    reloadChallenges()

    const solvedDb = await App.db.models.Solution.findAll({
      where: { UserId: req.user.id },
    })

    const solved = solvedDb.map((s) => s.cid)

    if (App.config.editors.includes(req.user.name)) {
      challenges.map((c) => solved.push(c.id))
    }

    const window = require('svgdom')
    const SVG = require('svg.js')(window)
    const document = window.document
    const element = document.createElement('svg')
    const canvas = SVG(element).size('100%', '100%')

    const points = []

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
          if (solved.includes(previous.id)) {
            canvas
              .line(
                previous.pos.x,
                previous.pos.y,
                challenge.pos.x,
                challenge.pos.y
              )
              .stroke({ width: 10 })
              .stroke(App.config.styles.connectionColor)
              .attr('stroke-linecap', 'round')
          }
        })
      }
    })

    // COMPAT: draw points after connections to show the above
    for (const point of points) {
      const link = canvas
        .link(App.config.urlPrefix + '/challenge/' + point.id)
        .addClass('no-underline')
      link.circle(18).attr({
        fill: point.isSolved
          ? App.config.styles.pointColor_solved
          : App.config.styles.pointColor,
        cx: point.pos.x,
        cy: point.pos.y,
      })
      const text = link
        .plain(point.title)
        .fill(App.config.styles.textColor)
        .font('family', 'inherit')
      text.center(
        point.pos.x + App.config.map.centeringOffset * point.title.length,
        point.pos.y - 23
      )
    }

    res.renderPage({
      page: 'map',
      props: {
        map: canvas.svg(),
      },
      outsideOfContainer: true,
      backButton: false,
    })
  })

  // rate limit challenge routes
  router.use('/challenge/:id', (req, res, next) => {
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
            var sec = Math.round((rate.lockedUntil - Date.now()) / 1000)
            res.send(App.i18n.t('challenge.locked', { sec }))
            return
          } else {
            rate.lockedUntil = -1
            rate.count = 1
          }
        } else {
          rate.count++
          if (rate.count > App.config.accounts.solveRateLimit) {
            // REMARK: should move to moment one day
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

    let answer = ''
    let correct = false

    try {
      if (req.body.answer) {
        const result = check(req.body.answer || '', { req, App })
        if (result.answer) {
          answer = result.answer
          correct = result.correct
        } else {
          answer = req.body.answer
          correct = result
        }
      }
    } catch (e) {
      console.log(e)
      // something didn't work out, avoid server crashing
    }

    if (correct && !App.config.editors.includes(req.user.name)) {
      try {
        const [, created] = await App.db.models.Solution.findOrCreate({
          where: { cid: id, UserId: req.user.id },
        })
        if (created) {
          if (req.user.score > 0) {
            // REMARK: add a small bonus for fast solving
            const pausetime =
              (new Date().getTime() - req.user.updatedAt.getTime()) /
              (60 * 1000)
            const tinterval = Math.floor(pausetime / 3)
            req.user.score += Math.pow(0.5, tinterval) * 2
          } else {
            req.user.score += 2
            // REMARK: start session on first solved challenge
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

    const solvedBy = await App.db.models.Solution.count({ where: { cid: id } })

    res.renderPage({
      page: 'challenge',
      props: {
        challenge,
        correct,
        answer,
        solvedBy,
      },
      backButton: false,
    })
  })

  router.get('/profile', async (req, res) => {
    let room
    if (req.user.RoomId) {
      const roomRow = await App.db.models.Room.findOne({
        where: { id: req.user.RoomId },
      })
      if (roomRow) {
        room = roomRow.name
      }
    }
    const solved = await App.db.models.Solution.count({
      where: { UserId: req.user.id },
    })
    res.renderPage({
      page: 'profile',
      props: {
        room,
        solved,
      },
    })
  })

  router.get('/roomscore', async (req, res) => {
    const room = await App.db.models.Room.findOne({
      where: { id: req.user.RoomId },
    })
    if (req.user.RoomId && room) {
      const dbUsers = await App.db.models.User.findAll({
        attributes: ['name', 'score', 'session_score', 'updatedAt'],
        where: {
          roomId: req.user.RoomId,
        },
        order: [
          ['session_score', 'DESC'],
          ['updatedAt', 'DESC'],
        ],
        limit: App.config.highscoreLimit,
      })
      const users = dbUsers.map((user) => {
        return {
          name: user.name,
          score: Math.floor(user.score),
          sessionScore:
            user.session_score || user.session_score === 0
              ? Math.floor(user.session_score)
              : '...',
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
      res.renderPage({
        page: 'roomscore',
        props: {
          room: room.name,
          users,
        },
      })
      return
    }
    res.redirect('/map')
  })

  App.express.use(router)

  function reloadChallenges() {
    if (App.config.reloadChallenges) {
      delete require.cache[
        require.resolve(App.config.challengesDir + '/challenges.js')
      ]
      challenges = require(App.config.challengesDir + '/challenges')
    }
  }
}
