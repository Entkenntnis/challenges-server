const { DataTypes } = require('sequelize')

module.exports = function(App) {
  
  const User = App.db.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    score: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    session_startTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    session_phase: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    session_score: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  })
  
  const Room = App.db.define('Room', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    alias: {
      type: DataTypes.STRING,
      unique: true,
    }
  })
  
  const Solution = App.db.define('Solution', {
    cid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    }
  })
  
  const Session = App.db.define('Session', {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    data: {
      type: DataTypes.STRING(4096),
    },
    expires: {
      type: DataTypes.DATE,
    },
  })
  
  Room.hasMany(User)
  User.belongsTo(Room)
  
  User.hasMany(Solution, {
    foreignKey: {
      primaryKey: true
    }
  })
  Solution.belongsTo(User)
  
  
  App.entry.add(async () => {
    await App.db.sync(App.config.sync)
    App.logger.info('Database synchronized')
  })
}
