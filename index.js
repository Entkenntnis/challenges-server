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

App.entry.start().then(() => {
  console.log(App.moment().format('lll'))
})



// Test code

App.express.get('/', (req, res) => {
  if (!req.session.counter)
    req.session.counter = 1
  res.end('Hello World! ' + req.session.counter++)
})
