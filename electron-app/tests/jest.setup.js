const { synchronizeDb } = require("#root/electron-starter.func.ts")

module.exports = async () => {
  // Perform global setup tasks here
  console.log("Global setup: Running setup tasks before all test suites.")
  await synchronizeDb()
  console.log("Global setup done!")
}
