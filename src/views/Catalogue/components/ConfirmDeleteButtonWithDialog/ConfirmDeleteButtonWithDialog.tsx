import { useState } from "react"
import DeleteIcon from "@mui/icons-material/Delete"
import {
  Button,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material"
import "./ConfirmDeleteButtonWithDialog.sass"

export type ConfirmDeleteButtonWithDialogProps = {
  onDeleteClick: VoidFunction
}

export const ConfirmDeleteButtonWithDialog = ({
  onDeleteClick,
}: ConfirmDeleteButtonWithDialogProps) => {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleConfirm = () => {
    setOpen(false)
    onDeleteClick()
  }
  const handleReject = () => {
    setOpen(false)
  }
  return (
    <>
      <IconButton
        onClick={handleClickOpen}
        aria-label="delete"
        className="delete-btn"
      >
        <DeleteIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleReject}
        className="confirm-delete-dialog"
        aria-labelledby="alert-dialog-name"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-name">Confirm deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This operation is irreversable
          </DialogContentText>
        </DialogContent>
        <Divider className="divider" />
        <DialogActions>
          <Button onClick={handleReject}>Cancel</Button>
          <Button onClick={handleConfirm} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
