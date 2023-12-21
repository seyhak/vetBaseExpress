import { createContext } from "react"
import {
  DEFAULT_SNACKBAR_STATE,
  useAppSnackbar,
} from "../components/AppSnackbar/useAppSnackbar"

type AppSnackbarContext = ReturnType<typeof useAppSnackbar>

export const AppSnackbarContext = createContext<AppSnackbarContext>({
  snackbarState: DEFAULT_SNACKBAR_STATE,
  setSnackbarState: () => {},
})
