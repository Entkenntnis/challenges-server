module.exports = {
  database: {
    dialect: 'sqlite',
    storage: './.data/db.sqlite',
  },
  sync: {
    //force: true,
  },
  port: 3000,
  sessionSecret: 'keyboard cat',
  sessionMaxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  locale: 'en',
  i18n: {
    
  }
}
