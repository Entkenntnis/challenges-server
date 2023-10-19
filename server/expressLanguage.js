const cookieKey = 'htw_language_preference'

module.exports = function (App) {
  App.express.use((req, res, next) => {
    let lng = req.cookies[cookieKey]

    if (req.path == '/de') {
      lng = 'de'
      setCookie(res, lng)
    }

    if (req.path == '/en') {
      lng = 'en'
      setCookie(res, lng)
    }

    if (App.config.languages.includes(lng)) {
      req.lng = lng
    } else {
      req.lng = detectLanguage(req.headers['accept-language'])
      setCookie(res, req.lng)
    }
    next()
  })

  function detectLanguage(header) {
    if (header) {
      // return language as soon as it is detected
      for (let i = 0; i < App.config.languages.length; i++) {
        const lng = App.config.languages[i]
        if (header.includes(lng)) return lng
      }
    }
    // use first language as fallback
    return App.config.languages[0]
  }

  function setCookie(res, lng) {
    res.cookie(cookieKey, lng, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    })
  }
}
