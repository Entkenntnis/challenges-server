// REFACTOR: move i18n to its own module

function override(original, over) {
  for (const key of Object.keys(original)) {
    if (typeof original[key] === 'string') {
      if (over[key]) {
        original[key] = over[key]
      }
    } else {
      if (over[key]) {
        override(original[key], over[key])
      }
    }
  }
}

module.exports = function (App) {
  App.express.set('views', require('path').join(__dirname, '../views'))
  App.express.set('view engine', 'ejs')

  const origi18n = JSON.stringify(App.config.i18n)

  const translation = App.config.translations[App.config.locale]
  if (translation) {
    override(App.config.i18n, translation)
  }

  App.express.use((req, res, next) => {
    res.renderPage = (opts) => {
      // REMARK: allow hot reloading locale
      if (App.config.configRoutes) {
        App.config.i18n = JSON.parse(origi18n)
        const translation = App.config.translations[App.config.locale]
        if (translation) {
          override(App.config.i18n, translation)
        }
      }

      const page = opts.page || opts
      const props = opts.props || {}
      const outsideOfContainer = opts.outsideOfContainer

      const t = { ...App.config.i18n.share, ...App.config.i18n[page] }

      const title = App.config.brand + (t.title ? ' - ' + t.title : '')

      const locale = App.config.locale
      const brand = App.config.brand
      const slogan = App.config.slogan

      const user = opts.user || req.user
      const backButton = opts.backButton !== false

      res.render('main', {
        locale,
        brand,
        slogan,
        title,
        page,
        props,
        user,
        t,
        outsideOfContainer,
        App,
        backButton
      })
    }
    next()
  })
}
