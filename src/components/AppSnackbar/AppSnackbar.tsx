import { Snackbar, Alert, AlertTitle, Typography } from "@mui/material"
import { AppSnackbarContext } from "contexts/AppSnackbarContext"
import { useCallback, useContext } from "react"

export const AppSnackbar = () => {
  const { snackbarState, setSnackbarState } = useContext(AppSnackbarContext)

  const onSnackbarClose = useCallback(() => {
    setSnackbarState((prevState) => ({
      ...prevState,
      isOpened: false,
    }))
  }, [setSnackbarState])

  return (
    <Snackbar
      open={snackbarState.isOpened}
      autoHideDuration={6000}
      onClose={onSnackbarClose}
      className="snackbar"
    >
      <Alert
        variant="filled"
        severity={snackbarState.type}
        className="snackbar-alert"
      >
        <AlertTitle>{snackbarState.type.toUpperCase()}</AlertTitle>
        <Typography className="message">
          {snackbarState.message || "Success!"}
        </Typography>
      </Alert>
    </Snackbar>
  )
}
