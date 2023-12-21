import CircularProgress from "@mui/material/CircularProgress"
import Box from "@mui/material/Box"

export const LoaderCircularIndeterminate = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress />
    </Box>
  )
}
