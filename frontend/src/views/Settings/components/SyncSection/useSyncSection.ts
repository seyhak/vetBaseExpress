import { useState, ChangeEvent, useContext } from "react"
import { GetListCatalogueReturnGrouped } from "types/item"
import {
  handleCsvImport,
  processItemsAndDownloadAsCsv,
} from "./useSyncSection.utils"
import { AppSnackbarContext } from "contexts/AppSnackbarContext"

export const useSyncSection = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { setSnackbarState } = useContext(AppSnackbarContext)

  const onExportToCSVClick = async () => {
    setIsLoading(true)
    const isGrouped = true
    const items: GetListCatalogueReturnGrouped = await (
      window as any
    ).electronAPI.getListCatalogue(null, isGrouped)
    await processItemsAndDownloadAsCsv(items)
    setSnackbarState({
      type: "success",
      isOpened: true,
      message: "Export successful!",
    })
    setIsLoading(false)
  }

  const onImportFromCSVChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setIsLoading(true)
    try {
      await handleCsvImport(event.target.files?.[0] ?? null)
      setSnackbarState({
        isOpened: true,
        message: "Import Succeeded",
        type: "success",
      })
    } catch (err) {
      console.error(err)
      setSnackbarState({
        isOpened: true,
        message: "Import failed",
        type: "error",
      })
    }
    setIsLoading(false)
  }

  return {
    isLoading,
    onExportToCSVClick,
    onImportFromCSVChange,
  }
}
