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

, but you can also use other database backends (e.g. mariadb, mysql, ...).

### config.sync

Is passed as `options` into the database [sync function](https://sequelize.org/master/class/lib/sequelize.js~Sequelize.html#instance-method-sync). For development purposes, default is empty object.

### config.logdb

Enable logging of all db commands (very verbose). Default is `false`.

### config.logprefix

A string that is prefixes to every console output, default is `"[challenges-server] "`.

### config.port

The port on which to start the server, default is 3000. The server is listening to all available networks on your computer.

### config.sessionSecret

Secret value to generate session tokens. Set it to something unique, default is "keyboard cat".

### config.locale

Sets the language, currently available are `"de"` (german), `"en"` and `"fr"` (french). Default is english.

## Changelog

### 0.1.0, May 2020

Initial release
