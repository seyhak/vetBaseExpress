import classNames from "classnames"
import { Box, ButtonGroup, IconButton, Tooltip } from "@mui/material"

import SyncAltIcon from "@mui/icons-material/SyncAlt"
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined"
import "./SectionControllers.sass"
import { SettingsSections, useSettings } from "views/Settings/useSettings"

export type SectionControllersProps = {
  selectedSection: ReturnType<typeof useSettings>["selectedSection"]
  onSectionIconClick: ReturnType<typeof useSettings>["onSectionIconClick"]
}
export const SectionControllers = ({
  selectedSection,
  onSectionIconClick,
}: SectionControllersProps) => {
  return (
    <Box className="controllers-wrapper">
      <ButtonGroup
        variant="outlined"
        aria-label="outlined primary button group"
      >
        <Tooltip title="Import/Export to CSV">
          <IconButton
            className={classNames({
              selected: selectedSection === SettingsSections.Sync,
            })}
            aria-label="sync"
            color="primary"
            onClick={() => onSectionIconClick(SettingsSections.Sync)}
          >
            <SyncAltIcon />
          </IconButton>
        </Tooltip>
      </ButtonGroup>
    </Box>
  )
}
