var i18next = require('i18next')
var Backend = require('i18next-fs-backend')

module.exports = function (App) {
  App.i18n = i18next.createInstance()
  App.i18n.use(Backend)

  App.entry.add(async () => {
    await App.i18n.init({ ...App.config.i18nConfig, lng: App.config.locale })
    for (const extend of App.config.i18nExtend) {
      App.i18n.addResource(extend.lng, 'translation', extend.key, extend.value)
    }
    App.logger.info('Translations ready')
  })
}
