const { DataTypes } = require('sequelize')

module.exports = function(App) {
  App.db.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING
    }
  })
  console.log(App.db.models.User)
  App.entry.add(async () => {
    await App.db.sync()
  })
}
