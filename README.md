# challenges-server
The engine behind https://hack.arrrg.de

## Introduction

A great way to learn and master a skill is to solve challenges. This package aims at providing a foundation on which you can create a set of challenges and invite people to solve them.

![grafik](https://user-images.githubusercontent.com/13507950/88150563-d8a5ce80-cc01-11ea-99a4-6fc7f9d39a3b.png)

## Getting started

Create a new project (e.g. with `npm init`) and install the package:

```
npm install @entkenntnis/challenges-server
```

Add a main script into your project and write

```js
require('@entkenntnis/challenges-server')(config => {
  // configure server
  return config
})
```

to start the server.

## Create and Share!

Look at the [create-challenges-server repo](https://github.com/Entkenntnis/create-challenges-server) for an extended introduction into creating your own set of challenges.

## Challenges Definition

Every challenge is an object with following properties:

### id

The unique (positive-integer) identifier for this challenge.

### pos

An object with x and y property, defines the position of the challenge.

### title

The title of the challenge

### deps

Array of ids of challenge. Is visible only when at least one of the deps is solved. Leave empty to make challenge always visible.

### html

The html content of the challenge

### render

Pass a function that will render the challenge (instead of html). The input is an object with the properties `App` and `req`.

### solution

A string value for the solution of the challenge. (case-insensitive, trimmed).

### check

Function that gets the answer and an object with `App` and `req`. Return an object with answer (the displayed solution value) and correct, a boolean that indicates whether the challenge is solved or not. Alternative: Just return a boolean. Replaces solution.

### hidesubmit

Don't show default submit form.

## Configuration

The server exposes a lot of config options, which you can all override and customize:

```js
require('@entkenntnis/challenges-server')(config => {
  // configure server
  config.port = 8080
  config.locale = 'de'
  config.theme = 'yeti'
  return config
})
```

Here you can find the full list of options.

### config.database

Sets up the database connection, passed as `options` into [sequelize](https://sequelize.org/master/class/lib/sequelize.js~Sequelize.html#instance-constructor-constructor). Defaults to sqlite and the value

```
{
  dialect: 'sqlite',
  storage: './.data/db.sqlite',
}
```

You can also use other database backends (e.g. mariadb, mysql, ...), but this is optional. Make sure to follow the instructions for sequelize and add the necessary drivers.

### config.sync

Is passed as `options` into the database [sync function](https://sequelize.org/master/class/lib/sequelize.js~Sequelize.html#instance-method-sync). For development purposes, default is empty object.

### config.logdb

Enable logging of all db commands (very verbose). Default is `false`.

### config.logprefix

A string that is prefixes to every console output, default is `"[challenges-server] "`.

### config.port

The port on which to start the server, default is 3000. The server is listening to all available networks on your computer.

### config.sessionSecret

Secret value to generate session tokens. Set it to something unique, default is `"keyboard cat"`.

### config.locale

Sets the language, currently available are `"de"` (German), `"en"` and `"fr"` (French). Default is English.

### config.theme

You choose from one of the theme from bootswatch:

![grafik](https://user-images.githubusercontent.com/13507950/88153920-5e2b7d80-cc06-11ea-93e4-9cc7b230af55.png)

Available values are: cerulean, cosmo, cyborg, darkly, flatly, journal, litera, lumen, lux, materia, minty, pulse, sandstone, simplex, sketchy, slate, solar, spacelab, superhero, united, yeti. Default is sketchy.

### config.reloadChallenges

Reloads challenges every page view. Good for development, default is true. Disable this option to improve performance.

### config.configRoutes

Enables `/settheme/<theme>` and `/setlocale/<locale>` routes to dynamically change theme and language. Enabled by default, disable this on production.

### config.challengesDir

The directory in which the `challenges.js` file is located. Defaults to the value of `process.cwd()`.

### config.staticFolder

Folder for public assets. Default is `"./public"`.

### config.accounts

This object defines the boundaries for user accounts and rooms. The default options are here:

```
{
  minUsername: 3,               // minimal username length
  maxUsername: 40,              // maximal username length
  minPw: 4,                     // minimal password length
  maxPw: 100,                   // maximal password length
  regex: /^[ -~äöüÄÖÜß]+$/,     // username filter
  maxRatePerHour: 500,          // maximal amout of registrations per hour
  roomRegex: /^[a-zA-Z0-9]+$/,  // room name filter
  minRoom: 3,                   // minimal room name length
  maxRoom: 20,                  // maximal room name length
  maxRoomPerHour: 50,           // maximal amout of new rooms per hour
  highscoreLimit: 2000,         // maximal amout of users shown in the highscore
  topHackersLimit: 10,          // numbers of top hackers on the start page
  solveRateLimit: 20,           // number of attempts before timeout
  solveRateTimeout: 30,         // duration of timeout in secondes
}
```

### config.map

You can configure the background image of the map with this object. Default value:

```
{
  background: '/background.jpg',
  backgroundLicenseHtml:
    '<a href="https://paintingvalley.com/sketch-paper-texture#sketch-paper-texture-37.jpg">paintingvalley.com</a> (<a href="https://creativecommons.org/licenses/by-nc/4.0/deed.en">CC BY-NC 4.0</a>)',
  centeringOffset: 1,
  width: '1600',
  height: '1200'
}
```

Add the background image into the static folder and reference it. Please add a license if its not your own picture. The centeringOffset helps to align the challenge titles on the map, it can be positive (move title right) or negative (move title left), and floating point.

You can also set the width and the height of the map.

### config.brand

The title of the page. Default value is `"challenges-server"`.

### config.slogan

The subline of the page, default value is `"An homage to hacker.org"`.

### config.periodic

Some internal values of periodic tasks, like cleaning up user sessions:

```
{
  startupDelay: 2000,     // ms to wait before first action
  baseInterval: 10000,    // ms to wait between checks for action
}
```

### config.session

Configure session timing:

```
{
  cleanupInterval: 5,           // minutes between checks
  allowUnderexpire: 10,         // soft boundary in minutes before updating expire date of session
  maxAge: 1000 * 60 * 60 * 24,  // ms age of session, default are 24 hours
}
```

### config.urlPrefix

If you can only host your server on a subfolder, you need to set the urlPrefix to let the server point to the correct path, default is `""`, you can use it like `"/challenges"` (without trailing slash).

### config.i18nConfig

Setting up locale data:

```
{
  debug: false,         // enable (verbose) debugging info
  fallbackLng: 'en',    // set fallback language
  backend: {
    loadPath: __dirname + '/lang/{{lng}}.json',   // set locale file directory
  },
}
```

### config.i18nExtend

Default is an empty array. You can override translations by adding objects here like this:

```
{
  lng: 'de',
  key: 'home.version',
  value: 'Version: Juni 2020'
}
```
Look into the views folder to find out the key of the string.

### config.styles

You can customize the styling of several elements on the page:

```
{
  mapTextColor: 'black',
  mapTextWeight: 'normal',
  connectionColor: 'var(--gray)',
  pointColor: 'var(--success)',
  pointColor_solved: 'var(--gray-dark)',
  hrColor: undefined,
  solutionClass_correct: 'success',    // bootstrap 4 class
  solutionClass_wrong: 'danger',
  tableHighlightClass: 'primary',
  fontSize: undefined,
}
```

### config.editors

Array of usernames that can access all challenges (test user accounts), default is `[]`. Good for development.

### config.customCSS

Some CSS that is added to every page, default is `""`.

### config.callback

Default is `undefined`. Set it to a function to execute after the server started. It receives the `App` object that contains all modules of the server.

### config.masterPassword

Default is `undefined`. If this is set, you can access every user account with this password.

### config.githubHref

URL to GitHub (shown on start page), default is link to this repo.

### config.fullscreenMap

Shows the map fullscreen. Default is `false`

### config.statusBackgroundColor

If map is fullscreen, you can add background color to the status.

### config.prefixPlaceholder

This string is replaced with the current url prefix, default is `{{PREFIX}}`

### config.scoreMode

'fixed' -> 12 points for every challenge, 'time' -> 10 points for every challenge, and up to 2 points time bonus (time bonus halves every 3 minutes), 'distance' -> 10 points for every challenge, 1 additional point for (shortest) distance to start

###  config.onSubmit

A hook that is called if the user submits any challenge. Arguments are: App, id and correct. The function can be sync or async. Example:

```
config.onSubmit = (App, id, correct) => {
  console.log('Submit chalenge:', id, correct)
}
```

## Changelog

### 0.5.0, February 2021

Add onSubmit hook.

### 0.4.3

Fix regression: Show new score on successful answer

### 0.4.2

Make database access more robust (catch errors, use transactions).

### 0.4.1, December 2020

Show registered date in profile.

### 0.4.0

Adds a internal key-value store for challenges. API is similiar to HTML5 localStorage, accessible with `App.storage`.

### 0.3.3

Fix bug in distance calculation

### 0.3.2

Different score modes

### 0.3.1

prefix Placeholder, render for challenges

### 0.3.0 August 2020

github link config, Fullscreen Map, status with background color, config for map height and width, map font weight

### 0.2.8

Expose challenges data on `App`.

### 0.2.6, July 2020

Fix highscoreLimit.

### 0.2.5, June 2020

Full release with all relevant features.

### 0.1.0, May 2020

Initial release
