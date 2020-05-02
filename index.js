const App = {}

require('./server/withLogger')(App)
require('./server/withDataDirectory')(App)
require('./server/withConfig')(App)
require('./server/withEntry')(App)
require('./server/withDb')(App)
require('./server/withMoment')(App)
require('./server/withPeriodic')(App)

require('./server/dbModel')(App)

require('./server/withExpress')(App)
require('./server/expressHeaders')(App)
require('./server/expressSession')(App)
require('./server/expressViews')(App)

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

require('./server/staticPages')(App)
require('./server/withCsrf')(App)
require('./server/user')(App)
require('./server/challenge')(App)

App.entry.start().then(() => {
  App.logger.info(App.moment().format('LLLL'))
})
