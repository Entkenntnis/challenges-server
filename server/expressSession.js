const session = require('express-session')

module.exports = function(App) {
  
  class SessionStore extends session.Store {
    constructor() {
      super()
    }
    
    get(sid, cb) {
      (async () => {
        const session = await App.db.models.Session.findOne({
          where: {sid}
        })
        return session ? JSON.parse(session.data) : null
      })().then(session => cb(null, session))
    }
    
    set(sid, session, cb) {
      (async () => {
        const data = JSON.stringify(session)
        const expires = session.cookie.expires
        const [sess] = await App.db.models.Session.findCreateFind({
          where: {sid},
          defaults: { data, expires }
        })
        if (data !== sess.data) {
          sess.data = data
          sess.expires = expires
          await sess.save()
        }
      })().then(() => cb(null))
    }
    
    destroy(sid, cb) {
      (async () => {
        await App.db.models.Session.destroy({
          where: {sid}
        })
      })().then(() => cb(null))
    }
  }
  
  App.express.use(session({
    resave: false,
    saveUninitialized: false,
    secret: App.config.sessionSecret,
    cookie : { maxAge : App.config.sessionMaxAge },
    store: new SessionStore()
  }))
}
