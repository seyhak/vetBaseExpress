import { useState } from "react"
import { AlertColor } from "@mui/material"

type SnackbarDetails = {
  isOpened: boolean
  message: string
  type: AlertColor
}
export const DEFAULT_SNACKBAR_STATE: SnackbarDetails = {
  isOpened: false,
  message: "",
  type: "success",
}

export const useAppSnackbar = () => {
  const [snackbarState, setSnackbarState] = useState<SnackbarDetails>(
    DEFAULT_SNACKBAR_STATE,
  )
  return {
    snackbarState,
    setSnackbarState,
  }
}
