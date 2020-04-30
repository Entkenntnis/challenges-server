const express = require('express')

module.exports = function (App) {
  App.express = express()
  App.express.use(require('connect-gzip-static')('public'))
  App.express.use(express.static(App.dataDirectory + '/public'))

  App.express.use(require('body-parser').urlencoded({ extended: true }))
  App.express.use(require('connect-flash')())

  App.entry.add(async () => {
    await new Promise((res) => {
      App.express.listen(App.config.port, () => {
        App.logger.info('Server started on port ' + App.config.port)
        res()
      })
    })
  })
}
