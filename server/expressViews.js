module.exports = function(App) {
  App.express.set('views', __dirname + '/views')
  App.express.set('view engine', 'ejs')
}
