module.exports = function(App) {
  App.moment = require('moment')
  App.moment.locale(App.config.locale)
}
