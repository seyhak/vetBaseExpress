const { synchronizeDb } = require("#root/electron-starter.func.ts")
const { Category } = require("#root/models/category.js")
const { CatalogueItem } = require("#root/models/catalogue-item.js")
const { ExportDataAsCsvToGoogleDriveHandler } = require("./google-drive")

describe("google-drive", () => {
  describe("ExportDataAsCsvToGoogleDriveHandler", () => {
    describe("getDatabaseBackup", () => {
      beforeEach(async () => {
        await synchronizeDb(true)
      })
      test("success", async () => {
        // create category1
        const category1 = await Category.create({ name: "white cat" })
        // create category2
        const category2 = await Category.create({ name: "black cat" })
        // create empty category
        await Category.create({ name: "cat with no children" })

        // add items
        const itemWithNoCategories = await CatalogueItem.create({
          name: "catless item",
        })
        const itemWith2Categories = await CatalogueItem.create({
          name: "item with 2 cats",
        })
        itemWith2Categories.addCategory([category1.id, category2.id])
        const itemWith1Category = await CatalogueItem.create({
          name: "item with cat",
        })
        itemWith1Category.addCategory([category1.id])

        expect(await Category.count()).toEqual(3)
        expect(await CatalogueItem.count()).toEqual(3)

        const result =
          await ExportDataAsCsvToGoogleDriveHandler.getDatabaseBackup()

        expect(await Category.count()).toEqual(3)
        expect(await CatalogueItem.count()).toEqual(3)
        expect(result).toEqual([
          {
            groupName: [],
            description: null,
            id: itemWithNoCategories.id,
            name: "catless item",
          },
          {
            groupName: ["white cat", "black cat"],
            description: null,
            id: itemWith2Categories.id,
            name: "item with 2 cats",
          },
          {
            groupName: ["white cat"],
            description: null,
            id: itemWith1Category.id,
            name: "item with cat",
          },
        ])
      })
    })
    describe("parseBackupDataToCsv", () => {
      it("returns proper value", () => {
        const input = [
          {
            groupName: [],
            description: null,
            id: "id1",
            name: "catless item",
          },
          {
            groupName: ["white cat", "black cat"],
            description: null,
            id: "id2",
            name: "item with 2 cats",
          },
          {
            groupName: ["white cat"],
            description: null,
            id: "id3",
            name: "item with cat",
          },
        ]

        const result =
          ExportDataAsCsvToGoogleDriveHandler.parseBackupDataToCsv(input)

        expect(typeof result).toEqual("string")
        expect(result).toEqual(
          '"id","name","description","groupName"\r\n"id1","catless item","",""\r\n"id2","item with 2 cats","","white cat,black cat"\r\n"id3","item with cat","","white cat"',
        )
      })
    })
  })
})
