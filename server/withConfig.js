module.exports = function (App) {
  try {
    App.config = require(process.cwd() + '/config')
    const extendConfigPath = App.dataDirectory + '/config'
    try {
      const extendConfig = require(extendConfigPath)
      App.config = extendConfig(App.config)
      App.logger.info('Extended config with ' + extendConfigPath + '.js')
    } catch (e) {
      // skip extended config
    }
  } catch (e) {
    App.logger.fatal('Unable to load config: ' + e.message)
  }
}
