module.exports = function (App) {
  App.express.set('views', 'views')
  App.express.set('view engine', 'ejs')
  App.express.use((req, res, next) => {
    res.renderPage(opts => {
      res.render('main')
    })
    next()
  })
}
