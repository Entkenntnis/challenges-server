const App = {}

require('./server/withLogger')(App)
require('./server/withDataDirectory')(App)
require('./server/withConfig')(App)
require('./server/withEntry')(App)
require('./server/withDb')(App)

require('./server/dbModel')(App)

App.entry.start().then(() => {
  console.log("Hurray!")
})
