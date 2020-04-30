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

require('./server/withCsrf')(App)

require('./server/user')(App)
require('./server/challenge')(App)

App.entry.start().then(() => {
  App.logger.info(App.moment().toString())
})

App.express.get('/contact', (req, res) => {
  res.render('contact', { config: App.config })
})

App.express.get('/privacy', (req, res) => {
  res.render('privacy', { config: App.config })
})

App.express.get('/ramble', (req, res) => {
  req.session.userId = 3243234
  res.end('ramble')
})
