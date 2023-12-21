// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron")
const catalogueItemAPI = require("./api/catalogue-item/catalogue-item")
const categoryAPI = require("./api/category/category")
const googleDriveAPI = require("./api/google-drive/google-drive")
const path = require("node:path")
const { synchronizeDb } = require("./electron-starter.func.ts")
const { exec } = require("child_process")

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    // fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
    },
    title: "My App",
    icon: path.join(__dirname, "./images/icon.jpeg"),
  })

  synchronizeDb(false, false)
  // and load the index.html of the app.
  const isDev = !!process.env.REACT_APP_DEV

  if (isDev) {
    mainWindow.loadURL("http://localhost:3000")
    // Open the DevTools.
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile("build/index.html")
  }
  // mainWindow.loadFile(path.join(__dirname, "build/index.html"))
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app
  .whenReady()
  .then(() => {
    exec("yarn run migrateup", (err, stdout, stderr) => {
      if (err) {
        console.error("Error running migrations:", err)
      } else {
        console.log("Migrations completed successfully.")
        createWindow()

        app.on("activate", function () {
          // On macOS it's common to re-create a window in the app when the
          // dock icon is clicked and there are no other windows open.
          if (BrowserWindow.getAllWindows().length === 0) createWindow()
        })
      }
    })
  })
  .then(() => {
    ipcMain.handle(
      "catalogue:getListCatalogue",
      catalogueItemAPI.getListCatalogue,
    )
    ipcMain.handle("catalogue:createItem", catalogueItemAPI.createItem)
    ipcMain.handle(
      "catalogue:getDetailedItem",
      catalogueItemAPI.getDetailedItem,
    )
    ipcMain.handle(
      "catalogue:destroyItemById",
      catalogueItemAPI.destroyItemById,
    )
    ipcMain.handle("catalogue:updateItem", catalogueItemAPI.updateItem)
    ipcMain.handle("catalogue:getListCategories", categoryAPI.getListCategories)
    ipcMain.handle(
      "catalogue:getDetailedCategory",
      categoryAPI.getDetailedCategory,
    )
    ipcMain.handle("catalogue:createCategory", categoryAPI.createCategory)
    ipcMain.handle(
      "catalogue:destroyCategoryById",
      categoryAPI.destroyCategoryById,
    )
    ipcMain.handle("catalogue:updateCategory", categoryAPI.updateCategory)
    ipcMain.handle("import:bulkCreateItems", catalogueItemAPI.bulkCreateItems)
    ipcMain.handle(
      "google-drive:getAuthorization",
      googleDriveAPI.getAuthorization,
    )
    ipcMain.handle("google-drive:getListFiles", googleDriveAPI.getListFiles)
    ipcMain.handle(
      "google-drive:exportDataAsCsvToGoogleDrive",
      googleDriveAPI.exportDataAsCsvToGoogleDrive,
    )
    ipcMain.handle(
      "google-drive:importDataFromGoogleDrive",
      googleDriveAPI.importDataFromGoogleDrive,
    )
  })

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
