const Tokens = require('csrf')
const instance = new Tokens()

module.exports = function (App) {
  App.csrf = {
    create: (req) => {
      if (!req.session.csrfSecret) {
        req.session.csrfSecret = instance.secretSync()
      }
      return instance.create(req.session.csrfSecret)
    },
    verify: (req, token) => {
      return instance.verify(req.session.csrfSecret, token)
    },
  }
}
