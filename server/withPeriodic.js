module.exports = function (App) {
  const tasks = []

  function check() {
    for (const task of tasks) {
      if (
        !task.lastRun ||
        task.lastRun + task.interval * 60 * 1000 < Date.now()
      ) {
        task.fn()
        task.lastRun = Date.now()
      }
    }
    setTimeout(check, 10000)
  }

  setTimeout(check, 2000)

  App.periodic = {
    add: (interval, fn) => {
      tasks.push({ interval, fn })
    },
  }
}
