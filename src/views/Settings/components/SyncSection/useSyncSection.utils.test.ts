import { handleCsvImport } from "./useSyncSection.utils"

const CSV_FILE_CONTENT =
  '"id","name","description","groupName"\r\n"bcee9bab-57c5-48d8-a2ab-8e10bceb3d6f","test item ABCD","[{""type"":""paragraph"",""children"":[{""text"":""""}]}]","dog,cat"\r\n"5faff6b3-e33d-45d3-bb72-a6758761cfe6","test item 2","[{""type"":""paragraph"",""children"":[{""text"":""""}]}]",""\r\n"91aa6cde-2231-4f9d-91e9-6823c67f7bf2","adsasd","[{""type"":""paragraph"",""children"":[{""text"":""""}]}]",""\r\n"24ae5e53-2c0e-44cc-bc8d-5bc728b17235","adadasd","[{""type"":""paragraph"",""children"":[{""text"":""""}]}]",""'

describe("useSyncSection.utils.test", () => {
  const mockBulkCreateItems = jest.fn()
  beforeEach(() => {
    ;(window as any).electronAPI = {
      bulkCreateItems: mockBulkCreateItems,
    }
  })
  describe("handleCsvImport", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })
    test("success", async () => {
      const file = new File([CSV_FILE_CONTENT], "test.csv", {
        type: "text/csv",
      })
      const result = await handleCsvImport(file)
      expect(result).toBeUndefined()
      expect(mockBulkCreateItems).toBeCalledWith([
        {
          description: '[{"type":"paragraph","children":[{"text":""}]}]',
          groupName: "dog,cat",
          id: "bcee9bab-57c5-48d8-a2ab-8e10bceb3d6f",
          name: "test item ABCD",
        },
        {
          description: '[{"type":"paragraph","children":[{"text":""}]}]',
          groupName: "",
          id: "5faff6b3-e33d-45d3-bb72-a6758761cfe6",
          name: "test item 2",
        },
        {
          description: '[{"type":"paragraph","children":[{"text":""}]}]',
          groupName: "",
          id: "91aa6cde-2231-4f9d-91e9-6823c67f7bf2",
          name: "adsasd",
        },
        {
          description: '[{"type":"paragraph","children":[{"text":""}]}]',
          groupName: "",
          id: "24ae5e53-2c0e-44cc-bc8d-5bc728b17235",
          name: "adadasd",
        },
      ])
    })
    test("error", async () => {
      const mockConsole = jest.fn()
      jest.spyOn(console, "error").mockImplementation((err) => mockConsole(err))
      mockBulkCreateItems.mockImplementation(() => {
        throw new Error("test error")
      })
      const file = new File([CSV_FILE_CONTENT], "test.csv", {
        type: "text/csv",
      })
      await expect(handleCsvImport(file)).rejects.toThrowError("test error")
      expect(mockConsole).toBeCalled()
      expect(mockBulkCreateItems).toBeCalledWith([
        {
          description: '[{"type":"paragraph","children":[{"text":""}]}]',
          groupName: "dog,cat",
          id: "bcee9bab-57c5-48d8-a2ab-8e10bceb3d6f",
          name: "test item ABCD",
        },
        {
          description: '[{"type":"paragraph","children":[{"text":""}]}]',
          groupName: "",
          id: "5faff6b3-e33d-45d3-bb72-a6758761cfe6",
          name: "test item 2",
        },
        {
          description: '[{"type":"paragraph","children":[{"text":""}]}]',
          groupName: "",
          id: "91aa6cde-2231-4f9d-91e9-6823c67f7bf2",
          name: "adsasd",
        },
        {
          description: '[{"type":"paragraph","children":[{"text":""}]}]',
          groupName: "",
          id: "24ae5e53-2c0e-44cc-bc8d-5bc728b17235",
          name: "adadasd",
        },
      ])
    })
  })
})
