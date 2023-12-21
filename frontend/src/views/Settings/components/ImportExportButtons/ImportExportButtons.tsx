import { ReactElement } from "react"
import {
  Box,
  IconButton,
  Tooltip,
  Button,
  IconButtonProps,
} from "@mui/material"
import { snakeCase } from "lodash"

import FileDownloadIcon from "@mui/icons-material/FileDownload"
import UploadIcon from "@mui/icons-material/Upload"
import { LoaderCircularIndeterminate } from "components/LoaderCircularIndeterminate/LoaderCircularIndeterminate"

import "./ImportExportButtons.sass"

export type ImportExportButtonsProps = {
  onExportClick?: IconButtonProps["onClick"]
  exportButtonTitle?: string
  onImportChange?: React.InputHTMLAttributes<HTMLInputElement>["onChange"]
  importButtonTitle?: string
  onImportClick?: IconButtonProps["onClick"]
  icon?: ReactElement
  isLoading?: boolean
}
export const ImportExportButtons = ({
  exportButtonTitle = "Export data to CSV",
  onExportClick,
  importButtonTitle = "Import data from CSV",
  onImportChange,
  onImportClick,
  icon,
  isLoading,
}: ImportExportButtonsProps) => {
  return (
    <Box className="import-export-buttons">
      {icon && <div className="icon-wrapper">{icon}</div>}
      <Box className="buttons-wrapper">
        {isLoading ? (
          <LoaderCircularIndeterminate />
        ) : (
          <>
            <Tooltip title={exportButtonTitle}>
              <IconButton
                size="large"
                aria-label={snakeCase(exportButtonTitle)}
                color="primary"
                onClick={onExportClick}
              >
                <UploadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={importButtonTitle}>
              {onImportChange ? (
                <Button
                  className="import-button"
                  size="large"
                  component="label"
                  aria-label={snakeCase(importButtonTitle)}
                  color="primary"
                >
                  <input
                    type="file"
                    onChange={onImportChange}
                    className="file-input"
                    accept=".csv"
                  />
                  <FileDownloadIcon />
                </Button>
              ) : (
                <IconButton
                  size="large"
                  aria-label={snakeCase(importButtonTitle)}
                  color="primary"
                  onClick={onImportClick}
                >
                  <FileDownloadIcon />
                </IconButton>
              )}
            </Tooltip>
          </>
        )}
      </Box>
    </Box>
  )
}
