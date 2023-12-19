export type CsvRowObj = { [key: string]: string }
/**
 * Returns CSV string splitted into rows and columns, remove doublequotes
 * https://github.com/peterthoeny/parse-csv-js, MIT License
 * @param {newLine} new line symbol.
 */
export function parseCsv(data: string, fieldSeparator = ",", newLine = "\r\n") {
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

export class FromCsvImporter {
  csvFile: globalThis.File | null

  constructor(csvFile: globalThis.File | null) {
    this.csvFile = csvFile
  }

  private async readCsvFileToTxt() {
    const csvText = await new Promise<string | undefined>((resolve) => {
      const reader = new FileReader()
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const csvText = event.target!.result?.toString()
        resolve(csvText)
      }

      if (this.csvFile) {
        reader.readAsText(this.csvFile)
      }
    })
    return csvText
  }
  private convertCsvTextToObj(data: string[][]) {
    const isFileNotEmpty = !!data && data.length > 1
    const headers = isFileNotEmpty ? data[0] : []
    const rows = isFileNotEmpty ? data.slice(1) : []

    const parsedData = rows.map((row, rowIdx) => {
      const rowObj = {} as CsvRowObj
      row.forEach((cell: string, colIdx: number) => {
        const key = headers[colIdx]
        rowObj[key] = cell
      })
      // rowObj["id"] = rowIdx
      return rowObj
    })
    return parsedData
    // to use when adding preview
    // return {
    //   headers: headers.map((col: string) => ({
    //     field: col,
    //     flex: 1,
    //     minWidth: 100,
    //   })),
    //   data: parsedData
    // }
  }
  async getCsvAsArrayOfArrays() {
    const csvText = await this.readCsvFileToTxt()
    const data = csvText ? parseCsv(csvText) : []
    return data
  }
  async getImportedCsvDataAsObj() {
    const data = await this.getCsvAsArrayOfArrays()
    const csvObj = this.convertCsvTextToObj(data)
    return csvObj
  }
}
