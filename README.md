# challenges-server
The engine behind https://hack.arrrg.de

## Introduction

A great way to learn and master a skill is to solve challenges. This package aims at providing a foundation on which you can create a set of challenges and invite people to solve them.

## Getting started

Install the `@entkenntnis/challenges-server` package from npm and write this

```js
require('challenges-server')()
```

to start the server.

## Create and Share!

Look at the create-challenges-server repo for an extended introduction into creating your own set of challenges.

## Configuration

The server exposes a lot of config options, which you can all override and customize:

```js
require('challenges-server')(config => {
  // config.port = 8080
  return config
})
```

## Changelog

### 0.1.0, May 2020

Initial release
