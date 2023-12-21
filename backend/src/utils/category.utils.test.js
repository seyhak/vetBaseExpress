const { synchronizeDb } = require("#root/electron-starter.func.ts")
const { Category } = require("#root/models/category.js")
const { getOrCreateCategoryByNames } = require("./category.utils")

describe("category.utils", () => {
  describe("getOrCreateCategoryByNames", () => {
    beforeEach(async () => {
      await synchronizeDb(true)
    })
    test("success, no preexisting categories", async () => {
      const result = await getOrCreateCategoryByNames(["dog", "cat"])
      expect(result).toEqual([
        expect.objectContaining({
          createdAt: expect.anything(),
          id: expect.any(String),
          name: "dog",
          updatedAt: expect.anything(),
        }),
        expect.objectContaining({
          createdAt: expect.anything(),
          id: expect.any(String),
          name: "cat",
          updatedAt: expect.anything(),
        }),
      ])
    })
    test("success, has preexisting categories", async () => {
      const dogCategory = await Category.create({ name: "dog" })
      const result = await getOrCreateCategoryByNames(["dog", "cat"])

      expect(result).toEqual([
        expect.objectContaining({
          createdAt: dogCategory.dataValues.createdAt,
          id: dogCategory.dataValues.id,
          description: null,
          name: "dog",
          updatedAt: dogCategory.dataValues.updatedAt,
        }),
        expect.objectContaining({
          createdAt: expect.anything(),
          id: expect.any(String),
          name: "cat",
          updatedAt: expect.anything(),
        }),
      ])
    })
  })
})
