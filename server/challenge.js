const express = require('express')

module.exports = function (App) {
  const router = express.Router()

  router.use(async (req, res, next) => {
    if (req.session.userId) {
      const user = await App.db.models.User.findOne({
        where: { id: req.session.userId },
      })
      if (user) {
        req.user = user
        next()
      }
    }
    req.session.userId = undefined
    res.redirect('/')
  })

  router.use('/map', async (req, res) => {
    res.end('map')
  })

  router.use('/profile', async (req, res) => {
    res.end('profile')
  })

  router.use('/roomscore', async (req, res) => {
    res.end('roomscore')
  })

  App.express.use(router)
}
