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
      centeringOffset: 1,
      width: '1600',
      height: '1200',
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
      debug: false,
      fallbackLng: 'en',
      backend: {
        loadPath: __dirname + '/lang/{{lng}}.json',
      },
    },
    i18nExtend: [
      /*{
        lng: 'de',
        key: 'home.version',
        value: 'Version: Juni 2020'
      },*/
    ],
    styles: {
      mapTextColor: 'black',
      mapTextWeight: 'normal',
      connectionColor: 'var(--gray)',
      pointColor: 'var(--success)',
      pointColor_solved: 'var(--gray-dark)',
      hrColor: undefined,
      solutionClass_correct: 'success',
      solutionClass_wrong: 'danger',
      tableHighlightClass: 'primary',
      fontSize: undefined,
    },
    editors: [],
    customCSS: '',
    callback: undefined,
    masterPassword: undefined,
    githubHref: 'https://github.com/Entkenntnis/challenges-server',
    fullscreenMap: false,
    statusBackgroundColor: '',
    prefixPlaceholder: '{{PREFIX}}',
    scoreMode: 'time',
  }

  return config
}
