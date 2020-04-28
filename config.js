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
  sessionMaxAge: 1000 * 60 * 60 * 24, // 24 hours
  locale: 'en',
  i18n: {
    title: 'hack-engine',
    slogan: 'An homage to hacker.org',
    login: {
      title: 'Login',
      name: 'Name:',
      password: 'Password:',
      go: 'Go',
      invalid: 'Login invalid',
    },
    invite: 'New here? Create a free account and start hacking:',
    register: 'Register',
    enterRoom: 'Enter Room',
    hackerOfTheMonth: 'Top Hackers of the Month',
    showHighscore: 'Highscore',
    inviteOrga: 'Are you hosting an event? Here you can ',
    createRoom: 'create a custom room',
    contact: 'Contact',
    privacy: 'Privacy Policy',
    github: 'GitHub',
  }
}
