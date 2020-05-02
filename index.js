module.exports = function (extend = (config) => config) {
  const App = {
    config: extend(require('./config')()),
  }

  require('./server/withEntry')(App)
  require('./server/withLogger')(App)
  require('./server/withDb')(App)
  require('./server/withExpress')(App)
  require('./server/withCsrf')(App)
  require('./server/withMoment')(App)
  require('./server/withPeriodic')(App)

  require('./server/dbModel')(App)
  require('./server/expressHeaders')(App)
  require('./server/expressSession')(App)
  require('./server/expressViews')(App)

  require('./routes/setConfig')(App)
  require('./routes/staticPages')(App)
  require('./routes/user')(App)
  require('./routes/challenge')(App)

  App.entry.start().then(() => {
    App.logger.info(App.moment().format('LLLL'))
  })
}
