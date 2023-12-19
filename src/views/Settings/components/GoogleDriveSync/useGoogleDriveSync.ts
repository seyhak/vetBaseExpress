import { AppSnackbarContext } from "contexts/AppSnackbarContext"
import { useState, useCallback, useContext } from "react"
import withTimeout from "utils/with-timeout"

export const useGoogleDriveSync = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { setSnackbarState } = useContext(AppSnackbarContext)

  const onImportFromCloud = useCallback(async () => {
    setIsLoading(true)
    try {
      const items = await withTimeout(
        (window as any).electronAPI.importDataFromGoogleDrive(),
      )
      console.log("data imported from Google Drive!", { items })
      setSnackbarState((prevState) => ({
        ...prevState,
        isOpened: true,
        message: "Sync successful!",
      }))
    } catch (err) {
      console.error(err)
      setSnackbarState((prevState) => ({
        ...prevState,
        type: "error",
        isOpened: true,
        message: "Sync failed!",
      }))
    }

    setIsLoading(false)
  }, [setSnackbarState, setIsLoading])

  const onExportToCloud = useCallback(async () => {
    setIsLoading(true)
    try {
      const items = await withTimeout(
        (window as any).electronAPI.exportDataAsCsvToGoogleDrive(),
      )
      console.log({ items })

      setSnackbarState((prevState) => ({
        ...prevState,
        isOpened: true,
        message: "Sync successful!",
      }))
    } catch (err) {
      console.error(err)
      setSnackbarState((prevState) => ({
        ...prevState,
        type: "error",
        isOpened: true,
        message: "Sync failed!",
      }))
    }

    setIsLoading(false)
  }, [setSnackbarState])
  return { onImportFromCloud, isLoading, onExportToCloud }
}
