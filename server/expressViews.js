module.exports = function (App) {
  App.express.set('views', require('path').join(__dirname, '../views'))
  App.express.set('view engine', 'ejs')

  App.express.use((req, res, next) => {
    res.renderPage = (opts) => {
      const page = opts.page || opts
      const props = opts.props || {}
      const outsideOfContainer = opts.outsideOfContainer

      const t = function (key, opts) {
        const pageKey = page + '.' + key
        if (App.i18n.exists(pageKey)) {
          return App.i18n.t(pageKey, opts)
        }
        const shareKey = 'share.' + key
        if (App.i18n.exists(shareKey)) {
          return App.i18n.t(shareKey, opts)
        }
        if (App.i18n.exists(key)) {
          return App.i18n.t(key, opts)
        }
        return ''
      }

      const title =
        App.config.brand +
        (App.i18n.exists(page + '.title') ? ' - ' + t('title') : '')

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
        backButton,
      })
    }
    next()
  })
}
