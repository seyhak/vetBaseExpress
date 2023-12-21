import { useCallback } from "react"
import { Tab, Tabs } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import { Box } from "@mui/system"
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined"

import Search from "./views/Search/Search"
import { Routes, Route } from "react-router-dom"
import { Catalogue } from "./views/Catalogue/Catalogue"
import { AppSnackbar } from "components/AppSnackbar/AppSnackbar"
import { Settings } from "views/Settings/Settings"
import { ViewsPaths } from "types/routes.types"
import "./App.sass"
import { useAppSnackbar } from "components/AppSnackbar/useAppSnackbar"
import { AppSnackbarContext } from "contexts/AppSnackbarContext"

const App = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const onTabClick = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      navigate(newValue)
    },
    [navigate],
  )
  const useAppSnackbarValue = useAppSnackbar()

  return (
    <Box className="App">
      <Box className="navbar-container">
        <Tabs
          value={location.pathname}
          onChange={onTabClick}
          aria-label="navigation tabs"
        >
          <Tab label="Search" value={ViewsPaths.Search} />
          <Tab label="Catalogue" value={ViewsPaths.Catalogue} />
          <Tab
            icon={<SettingsOutlinedIcon />}
            aria-label="settings"
            className="settings-tab"
            value={ViewsPaths.Settings}
          />
        </Tabs>
      </Box>
      <AppSnackbarContext.Provider value={useAppSnackbarValue}>
        <Box className="content-container">
          <Routes>
            <Route path={ViewsPaths.Search} element={<Search />} />
            <Route path={ViewsPaths.Catalogue} element={<Catalogue />} />
            <Route path={ViewsPaths.Settings} element={<Settings />} />
          </Routes>
        </Box>
        <AppSnackbar />
      </AppSnackbarContext.Provider>
    </Box>
  )
}

export default App
