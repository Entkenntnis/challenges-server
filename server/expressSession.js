const session = require('express-session')
const Op = require('sequelize').Op

module.exports = function (App) {
  class SessionStore extends session.Store {
    constructor() {
      super()
    }

    get(sid, cb) {
      ;(async () => {
        const session = await App.db.models.Session.findOne({
          where: { sid },
        })
        return session ? JSON.parse(session.data) : null
      })().then((session) => cb(null, session))
    }

    set(sid, session, cb) {
      ;(async () => {
        const data = JSON.stringify(session)
        const expires = session.cookie.expires
        // REMARK: findCreateFind is assumed to be a little bit more robust
        const [sess] = await App.db.models.Session.findCreateFind({
          where: { sid },
          defaults: { data, expires },
        })
        sess.data = data
        sess.expires = expires
        await sess.save()
      })().then(() => cb(null))
    }

    destroy(sid, cb) {
      ;(async () => {
        await App.db.models.Session.destroy({
          where: { sid },
        })
      })().then(() => cb(null))
    }

    touch(sid, session, cb) {
      ;(async () => {
        const sess = await App.db.models.Session.findOne({
          where: { sid },
        })
        // PERF: only touch session if expires is off by more than 10 minutes
        if (sess) {
          const sessionExpire = App.moment(sess.expires)
          const newExpire = App.moment(session.cookie.expires)
          const staleMinutes = newExpire.diff(sessionExpire, 'minutes')
          if (staleMinutes >= 10) {
            sess.expires = session.cookie.expires
            await sess.save()
          }
        }
      })().then(() => cb(null))
    }
  }

  // clean up every 5 minutes
  App.periodic.add(5, async () => {
    await App.db.models.Session.destroy({
      where: { expires: { [Op.lt]: new Date() } },
    })
  })

  App.express.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: App.config.sessionSecret,
      cookie: { maxAge: App.config.sessionMaxAge },
      store: new SessionStore(),
    })
  )

  // COMPAT: session is not automatically saved on redirect, doing it here manually
  App.express.use(function (req, res, next) {
    const redirect = res.redirect
    res.redirect = function () {
      if (req.session.save) {
        req.session.save(() => {
          redirect.apply(this, arguments)
        })
      } else redirect.apply(this, arguments)
    }
    next()
  })
}
