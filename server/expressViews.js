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
  App.express.set('views', 'views')
  App.express.set('view engine', 'ejs')

  const translation = App.config.translations[App.config.locale]
  if (translation) {
    override(App.config.i18n, translation)
  }

  App.express.use((req, res, next) => {
    res.renderPage = (opts) => {
      const page = opts.page || opts
      const props = opts.props || {}
      const outsideOfContainer = opts.outsideOfContainer

      const t = { ...App.config.i18n.share, ...App.config.i18n[page] }

      const title = App.config.brand + (t.title ? ' - ' + t.title : '')

      const locale = App.config.locale
      const brand = App.config.brand
      const slogan = App.config.slogan

      const user = opts.user || req.user

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
      })
    }
    next()
  })
}
