const DB_PATH_DEFAULT = "./db/db.sqlite"
const DB_PATH_TEST = ":memory:"
const DB_PATH = !!process.env.ELECTRON_APP_TESTING
  ? DB_PATH_TEST
  : DB_PATH_DEFAULT

const CATEGORY_KEYS = ["id", "name", "description", "updatedAt"]

exports.CATEGORY_KEYS = CATEGORY_KEYS
exports.DB_PATH = DB_PATH
