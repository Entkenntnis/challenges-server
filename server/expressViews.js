module.exports = function (App) {
  App.express.set('views', 'views')
  App.express.set('view engine', 'ejs')
  App.express.use((req, res, next) => {
    res.renderPage = (opts) => {
      const page = opts.page || opts
      const props = opts.props || {}
      const outsideOfContainer = opts.outsideOfContainer
      
      const t = {...App.config.i18n.share, ...App.config.i18n[page]}
      
      const title = App.config.i18n.title + (t.title? ' - ' + t.title : '')
      
      const locale = App.config.locale
      const brand = App.config.i18n.brand
      const slogan = App.config.i18n.slogan
      
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
        App
      })
    }
    next()
  })
}
