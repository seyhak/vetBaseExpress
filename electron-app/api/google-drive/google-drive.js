const fs = require("fs")
const fsPromises = require("fs").promises
require("dotenv").config()
const path = require("path")
const process = require("process")
const { authenticate } = require("@google-cloud/local-auth")
const { google } = require("googleapis")
const { GoogleAuth } = require("google-auth-library")
const { Category } = require("#root/models/category.js")
const { CatalogueItem } = require("#root/models/catalogue-item.js")
const {
  bulkCreateItems,
} = require("#root/api/catalogue-item/catalogue-item.js")

const BACKUP_FILE_NAME = "backup.csv"
const APP_DATA_FOLDER = "appDataFolder"
// If modifying these scopes, delete token.json.
const SCOPES = [
  "https://www.googleapis.com/auth/drive.metadata.readonly",
  "https://www.googleapis.com/auth/drive.appdata",
  "https://www.googleapis.com/auth/drive.appfolder",
]
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "resources", "token.json")
const CREDENTIALS_PATH = path.join(
  process.cwd(),
  "resources",
  "credentials.json",
)
const DEFAULT_CREDENTIALS_PATH = path.join(
  process.cwd(),
  "resources",
  "credentials.public.json",
)

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fsPromises.readFile(TOKEN_PATH)
    const credentials = JSON.parse(content)
    const now = new Date()
    const tokenDate = new Date(credentials.expiry_date)
    const isTokenExpired = now - tokenDate >= 0
    if (isTokenExpired) {
      await fsPromises.rm(TOKEN_PATH)
      return null
    }
    return google.auth.fromJSON(credentials)
  } catch (err) {
    return null
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  console.log({ client })
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: process.env["GOOGLE_CLIENT_ID"],
    client_secret: process.env["GOOGLE_CLIENT_SECRET"],
    refresh_token: client.credentials.refresh_token,
    expiry_date: client.credentials.expiry_date,
  })
  await fsPromises.writeFile(TOKEN_PATH, payload)
}

/**
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function generateCredentials() {
  const secretData = {
    client_id: process.env["GOOGLE_CLIENT_ID"],
    client_secret: process.env["GOOGLE_CLIENT_SECRET"],
  }
  const content = await fsPromises.readFile(DEFAULT_CREDENTIALS_PATH)
  const keys = JSON.parse(content)
  const key = keys.installed || keys.web
  const payload = JSON.stringify({
    installed: {
      ...key,
      client_id: secretData.client_id || key.client_id,
      client_secret: secretData.client_secret || key.client_secret,
    },
  })
  await fsPromises.writeFile(CREDENTIALS_PATH, payload)
}
/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist()
  if (client) {
    return client
  }
  await generateCredentials()
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  })
  if (client.credentials) {
    await saveCredentials(client)
  }
  return client
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 */
async function listFiles(authClient) {
  const drive = google.drive({ version: "v3", auth: authClient })
  const res = await drive.files.list({
    pageSize: 10,
    fields: "nextPageToken, files(id, name)",
  })
  const files = res.data.files
  if (files.length === 0) {
    console.log("No files found.")
    return
  }

  console.log("Files:")
  return files.map((file) => {
    const fileName = `${file.name} (${file.id})`
    console.log(fileName)
    return fileName
  })
}

const getAuthorization = async () => {
  const client = await authorize()
  console.log({ client })
  return client
}

const getListFiles = async () => {
  try {
    const client = await authorize()
    const files = await listFiles(client)
    console.log({ files })
    return files
  } catch (error) {
    console.error(error)
    throw error
  }
}

class ExportDataAsCsvToGoogleDriveHandler {
  /**
   * @param {items} client await CatalogueItem.findAll result
   * @return {{"groupName": [], "description": null, "id": "680c37dc-71df-479b-8db9-7055953f887a", "name": "catless item"}[]}
   * */
  static serializeDataBackup(items) {
    return items.map((item) => {
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        groupName: item.Categories.map((cat) => cat.name),
      }
    })
  }

  static async getDatabaseBackup() {
    const items = await CatalogueItem.findAll({
      attributes: ["id", "name", "description"],
      include: { model: Category, attributes: ["name"] },
    })
    const serializedItems =
      ExportDataAsCsvToGoogleDriveHandler.serializeDataBackup(items)
    return serializedItems
  }

  static async deleteFile() {
    const path = BACKUP_FILE_NAME
    try {
      await fsPromises.unlink(path)
      console.log(`successfully deleted ${path}`)
    } catch (error) {
      console.error("there was an error:", error.message)
    }
  }
  /**
   * @param {contentObjs} ex. {
   * groupName: ["white cat"],
   * description: null,
   * id: itemWith1Category.id,
   * name: "item with cat",
   * }[]
   * @return {csvString}
   * */
  static parseBackupDataToCsv = (contentObjs) => {
    const headers = ["id", "name", "description", "groupName"]
    const rows = [headers]
    Object.values(contentObjs).forEach((o) => {
      const row = []
      headers.forEach((col) => {
        const value = o[col] ?? ""
        row.push(value)
      })
      rows.push(row)
      console.log("rows", rows)
    })
    const parsedRows = rows
      .map((row) => {
        return row
          .map(String) // convert every value to String
          .map((v) => v.replaceAll('"', '""')) // escape double quotes
          .map((v) => `"${v}"`) // quote it
          .join(",") // comma-separated
      })
      .join("\r\n")
    return parsedRows // rows starting on new lines
  }
  static async createBackupDataCsv() {
    const content =
      await ExportDataAsCsvToGoogleDriveHandler.getDatabaseBackup()
    const csvContent =
      ExportDataAsCsvToGoogleDriveHandler.parseBackupDataToCsv(content)
    await fsPromises.writeFile(BACKUP_FILE_NAME, csvContent, function (err) {
      console.log("err", err)
      if (err) throw err
      console.log("Saved!")
    })
  }
  /**
   * Insert a file in the application data folder and prints file Id
   * */
  static async uploadAppdata() {
    // Get credentials and build service
    const auth = await authorize()
    await ExportDataAsCsvToGoogleDriveHandler.createBackupDataCsv()

    const service = google.drive({ version: "v3", auth })
    const fileMetadata = {
      name: BACKUP_FILE_NAME,
      parents: [APP_DATA_FOLDER],
    }
    const media = {
      mimeType: "text/csv",
      body: fs.createReadStream(BACKUP_FILE_NAME),
    }
    try {
      const file = await service.files.create({
        resource: fileMetadata,
        media: media,
        fields: "id",
      })
      console.log("File Id:", file.data.id)
      return file.data.id
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      await ExportDataAsCsvToGoogleDriveHandler.deleteFile()
    }
  }

  async exportDataAsCsvToGoogleDrive() {
    try {
      const files = await ExportDataAsCsvToGoogleDriveHandler.uploadAppdata()
      return files
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

/**
 * List all files inserted in the application data folder
 * */
async function listAppdata() {
  const ac = authorize()
  const auth = new GoogleAuth({
    authClient: ac,
    scopes: "https://www.googleapis.com/auth/drive.appdata",
  })
  const service = google.drive({ version: "v3", auth })

  try {
    const res = await service.files.list({
      spaces: APP_DATA_FOLDER,
      name: BACKUP_FILE_NAME,
      fields: "nextPageToken, files(id, name, createdTime)",
      pageSize: 100,
    })

    res.data.files.forEach(function (file) {
      console.log("Found file:", file.name, file.id)
    })
    return res
  } catch (err) {
    // TODO(developer) - Handle error
    throw err
  }
}

/**
 * Downloads a file
 * @param{string} realFileId file ID
 * @return{obj} file status
 * */
const getBackupFileById = async (fileId) => {
  const ac = authorize()
  const auth = new GoogleAuth({
    authClient: ac,
    scopes: "https://www.googleapis.com/auth/drive.appdata",
  })
  const service = google.drive({ version: "v3", auth })

  try {
    const file = await service.files.get({
      fileId: fileId,
      alt: "media",
    })
    return file
  } catch (err) {
    console.error(err)
    throw err
  }
}

/**
 * Downloads a file
 * @param{data} string
 * @return{obj} file status
 * */
function parseCsv(data, fieldSeparator = ",", newLine = "\r\n") {
  fieldSeparator = fieldSeparator || ","
  newLine = newLine || "\n"
  const nSep = "\x1D"
  const nSepRe = new RegExp(nSep, "g")
  const qSep = "\x1E"
  const qSepRe = new RegExp(qSep, "g")
  const cSep = "\x1F"
  const cSepRe = new RegExp(cSep, "g")
  const fieldRe = new RegExp(
    "(^|[" +
      fieldSeparator +
      '\\n])"([^"]*(?:""[^"]*)*)"(?=($|[' +
      fieldSeparator +
      "\\n]))",
    "g",
  )
  return data
    .replace(/\r/g, "")
    .replace(/\n+$/, "")
    .replace(fieldRe, (match, p1, p2) => {
      return (
        p1 + p2.replace(/\n/g, nSep).replace(/""/g, qSep).replace(/,/g, cSep)
      )
    })
    .split(/\n/)
    .map((line) => {
      return line
        .split(fieldSeparator)
        .map((cell) =>
          cell
            .replace(nSepRe, newLine)
            .replace(qSepRe, '"')
            .replace(cSepRe, ","),
        )
    })
}

class ImportDataFromGoogleDriveHandler {
  static async removeAppdataFiles(idsToRemove) {
    const ac = authorize()
    const auth = new GoogleAuth({
      authClient: ac,
      scopes: "https://www.googleapis.com/auth/drive.appdata",
    })

    const service = google.drive({ version: "v3", auth })
    console.log("deleting", idsToRemove)
    await Promise.all(
      idsToRemove.map((id) =>
        service.files.delete({
          fileId: id,
        }),
      ),
    )
    console.log("deleted")
  }

  static async getBackupFile() {
    const backupFiles = await listAppdata()
    const newestFile = backupFiles.data.files?.[0]
    const fileIdsToRemove = backupFiles.data.files
      .map((file) => file.id)
      .filter((id) => id !== newestFile.id)
    await ImportDataFromGoogleDriveHandler.removeAppdataFiles(fileIdsToRemove)

    return newestFile
  }
  static async parseBackupFileToObj(backupFile) {
    const file = await getBackupFileById(backupFile.id)
    const csvAsText = file.data
    const csvArr = parseCsv(csvAsText)

    const headers = csvArr?.[0] || []
    const csvData = csvArr.slice(1)
    const csvObj = csvData.map((d) => {
      const row = {}
      headers.forEach((key, keyIdx) => {
        row[key] = d[keyIdx]
      })
      return row
    })
    return csvObj
  }
  static async dumpBackupObjFileToDb(backupFileObj) {
    const result = await bulkCreateItems({}, backupFileObj)
    return result
  }
  async importDataFromGoogleDrive() {
    const backupFile = await ImportDataFromGoogleDriveHandler.getBackupFile()
    const backupFileObj =
      await ImportDataFromGoogleDriveHandler.parseBackupFileToObj(backupFile)
    const result =
      await ImportDataFromGoogleDriveHandler.dumpBackupObjFileToDb(
        backupFileObj,
      )
    return result
  }
}

const importDataFromGoogleDrive = async () => {
  const handler = new ImportDataFromGoogleDriveHandler()
  const result = await handler.importDataFromGoogleDrive()
  return result
}

const exportDataAsCsvToGoogleDrive = async () => {
  const handler = new ExportDataAsCsvToGoogleDriveHandler()
  return await handler.exportDataAsCsvToGoogleDrive()
}

exports.getAuthorization = getAuthorization
exports.getListFiles = getListFiles
exports.exportDataAsCsvToGoogleDrive = exportDataAsCsvToGoogleDrive
exports.ExportDataAsCsvToGoogleDriveHandler =
  ExportDataAsCsvToGoogleDriveHandler
exports.importDataFromGoogleDrive = importDataFromGoogleDrive
