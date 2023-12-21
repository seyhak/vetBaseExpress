import { useState } from "react"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import { Collapse } from "@mui/material"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import { Item } from "types/item"
import { useCatalogue } from "views/Catalogue/useCatalogue"

import "./CatalogueItem.sass"

export type CatalogueItemProps = {
  listItem: Item
  selectedItem: Item
  onItemClick: ReturnType<typeof useCatalogue>["onItemClick"]
}
export const CatalogueItem = ({
  listItem,
  selectedItem,
  onItemClick,
}: CatalogueItemProps) => {
  const [isCollapseOpened, setIsCollapseOpened] = useState(true)
  const onExpandClick = () => {
    setIsCollapseOpened((prevVal) => !prevVal)
  }
  const categoryItems = listItem!.items

  return (
    <>
      {categoryItems ? (
        <>
          <ListItem key={listItem?.id} disablePadding>
            <ListItemButton
              onClick={onExpandClick}
              selected={selectedItem?.id === listItem?.id}
            >
              <ListItemText primary={listItem?.name} />
              {isCollapseOpened ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse timeout="auto" in={isCollapseOpened}>
            {categoryItems.map((item, idx) => (
              <ListItem
                key={`${listItem?.id}-${item.id}`}
                dense
                divider={categoryItems.length - 1 === idx}
                disablePadding
              >
                <ListItemButton
                  onClick={() => onItemClick(item)}
                  selected={selectedItem?.id === item?.id}
                >
                  <ListItemText primary={item?.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </Collapse>
        </>
      ) : (
        <ListItem key={listItem?.id} dense disablePadding>
          <ListItemButton
            onClick={() => onItemClick(listItem)}
            selected={selectedItem?.id === listItem?.id}
          >
            <ListItemText primary={listItem?.name} />
          </ListItemButton>
        </ListItem>
      )}
    </>
  )
}
