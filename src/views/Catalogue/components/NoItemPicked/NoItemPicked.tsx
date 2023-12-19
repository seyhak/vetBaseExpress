import { Box } from "@mui/system"
import { Typography } from "@mui/material"
import CoronavirusIcon from "@mui/icons-material/Coronavirus"
import "./NoItemPicked.sass"

export const NoItemPicked = () => {
  return (
    <Box className="no-item-picked">
      <CoronavirusIcon className="icon" />
      <Typography>Pick something from the list</Typography>
    </Box>
  )
}
