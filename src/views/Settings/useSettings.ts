import { useState } from "react"

export enum SettingsSections {
  Sync,
}

export const useSettings = () => {
  const [selectedSection, setSelectedSection] = useState<SettingsSections>(
    SettingsSections.Sync,
  )

  const onSectionIconClick = (section: SettingsSections) => {
    setSelectedSection(section)
  }
  return {
    selectedSection,
    onSectionIconClick,
  }
}
