import { FromCsvImporter } from "./csv-importer"

const CSV_FILE_CONTENT =
  '"id","name","description","groupName"\r\n"bcee9bab-57c5-48d8-a2ab-8e10bceb3d6f","test item ABCD","[{""type"":""paragraph"",""children"":[{""text"":""""}]}]","dog,cat"\r\n"5faff6b3-e33d-45d3-bb72-a6758761cfe6","test item 2","[{""type"":""paragraph"",""children"":[{""text"":""""}]}]",""\r\n"91aa6cde-2231-4f9d-91e9-6823c67f7bf2","adsasd","[{""type"":""paragraph"",""children"":[{""text"":""""}]}]",""\r\n"24ae5e53-2c0e-44cc-bc8d-5bc728b17235","adadasd","[{""type"":""paragraph"",""children"":[{""text"":""""}]}]",""'

describe("csv-importer", () => {
  describe("FromCsvImporter", () => {
    test("getImportedCsvDataAsObj success", async () => {
      const file = new File([CSV_FILE_CONTENT], "test.csv", {
        type: "text/csv",
      })
      const processor = new FromCsvImporter(file)
      const data = await processor.getImportedCsvDataAsObj()
      expect(data).toEqual([
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
    test("getCsvAsArrayOfArrays success", async () => {
      const file = new File([CSV_FILE_CONTENT], "test.csv", {
        type: "text/csv",
      })
      const processor = new FromCsvImporter(file)
      const data = await processor.getCsvAsArrayOfArrays()

      expect(data).toEqual([
        ["id", "name", "description", "groupName"],
        [
          "bcee9bab-57c5-48d8-a2ab-8e10bceb3d6f",
          "test item ABCD",
          '[{"type":"paragraph","children":[{"text":""}]}]',
          "dog,cat",
        ],
        [
          "5faff6b3-e33d-45d3-bb72-a6758761cfe6",
          "test item 2",
          '[{"type":"paragraph","children":[{"text":""}]}]',
          "",
        ],
        [
          "91aa6cde-2231-4f9d-91e9-6823c67f7bf2",
          "adsasd",
          '[{"type":"paragraph","children":[{"text":""}]}]',
          "",
        ],
        [
          "24ae5e53-2c0e-44cc-bc8d-5bc728b17235",
          "adadasd",
          '[{"type":"paragraph","children":[{"text":""}]}]',
          "",
        ],
      ])
    })
  })
})
