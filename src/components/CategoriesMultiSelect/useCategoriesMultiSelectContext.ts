import { createContext, useState } from "react"
import { Category } from "types/category"

export const useCategoriesMultiSelectContext = () => {
  const [savedCategoriesMultiSelectValue, setSavedCategoriesMultiSelectValue] =
    useState<Category[]>([])
  const [categoriesMultiSelectValue, setCategoriesMultiSelectValue] = useState<
    Category[]
  >([])

  return {
    categoriesMultiSelectValue,
    setCategoriesMultiSelectValue,
    savedCategoriesMultiSelectValue,
    setSavedCategoriesMultiSelectValue,
  }
}

export type CategoriesMultiSelectContextType = ReturnType<
  typeof useCategoriesMultiSelectContext
>
export const CategoriesMultiSelectContext =
  createContext<CategoriesMultiSelectContextType>({
    categoriesMultiSelectValue: [],
    setCategoriesMultiSelectValue: () => {},
    savedCategoriesMultiSelectValue: [],
    setSavedCategoriesMultiSelectValue: () => {},
  })
