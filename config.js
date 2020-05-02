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
  port: 3000,
  sessionSecret: 'keyboard cat',
  sessionMaxAge: 1000 * 60 * 60 * 24, // 24 hours
  locale: 'en',
  theme: 'sketchy',
  reloadChallenges: true,
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
      const text = link.plain(p.title).fill(textColor).font('family', 'inherit')
      text.center(p.pos.x, p.pos.y - 20)
    },
    drawConnection: (canvas, c) => {
      canvas
        .line(c.start.x, c.start.y, c.end.x, c.end.y)
        .stroke({ width: 10 })
        .stroke('var(--gray)')
        .attr('stroke-linecap', 'round')
    },
  },
}

config.i18n = {
  brand: 'hack-engine',
  slogan: 'An homage to hacker.org',
  share: {
    back: 'Back',
    go: 'Go',
  },
  home: {
    loginHeading: 'Login',
    invalid: 'Login failed!',
    name: 'Name:',
    password: 'Password:',
    invite: 'New here? Create a free account and start hacking:',
    registerLink: 'Register',
    joinRoom: 'Join room',
    hackerOfTheMonth: 'Hackers of the Month',
    showHighscore: 'Show all',
    rooms: 'Rooms',
    inviteOrga: 'Are you hosting an event? Here you can ',
    createRoom: 'create a custom room',
    contactLink: 'Contact',
    privacyLink: 'Privacy Policy',
    github: 'GitHub',
    version: 'Version: May 2020',
  },
  register: {
    title: 'Register',
    username: 'Username',
    password: 'Password',
    repeatPassword: 'Repeat password',
    usernameNote: `Min. ${config.accounts.minUsername} characters`,
    passwordNote: `Min. ${config.accounts.minPw} characters`,
    noteOn: 'Review our',
    dataProtection: 'privacy policy',
    nameTooShort: 'Username too short.',
    nameTooLong: `Username too long, max. ${config.accounts.maxUsername} characters.`,
    nameInvalidChars: 'Username contains invalid characters.',
    pwTooShort: 'Password too short.',
    pwTooLong: 'Long passwords are good. But this??',
    pwMismatch: "Passwords don't match.",
    invalidToken: 'Form invalid. Please try again.',
    failure: 'Creating user failed. Please try again.',
    nameExists: 'Username already exists.',
    serverCrowded:
      'There are too many registrations at the moment. Please try again in 15 minutes.',
  },
  join: {
    title: 'Join',
    key: 'Room key:',
    roomNotFound: 'Room not found!',
  },
  highscore: {
    title: 'Highscore',
    empty: 'There are no hackers in the highscore yet. Become the first!',
    rank: 'Rank',
    name: 'Username',
    score: 'Score',
    sessionScore: 'Session Score',
    lastActive: 'Last Active',
    showRoomScore: 'room only',
    showGlobalScore: 'show all',
  },
  create: {
    title: 'Create Room',
    yourRooms: 'My Rooms',
    key: 'New room key:',
    go: 'Create',
    information:
      'You can use a room to create a local highscore for your event and use the session system. A hacking session lasts 30 minutes, in this time user can solve challenges and gain points. After 30 minutes, the score is submitted to the local highscore. After the session, users can continue to work on the challenges as regular users.',
    keyInvalid: 'Only alphanumeric characters allowed in room key.',
    keyTooShort: 'Room key to short.',
    keyTooLong: 'Room key to long.',
    keyExists: 'Room key already exists.',
    failure: 'Creating room failed. Please try again.',
    keyNote: `${config.accounts.minRoom} - ${config.accounts.minRoom} characters, alpha-numeric`,
    serverCrowded:
      'There are too many room creations at the moment. Please try again in 15 minutes.',
    invalidToken: 'Form invalid. Please try again.',
  },
  contact: {
    title: 'Contact',
    HTML:
      '<p>Please provide contact information according to the legislation of your country.</p>',
  },
  privacy: {
    title: 'Privacy Policy',
    HTML:
      '<p>Please provide legal information according to the legislation of your country.</p>',
  },
  success: {
    title: 'Registration successful',
    message: 'Your registration was successful.',
    login: 'Login',
  },
  map: {
    background: 'Background:',
  },
  statusBar: {
    name: 'Name:',
    score: 'Score:',
    sessionReady: 'Session: ready',
    session: 'Session:',
    highscore: 'Highscore',
    profile: 'Profile',
    logout: 'Logout',
  },
  profile: {
    title: 'Profile',
    username: 'Username:',
    score: 'Score:',
    solved: 'Challenges solved:',
    lastActive: 'Last active:',
    room: 'Room:',
    sessionReady: 'Session is ready. Solve a challenge to start it.',
    startSession: 'Start session now!',
    sessionActive: 'Session is running...',
    endSession: 'End session now!',
    sessionDone: 'Session done.',
    sessionScore: 'Session score:',
  },
  challenge: {
    back: 'back',
    solvedBy: 'solved by',
    users: 'people',
    user: 'person',
    continue: 'continue',
    correct: 'is correct',
    wrong: 'is wrong',
    locked: 'After 20 tries, you must pause for 30 seconds. Please wait',
  },
  roomscore: {
    title: 'Highscore',
    heading: 'Highscore: ',
  },
  finish: {
    title: 'Session finished',
    html: '<p>Well done!</p>',
    ok: 'OK',
  },
}

module.exports = config
