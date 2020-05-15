module.exports = function (App) {
  if (App.config.configRoutes) {
    App.express.get('/setlocale/:locale', (req, res) => {
      App.config.locale = req.params.locale
      App.i18n.changeLanguage(App.config.locale)
      res.redirect('/')
    })

    App.express.get('/settheme/:theme', (req, res) => {
      App.config.theme = req.params.theme
      res.redirect('/')
    })
  }
}
