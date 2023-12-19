import { Box } from "@mui/material"

import { useSettings } from "views/Settings/useSettings"

import { SectionControllers } from "./components/SectionControllers/SectionControllers"
import { SyncSection } from "./components/SyncSection/SyncSection"
import "./Settings.sass"

export const Settings = () => {
  const { selectedSection, onSectionIconClick } = useSettings()

  return (
    <Box className="settings-view">
      <SectionControllers
        selectedSection={selectedSection}
        onSectionIconClick={onSectionIconClick}
      />
      <Box className="settings-content">
        <SyncSection />
      </Box>
    </Box>
  )
}
