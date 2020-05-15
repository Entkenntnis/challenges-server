module.exports = function (App) {
  App.moment = require('moment')

  App.i18n.on('languageChanged', (lng) => {
    App.moment.locale(lng)
  })
}
