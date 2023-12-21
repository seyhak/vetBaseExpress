const { sequelize } = require("./models/index")

async function synchronizeDb(force = false, alter = true) {
  const syncKwargs = {
    force,
    alter,
  }
  try {
    await sequelize.sync(syncKwargs)
  } catch (e) {
    console.error(e)
    throw e
  }
}

exports.synchronizeDb = synchronizeDb
