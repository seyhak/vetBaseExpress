import { Box } from "@mui/system"
import "./Catalogue.sass"
import List from "@mui/material/List"
import { Divider } from "@mui/material"

import { NoItemPicked } from "./components/NoItemPicked/NoItemPicked"
import { ItemDetails } from "./components/ItemDetails/ItemDetails"
import { AddItemDialog } from "./components/AddItemDialog/AddItemDialog"
import { Controllers } from "./components/Controllers/Controllers"
import { useCatalogue } from "./useCatalogue"
import { CategoriesMultiSelectContext } from "components/CategoriesMultiSelect/useCategoriesMultiSelectContext"
import { CatalogueItem } from "./components/CatalogueItem/CatalogueItem"

export const Catalogue = () => {
  const {
    onDeleteClick,
    onAddClick,
    onEditClick,
    onSaveClick,
    selectedItem,
    itemsList,
    onItemClick,
    itemDetailed,
    onNameChange,
    isEditModeOn,
    editor,
    isAddingModalOpened,
    handleAddModalClose,
    categoriesMultiSelectContext,
  } = useCatalogue()

  return (
    <CategoriesMultiSelectContext.Provider value={categoriesMultiSelectContext}>
      <Box className="catalogue-view">
        <Controllers
          onDeleteClick={onDeleteClick}
          onAddClick={onAddClick}
          onEditClick={onEditClick}
          onSaveClick={onSaveClick}
          isItemSelected={!!selectedItem}
          isEditModeOn={isEditModeOn}
        />
        <Box className="list-wrapper">
          <List className="list">
            {itemsList?.map((listItem) => {
              return (
                <CatalogueItem
                  key={listItem?.id}
                  listItem={listItem}
                  selectedItem={selectedItem}
                  onItemClick={onItemClick}
                />
              )
            })}
          </List>
          <Divider orientation="vertical" className="line" />
          <Box className="detail-wrapper">
            {selectedItem ? (
              <ItemDetails
                itemDetailed={itemDetailed}
                onNameChange={onNameChange}
                isEditModeOn={isEditModeOn}
                editor={editor}
              />
            ) : (
              <NoItemPicked />
            )}
          </Box>
        </Box>
        <AddItemDialog
          isAddingModalOpened={isAddingModalOpened}
          handleModalClose={handleAddModalClose}
        />
      </Box>
    </CategoriesMultiSelectContext.Provider>
  )
}
