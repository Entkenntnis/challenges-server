const baseInterval = 10000

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
    setTimeout(check, baseInterval)
  }

  // REMARK: Give server same time to start
  setTimeout(check, 2000)

  App.periodic = {
    add: (interval, fn) => {
      tasks.push({ interval, fn })
    },
  }
}
