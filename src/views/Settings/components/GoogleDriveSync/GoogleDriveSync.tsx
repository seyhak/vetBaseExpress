import CloudSyncIcon from "@mui/icons-material/CloudSync"
import { useGoogleDriveSync } from "./useGoogleDriveSync"
import { ImportExportButtons } from "../ImportExportButtons/ImportExportButtons"

export type GoogleDriveSyncProps = {}

export const GoogleDriveSync = ({}: GoogleDriveSyncProps) => {
  const { onImportFromCloud, onExportToCloud, isLoading } = useGoogleDriveSync()

  return (
    <ImportExportButtons
      onExportClick={onExportToCloud}
      exportButtonTitle="Export data to cloud"
      onImportClick={onImportFromCloud}
      importButtonTitle="Import data from cloud"
      icon={<CloudSyncIcon color="primary" />}
      isLoading={isLoading}
    />
  )
}
