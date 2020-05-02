const Op = require('sequelize').Op
const bcrypt = require('bcryptjs')

module.exports = function (App) {
  App.express.get('/register', (req, res) => {
    if (req.session.userId) {
      res.redirect('/map')
      return
    }
    const room = req.session.joinRoom
    delete req.session.joinRoom
    const values = req.session.registerValues || {}
    delete req.session.registerValues
    const token = App.csrf.create(req)
    res.renderPage({
      page: 'register',
      props: {
        messages: req.flash('register'),
        values,
        token,
        room,
      },
    })
  })

  App.express.post('/register', async (req, res) => {
    const username = (req.body.username || '').trim()
    const pw1 = req.body.pw1 || ''
    const pw2 = req.body.pw2 || ''
    const register = App.config.i18n.register
    const room = req.body.room
    let roomId

    if (room) {
      const dbRoom = await App.db.models.Room.findOne({ where: { name: room } })
      if (!dbRoom) {
        req.flash('join', App.config.i18n.join.roomNotFound)
        req.session.joinValues = { room }
        res.redirect('/join')
        return
      }
      roomId = dbRoom.id
    }

    async function check() {
      if (!App.csrf.verify(req, req.body.csrf)) return register.invalidToken
      if (username.length < App.config.accounts.minUsername)
        return register.nameTooShort
      if (username.length > App.config.accounts.maxUsername)
        return register.nameTooLong
      if (!App.config.accounts.regex.test(username))
        return register.nameInvalidChars

      const user = await App.db.models.User.findOne({
        where: { name: username },
      })
      if (user) return register.nameExists

      if (pw1 != pw2) return register.pwMismatch
      if (pw1.length < App.config.accounts.minPw) return register.pwTooShort
      if (pw1.length > App.config.accounts.maxPw) return register.pwTooLong

      const creationRate = await App.db.models.User.count({
        where: {
          createdAt: { [Op.gte]: App.moment().subtract(1, 'hours').toDate() },
        },
      })

      if (creationRate > App.config.accounts.maxRatePerHour)
        return register.serverCrowded
    }

    const err = await check()
    if (err) {
      req.flash('register', err)
    } else {
      // ready to go
      try {
        const password = await bcrypt.hash(pw1, 8)
        await App.db.models.User.create({
          name: username,
          password,
          RoomId: roomId,
          session_phase: roomId && 'READY',
        })
        res.redirect('/success')
        return
      } catch (e) {
        console.warn(e)
        req.flash('register', register.failure)
      }
    }
    req.session.registerValues = {
      pw1,
      pw2,
      username,
    }
    req.session.joinRoom = room

    res.redirect('/register')
  })

  App.express.get('/join', (req, res) => {
    if (req.session.userId) {
      res.redirect('/map')
      return
    }
    const values = req.session.joinValues || {}
    req.session.joinValues = undefined
    res.renderPage({
      page: 'join',
      props: {
        messages: req.flash('join'),
        values,
      },
    })
  })

  App.express.post('/join', async (req, res) => {
    const room = req.body.room
    const roomId = await App.db.models.Room.findOne({ where: { name: room } })
    if (!roomId) {
      req.flash('join', App.config.i18n.join.roomNotFound)
      req.session.joinValues = { room }
      res.redirect('/join')
      return
    } else {
      req.session.joinRoom = room
      res.redirect('/register')
    }
  })

  App.express.get('/create', (req, res) => {
    const values = req.session.roomValues || {}
    req.session.roomValues = undefined
    res.renderPage({
      page: 'create',
      props: {
        messages: req.flash('create'),
        values,
        token: App.csrf.create(req),
        rooms: req.session.rooms || [],
      },
    })
  })

  App.express.post('/create', async (req, res) => {
    const room = req.body.room
    const roomId = await App.db.models.Room.findOne({ where: { name: room } })

    async function check() {
      if (!App.csrf.verify(req, req.body.csrf))
        return App.config.i18n.create.invalidToken
      if (room.length < App.config.accounts.minRoom)
        return App.config.i18n.create.keyTooShort
      if (room.length > App.config.accounts.maxRoom)
        return App.config.i18n.create.keyTooLong
      if (!App.config.accounts.roomRegex.test(room))
        return App.config.i18n.create.keyInvalid
      if (roomId) return App.config.i18n.create.keyExists

      const creationRate = await App.db.models.Room.count({
        where: {
          createdAt: { [Op.gte]: App.moment().subtract(1, 'hours').toDate() },
        },
      })

      if (creationRate > App.config.accounts.maxRoomPerHour)
        return App.config.i18n.create.serverCrowded
    }

    const err = await check()
    if (err) {
      req.flash('create', err)
    } else {
      try {
        await App.db.models.Room.create({ name: room })
        req.session.rooms = req.session.rooms || []
        req.session.rooms.push(room)
        res.redirect('/create')
        return
      } catch (e) {
        console.warn(e)
        req.flash('create', App.config.i18n.create.failure)
      }
    }

    req.session.roomValues = { room }
    res.redirect('/create')
  })

  App.express.get('/success', (req, res) => {
    res.renderPage('success')
  })

  App.express.post('/login', async (req, res) => {
    const username = (req.body.username || '').trim()
    const password = req.body.password || ''
    const user = await App.db.models.User.findOne({ where: { name: username } })
    if (user) {
      const success = bcrypt.compare(password, user.password)
      if (success) {
        req.session.userId = user.id
        res.redirect('/map')
        return
      }
    }
    req.session.loginFail = true
    res.redirect('/')
  })

  App.express.get('/highscore', async (req, res) => {
    const dbUsers = await App.db.models.User.findAll({
      attributes: ['name', 'score', 'updatedAt'],
      where: { score: { [Op.gt]: 0 } },
      order: [
        ['score', 'DESC'],
        ['updatedAt', 'DESC'],
      ],
      limit: App.config.highscoreLimit,
    })
    let user = undefined
    if (req.session.userId) {
      user = await App.db.models.User.findOne({
        where: { id: req.session.userId },
      })
    }
    const users = processHighscore(dbUsers)
    res.renderPage({
      page: 'highscore',
      props: {
        users,
      },
      user,
    })
  })

  App.express.get('/', async (req, res) => {
    if (req.session.userId) {
      res.redirect('/map')
      return
    }
    const invalidLogin = req.session.loginFail
    delete req.session.loginFail
    const dbUsers = await App.db.models.User.findAll({
      attributes: ['name', 'score', 'updatedAt'],
      where: {
        score: { [Op.gt]: 0 },
        updatedAt: { [Op.gte]: App.moment().subtract(1, 'months').toDate() },
      },
      order: [['score', 'DESC']],
      limit: App.config.topHackersLimit,
    })
    const users = processHighscore(dbUsers)
    res.renderPage({
      page: 'home',
      props: {
        invalidLogin,
        users,
      },
    })
  })

  App.express.get('/logout', (req, res) => {
    delete req.session.userId
    res.redirect('/')
  })

  function processHighscore(dbUsers) {
    const users = dbUsers.map((user) => {
      return {
        name: user.name,
        score: Math.floor(user.score),
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
    return users
  }
}
