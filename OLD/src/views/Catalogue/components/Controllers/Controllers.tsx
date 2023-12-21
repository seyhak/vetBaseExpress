import {
  Box,
  ButtonGroup,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material"
import { ConfirmDeleteButtonWithDialog } from "../ConfirmDeleteButtonWithDialog/ConfirmDeleteButtonWithDialog"

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import ModeEditIcon from "@mui/icons-material/ModeEdit"
import SaveIcon from "@mui/icons-material/Save"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import { useControllers } from "./useControllers"
import "./Controllers.sass"

export type ControllersProps = {
  isItemSelected: boolean
  isEditModeOn: boolean
  onAddClick: () => void
  onSaveClick: () => Promise<void>
  onEditClick: () => void
  onDeleteClick: () => Promise<void>
}
export const Controllers = ({
  isItemSelected,
  isEditModeOn,
  onAddClick,
  onSaveClick,
  onEditClick,
  onDeleteClick,
}: ControllersProps) => {
  const { search, onResetSearchClick } = useControllers()

  return (
    <Box className="controllers-wrapper">
      <Box className="search-status-wrapper">
        {!!search && (
          <Typography variant="h6">Results for "{search}"</Typography>
        )}
      </Box>
      <ButtonGroup
        variant="outlined"
        aria-label="outlined primary button group"
      >
        {!!search && (
          <Tooltip title="Reset search">
            <IconButton
              aria-label="reset-search"
              color="primary"
              onClick={onResetSearchClick}
            >
              <RestartAltIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Add position">
          <IconButton aria-label="add" color="primary" onClick={onAddClick}>
            <AddCircleOutlineIcon />
          </IconButton>
        </Tooltip>
        {isItemSelected && (
          <>
            {isEditModeOn && (
              <IconButton
                onClick={onSaveClick}
                aria-label="save"
                color="primary"
              >
                <SaveIcon />
              </IconButton>
            )}
            <Tooltip title="Edit position">
              <IconButton
                onClick={onEditClick}
                aria-label="edit"
                color="primary"
              >
                <ModeEditIcon />
              </IconButton>
            </Tooltip>
            <ConfirmDeleteButtonWithDialog onDeleteClick={onDeleteClick} />
          </>
        )}
      </ButtonGroup>
    </Box>
  )
}
