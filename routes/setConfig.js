module.exports = function (App) {
  if (App.config.configRoutes) {
    App.express.get('/setlocale/:locale', (req, res) => {
      App.config.locale = req.params.locale
      App.moment.locale(req.params.locale)
      res.redirect('/')
    })

    App.express.get('/settheme/:theme', (req, res) => {
      App.config.theme = req.params.theme
      res.redirect('/')
    })
  }
}
