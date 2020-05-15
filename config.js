module.exports = function () {
  const config = {
    database: {
      dialect: 'sqlite',
      storage: './.data/db.sqlite',
    },
    sync: {
      //force: true,
      //alter: true,
    },
    logdb: false,
    logprefix: '[challenges-server] ',
    port: 3000,
    sessionSecret: 'keyboard cat',
    locale: 'en',
    theme: 'sketchy',
    reloadChallenges: true,
    configRoutes: true,
    challengesDir: process.cwd(),
    staticFolder: './public',
    accounts: {
      minUsername: 3,
      maxUsername: 40,
      minPw: 4,
      maxPw: 100,
      regex: /^[ -~äöüÄÖÜß]+$/,
      maxRatePerHour: 500,
      roomRegex: /^[a-zA-Z0-9]+$/,
      minRoom: 3,
      maxRoom: 20,
      maxRoomPerHour: 50,
      highscoreLimit: 2000,
      topHackersLimit: 10,
      solveRateLimit: 20,
      solveRateTimeout: 30,
    },
    map: {
      background: '/background.jpg',
      backgroundLicenseHtml:
        '<a href="https://paintingvalley.com/sketch-paper-texture#sketch-paper-texture-37.jpg">paintingvalley.com</a> (<a href="https://creativecommons.org/licenses/by-nc/4.0/deed.en">CC BY-NC 4.0</a>)',
      textColor: 'black',
      drawPoint: (link, p, textColor) => {
        link.circle(18).attr({
          fill: p.isSolved ? 'var(--gray-dark)' : 'var(--success)',
          cx: p.pos.x,
          cy: p.pos.y,
        })
        const text = link
          .plain(p.title)
          .fill(textColor)
          .font('family', 'inherit')
        text.center(p.pos.x + p.title.length, p.pos.y - 23)
      },
      drawConnection: (canvas, c) => {
        canvas
          .line(c.start.x, c.start.y, c.end.x, c.end.y)
          .stroke({ width: 10 })
          .stroke('var(--gray)')
          .attr('stroke-linecap', 'round')
      },
    },
    brand: 'challenges-server',
    slogan: 'An homage to hacker.org',
    periodic: {
      startupDelay: 2000,
      baseInterval: 10000,
    },
    session: {
      cleanupInterval: 5, // minutes
      allowUnderexpire: 10, // minutes
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
    urlPrefix: '',
    i18nConfig: {
      debug: true,
      fallbackLng: 'en',
      backend: {
        loadPath: __dirname + '/lang/{{lng}}.json',
      },
    },
  }

  return config
}
