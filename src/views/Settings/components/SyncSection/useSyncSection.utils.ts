import { pick } from "lodash"
import { GetListCatalogueReturnGrouped } from "types/item"
import { FromCsvImporter } from "utils/csv-importer"

type ItemIdToItemDetails = {
  [key: string]: {
    id: string
    name: string
    description: string
    groups: {
      id: string
      name: string
      description: string
    }[]
  }
}
const CSV_HEADER = ["id", "name", "description", "groupName"]

class CsvExporter {
  items: GetListCatalogueReturnGrouped

  constructor(catalogueItems: GetListCatalogueReturnGrouped) {
    this.items = catalogueItems
  }
  private static processGroupedItemsToCSVformat = async (
    items: GetListCatalogueReturnGrouped,
  ) => {
    const result = await new Promise<ItemIdToItemDetails>((resolve, reject) => {
      const allItems = []
      const itemIdToItemDetails: ItemIdToItemDetails = {}
      items.forEach((item) => {
        const isCategory = !!item?.items
        if (isCategory) {
          const category = item
          item.items!.forEach((categoryItem) => {
            const itemAlreadyInDict = !!itemIdToItemDetails[categoryItem.id]
            const pickedCategory = pick(category, ["id", "name", "description"])
            if (!itemAlreadyInDict) {
              const details = {
                ...pick(categoryItem, ["id", "name", "description"]),
                groups: [pickedCategory],
              }
              itemIdToItemDetails[categoryItem.id] = details
            } else {
              itemIdToItemDetails[categoryItem.id].groups.push(pickedCategory)
            }
            allItems.push({
              ...pick(categoryItem, ["id", "name", "description"]),
            })
          })
        } else {
          const details = {
            ...pick(item!, ["id", "name", "description"]),
            groups: [],
          }
          itemIdToItemDetails[item!.id] = details
        }
      })
      resolve(itemIdToItemDetails)
    })
    return result
  }
  private static getDictToArray = (dict: ItemIdToItemDetails) => {
    const array = [CSV_HEADER]
    Object.values(dict).forEach((item) => {
      const groupNames = item.groups.map((group) => group.name).toString()
      array.push([item.id, item.name, item.description, groupNames])
    })
    return array
  }

  /** Convert a 2D array into a CSV string
   */
  private static arrayToCsv(data: any[][]) {
    return data
      .map(
        (row) =>
          row
            .map(String) // convert every value to String
            .map((v) => v.replaceAll('"', '""')) // escape double quotes
            .map((v) => `"${v}"`) // quote it
            .join(","), // comma-separated
      )
      .join("\r\n") // rows starting on new lines
  }

  /** Download contents as a file
   * Source: https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
   */
  private static downloadBlobCsv(
    content: string,
    defaultFilename: null | string = null,
    contentType = "text/csv;charset=utf-8;",
  ) {
    // Create a blob
    const blob = new Blob([content], { type: contentType })
    const url = URL.createObjectURL(blob)

    // Create a link to download it
    const pom = document.createElement("a")
    pom.href = url
    const filename = defaultFilename || new Date().toDateString()
    pom.setAttribute("download", `VetBaseElectron Export ${filename}.csv`)
    pom.click()
  }
  private static generateCSVfromProcessedData(
    processedData: ItemIdToItemDetails,
  ) {
    const contentArray = CsvExporter.getDictToArray(processedData)
    const content = CsvExporter.arrayToCsv(contentArray)
    CsvExporter.downloadBlobCsv(content)
  }
  public async processItemsAndDownloadAsCsv() {
    const processedData = await CsvExporter.processGroupedItemsToCSVformat(
      this.items,
    )
    CsvExporter.generateCSVfromProcessedData(processedData)
  }
}

export const processItemsAndDownloadAsCsv = async (
  items: GetListCatalogueReturnGrouped,
) => {
  const processor = new CsvExporter(items)
  await processor.processItemsAndDownloadAsCsv()
}

export const handleCsvImport = async (csvFile: File | null) => {
  const processor = new FromCsvImporter(csvFile)
  const data = await processor.getImportedCsvDataAsObj()
  try {
    await (window as any).electronAPI.bulkCreateItems(data)
  } catch (err) {
    console.error(err)
    throw err
  }
}
