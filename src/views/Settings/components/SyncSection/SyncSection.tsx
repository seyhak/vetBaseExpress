import { Box, Paper } from "@mui/material"
import ArticleIcon from "@mui/icons-material/Article"

import { useSyncSection } from "./useSyncSection"
import { GoogleDriveSync } from "../GoogleDriveSync/GoogleDriveSync"
import { ImportExportButtons } from "../ImportExportButtons/ImportExportButtons"
import "./SyncSection.sass"

export const SyncSection = () => {
  const { onExportToCSVClick, onImportFromCSVChange, isLoading } =
    useSyncSection()
  return (
    <Box className="sync-section">
      <Paper variant="outlined" square>
        <ImportExportButtons
          onExportClick={onExportToCSVClick}
          onImportChange={onImportFromCSVChange}
          icon={<ArticleIcon color="primary" />}
          isLoading={isLoading}
        />
      </Paper>
      <Paper variant="outlined" square>
        <GoogleDriveSync />
      </Paper>
    </Box>
  )
}
