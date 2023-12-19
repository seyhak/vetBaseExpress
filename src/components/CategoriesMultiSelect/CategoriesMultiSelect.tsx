import { Checkbox, TextField, CircularProgress } from "@mui/material"
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete"
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank"
import CheckBoxIcon from "@mui/icons-material/CheckBox"
import { Category } from "types/category"
import { useCategoriesMultiSelectContext } from "./useCategoriesMultiSelectContext"
import { useCategoriesMultiSelect } from "./useCategoriesMultiSelect"

import "./CategoriesMultiSelect.sass"

const ICON = <CheckBoxOutlineBlankIcon fontSize="small" />
const CHECKED_ICON = <CheckBoxIcon fontSize="small" />

type CreatedCategory = { name: string; inputValue: string }
const filter = createFilterOptions<Category | CreatedCategory>()

export type CategoriesMultiSelectProps = {
  disabled?: boolean
  categoriesMultiSelectContextValue: ReturnType<
    typeof useCategoriesMultiSelectContext
  >
}
export const CategoriesMultiSelect = ({
  disabled = false,
  categoriesMultiSelectContextValue,
}: CategoriesMultiSelectProps) => {
  const {
    allCategories,
    isLoading,
    setIsOpen,
    categoriesMultiSelectValue: value,
    onChange,
  } = useCategoriesMultiSelect({ categoriesMultiSelectContextValue })

  return (
    <Autocomplete
      className="categories-multi-select"
      value={value}
      onChange={onChange}
      onOpen={() => {
        setIsOpen(true)
      }}
      onClose={() => {
        setIsOpen(false)
      }}
      filterOptions={(options: any[], params) => {
        const filtered = filter(options, params as any)

        const { inputValue } = params
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.name)
        if (inputValue !== "" && !isExisting) {
          const newOne: CreatedCategory = {
            inputValue,
            name: `Add "${inputValue}"`,
          }
          filtered.push(newOne)
        }

        return filtered
      }}
      options={allCategories}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option, { selected }) => {
        return (
          <li {...props}>
            <Checkbox
              icon={ICON}
              checkedIcon={CHECKED_ICON}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.name}
          </li>
        )
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Categories"
          placeholder="Pick categories"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      isOptionEqualToValue={(option, value) => {
        return option.name === value.name
      }}
      disabled={disabled}
      loading={isLoading}
      disableCloseOnSelect
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      multiple
    />
  )
}
