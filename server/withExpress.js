const express = require('express')

module.exports = function (App) {
  App.express = express()

  // REMARK: allow data directory to override static assets
  App.express.use(express.static(App.dataDirectory + '/public'))
  App.express.use(require('connect-gzip-static')('public'))

  // REMARK: currently, we are not making use of extended features
  App.express.use(require('body-parser').urlencoded({ extended: true }))

  App.express.use(require('connect-flash')())

  App.entry.add(async () => {
    await new Promise((res) => {
      // REMARK: listen only provides a callback interface
      App.express.listen(App.config.port, () => {
        App.logger.info('Server started on port ' + App.config.port)
        res()
      })
    })
  })
}
