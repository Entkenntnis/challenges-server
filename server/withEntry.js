module.exports = function (App) {
  let startApp

  App.entry = {
    __entry: new Promise((res) => {
      startApp = res
    }),
    add: (fn) => {
      const prevEntry = App.entry.__entry
      App.entry.__entry = (async () => {
        await prevEntry
        await fn()
      })()
    },
    start: () => {
      process.nextTick(startApp)
      return App.entry.__entry
    },
  }
}
