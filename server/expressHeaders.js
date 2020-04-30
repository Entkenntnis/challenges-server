module.exports = function (App) {
  App.express.use(function (req, res, next) {
    res.setHeader('X-DNS-Prefetch-Control', 'off')
    res.setHeader('X-Frame-Options', 'SAMEORIGIN')
    res.removeHeader('X-Powered-By')
    res.setHeader('Strict-Transport-Security', 'max-age=5184000')
    res.setHeader('X-Content-Type-Options', 'nosniff')

    // we don't want caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate') // HTTP 1.1.
    res.setHeader('Pragma', 'no-cache') // HTTP 1.0.
    res.setHeader('Expires', '0') // Proxies.
    next()
  })
}
