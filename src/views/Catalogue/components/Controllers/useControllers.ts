import { useState, useEffect, useCallback } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ViewsPaths } from "types/routes.types"

export const useControllers = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [search, setSearch] = useState<null | string>(null)

  useEffect(() => {
    const newSearch =
      Object.fromEntries(new URLSearchParams(location.search))?.search || null
    setSearch(newSearch)
  }, [location])

  const onResetSearchClick = useCallback(() => {
    navigate({
      pathname: ViewsPaths.Catalogue,
    })
  }, [navigate])

  return {
    search,
    onResetSearchClick,
  }
}
