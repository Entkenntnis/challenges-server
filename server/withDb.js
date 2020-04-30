const Sequelize = require('sequelize')

module.exports = function (App) {
  try {
    App.db = new Sequelize({
      logging: App.config.logdb ? (msg) => console.info('[db] ' + msg) : false,
      ...App.config.database,
    })
  } catch (e) {
    App.logger.fatal('Failed to create database: ' + e.message)
  }

  App.entry.add(async () => {
    await App.db.authenticate()
    App.logger.info('Database ready')
  })
}
