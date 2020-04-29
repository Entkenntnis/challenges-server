const App = {}

require('./server/withLogger')(App)
require('./server/withDataDirectory')(App)
require('./server/withConfig')(App)
require('./server/withEntry')(App)
require('./server/withDb')(App)
require('./server/withMoment')(App)

require('./server/dbModel')(App)

require('./server/withExpress')(App)
require('./server/expressSession')(App)
require('./server/expressViews')(App)

require('./server/withCsrf')(App)

require('./server/user')(App)

App.entry.start().then(() => {
  App.logger.info(App.moment().toString())
})

App.express.get('/', (req, res) => {
  const invalidLogin = req.session.loginFail
  req.session.loginFail = undefined
  res.render('home', {invalidLogin, config: App.config})
})
