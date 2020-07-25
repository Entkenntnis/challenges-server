module.exports = function (App) {
  let challenges = require(App.config.challengesDir + '/challenges')

  function reloadChallenges() {
    if (App.config.reloadChallenges) {
      delete require.cache[
        require.resolve(App.config.challengesDir + '/challenges.js')
      ]
      App.challenges.data = require(App.config.challengesDir + '/challenges')
    }
  }

  App.challenges = {
    data: challenges,
    reload: reloadChallenges,
  }
}
