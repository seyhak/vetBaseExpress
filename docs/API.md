# ELECTRON API

## catalogue item

#### getListCatalogue

CatalogueItem:

```
{
    id: UUID,
    name: string,
    description: JSON for richEditor (may need JSON.parse)
}
```

```
getListCatalogue(event, searchPhase?: string, grouped?: boolean) -> CatalogueItem[]
```

or

```
{
    grouped: {
        <category name>: CatalogueItem[],
        ...
    },
    groupless: CatalogueItem[]
}
```

#### createItem

```
createItem(event, { name, description, categoryIds }) -> str(error JSON) | undefined
```

#### getDetailedItem

```
getDetailedItem(event, id) -> str{
    id: UUID
    name: string
    description: JSON for richEditor
    createdAt: string
    updatedAt: string:
    Categories: [
        id: UUID,
        name: string,
        description: string,
        updatedAt: string
    ]
}
```

#### destroyItemById

```
destroyItemById(event, id) -> undefined
```

#### updateItem

```
updateItem(event, id, content: item properties) -> undefined | error
```

#### bulkCreateItems

```
items: ex.{
    description: '[{"type":"paragraph","children":[{"text":""}]}]',
    groupName: "dog,cat",
    id: "bcee9bab-57c5-48d8-a2ab-8e10bceb3d6f",
    name: "test item ABCD",
}
bulkCreateItems(event, items) -> string
```

## category

#### getListCatalogue

```
getListCatalogue(event, searchPhase) -> {
    id: UUID,
    name: string,
    description: JSON for richEditor (may need JSON.parse)
}
```

#### createCategory

```
createCategory(event, name, description = "") -> {
    id: UUID,
    name: string,
    description: JSON for richEditor (may need JSON.parse)
}
```

#### getDetailedCategory

```
getDetailedCategory(event, id) -> str{
    id: UUID,
    name: string,
    description: string,
    updatedAt: string
}
```

#### destroyCategoryById

```
destroyCategoryById(event, id) -> undefined
```

#### updateCategory

```
updateCategory(event, id, content) -> undefined
```

## google-drive

#### importDataFromGoogleDrive

imports data from file from GoogleDrive to DB

```
importDataFromGoogleDrive() -> string
```

#### exportDataAsCsvToGoogleDrive

exports data to file in GoogleDrive

```
exportDataAsCsvToGoogleDrive() -> createdFileId
```
