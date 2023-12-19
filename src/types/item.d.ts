import { Descendant } from "slate"
import { Category } from "./category"
import { ModelTimestamps } from "./common"

export type CatalogueItem = {
  id: string
  name: string
  description: string
  groupId: string | null
}

export type Item =
  | ({
      items?: CatalogueItem[]
    } & CatalogueItem)
  | null

export type ItemDetailed =
  | ({
      description: Descendant[]
      photos: string[]
      Categories: Category
      // notes: string
    } & Item &
      ModelTimestamps)
  | null

export type GetListCatalogueReturnItemDetailed = CatalogueItem
export type GetListCatalogueReturnGrouped = Required<Item[]>
