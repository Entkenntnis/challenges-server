const prefix = "[hack-engine] "

module.exports = function(App) {
  App.logger = {
    info: msg => {
      console.info(prefix + msg)
    },
    fatal: msg => {
      console.error(prefix + msg)
      console.trace()
      process.exit(1)
    }
  }

  process.on('unhandledRejection', reason => {
    App.logger.fatal('Error: ' + reason)
  })
}
