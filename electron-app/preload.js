const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("electronAPI", {
  getListCatalogue: (searchPhase, grouped) =>
    ipcRenderer.invoke("catalogue:getListCatalogue", searchPhase, grouped),
  createItem: (payload) => ipcRenderer.invoke("catalogue:createItem", payload),
  getDetailedItem: (id) => ipcRenderer.invoke("catalogue:getDetailedItem", id),
  destroyItemById: (id) => ipcRenderer.invoke("catalogue:destroyItemById", id),
  updateItem: (id, content) =>
    ipcRenderer.invoke("catalogue:updateItem", id, content),
  getListCategories: (searchPhase) =>
    ipcRenderer.invoke("catalogue:getListCategories", searchPhase),
  createCategory: (name, description) =>
    ipcRenderer.invoke("catalogue:createCategory", name, description),
  getDetailedCategory: (id) =>
    ipcRenderer.invoke("catalogue:getDetailedCategory", id),
  destroyCategoryById: (id) =>
    ipcRenderer.invoke("catalogue:destroyCategoryById", id),
  updateCategory: (id, content) =>
    ipcRenderer.invoke("catalogue:updateCategory", id, content),
  bulkCreateItems: (items) =>
    ipcRenderer.invoke("import:bulkCreateItems", items),
  getAuthorization: () => ipcRenderer.invoke("google-drive:getAuthorization"),
  getListFiles: () => ipcRenderer.invoke("google-drive:getListFiles"),
  exportDataAsCsvToGoogleDrive: () =>
    ipcRenderer.invoke("google-drive:exportDataAsCsvToGoogleDrive"),
  importDataFromGoogleDrive: () =>
    ipcRenderer.invoke("google-drive:importDataFromGoogleDrive"),
})
