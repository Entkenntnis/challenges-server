// Read directory from command line and set it to App.dataDir

const fs = require('fs')
const path = require('path')

module.exports = function (App) {
  const directory = process.argv[2]
  try {
    const stat = fs.statSync(directory)
    if (stat.isDirectory()) {
      const absolutePath = path.resolve(directory)
      App.dataDirectory = absolutePath
      App.logger.info('Data directory is set to ' + App.dataDirectory)
    } else {
      App.logger.fatal(
        directory +
          ' is not a directory. Please provide a valid data directory.'
      )
    }
  } catch (e) {
    App.logger.fatal(
      directory + ' does not exist. Please provide a valid data directory.'
    )
  }
}
