import { Box, TextField, Divider } from "@mui/material"
import { default as Dialog, DialogProps } from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Button from "@mui/material/Button"
//ts part
import { BaseEditor } from "slate"
import { ReactEditor } from "slate-react"
import RichTextEditor from "components/RichTextEditor/RichTextEditor"
import { CategoriesMultiSelect } from "components/CategoriesMultiSelect/CategoriesMultiSelect"

import "./AddItemDialog.sass"
import { useAddItemDialog } from "./useAddItemDialog"

type CustomElement = { type: "paragraph"; children: CustomText[] }
type CustomText = { text: string }

export type AddItemDialogProps = {
  isAddingModalOpened: DialogProps["open"]
  handleModalClose: DialogProps["onClose"]
}

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}

export const AddItemDialog = ({
  isAddingModalOpened,
  handleModalClose,
}: AddItemDialogProps) => {
  const {
    onNameChange,
    editor,
    onConfirmClick,
    categoriesMultiSelectContext,
    onClose,
  } = useAddItemDialog({
    handleModalClose,
  })

  return (
    <Dialog
      open={isAddingModalOpened}
      onClose={onClose}
      className="add-item-dialog"
    >
      <DialogTitle>Add position to the catalogue</DialogTitle>
      <DialogContent dividers>
        <Box className="modal-add-position-wrapper">
          <TextField
            className="name-input"
            label="Title"
            variant="outlined"
            fullWidth
            required
            inputProps={{
              maxLength: 60,
            }}
            onChange={onNameChange}
          />
          <CategoriesMultiSelect
            categoriesMultiSelectContextValue={categoriesMultiSelectContext}
          />
          <Divider />
          <RichTextEditor editor={editor} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirmClick}>Confirm</Button>
      </DialogActions>
    </Dialog>
  )
}
