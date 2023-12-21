const { Sequelize, Op } = require("sequelize")
const { difference, pick } = require("lodash")
const { Category } = require("#root/models/category.js")
const { CatalogueItem } = require("#root/models/catalogue-item.js")
const { CATEGORY_KEYS } = require("#root/constants.ts")
const { getOrCreateCategoryByNames } = require("#root/utils/category.utils.js")

const handleCategoriesAddRemove = async (
  categoryIds,
  catalogueItem,
  remove = false,
) => {
  const categories = await Category.findAll({
    where: {
      id: {
        [Sequelize.Op.in]: categoryIds,
      },
    },
  })
  if (remove) {
    await catalogueItem.removeCategory(categories)
  } else {
    await catalogueItem.addCategory(categories)
  }
}

const REQUIRED_KEYS = ["id", "name", "description"]

const getFormattedItem = (item, categoryId) => {
  return {
    ...item,
    groupId: categoryId,
  }
}

const getFormattedCategory = (category, items) => {
  return {
    ...pick(category, REQUIRED_KEYS),
    groupId: null,
    items: items.map((item) => getFormattedItem(item, category.id)),
  }
}

const getCatalogueItemsGroupedByCategories = (items) => {
  const result = {
    grouped: {},
    groupless: [],
  }
  const categories = {}

  items.forEach((item) => {
    const pickedItem = pick(item, REQUIRED_KEYS)
    const itemCategories = item.Categories
    const hasGroups = !!itemCategories.length

    if (hasGroups) {
      itemCategories.forEach((category) => {
        const alreadyInGrouped = !!result.grouped[category.name]
        const shouldAddToCategoriesDict = !categories[category.name]
        if (shouldAddToCategoriesDict) {
          categories[category.name] = pick(category, REQUIRED_KEYS)
        }
        if (!alreadyInGrouped) {
          result.grouped[category.name] = []
        }
        const group = result.grouped[category.name]
        group.push(getFormattedItem(pickedItem, category.id))
      })
    } else {
      result.groupless.push(getFormattedItem(pickedItem, null))
    }
  })
  const resultList = []
  Object.keys(result.grouped).forEach((groupName) => {
    const groupItems = result.grouped[groupName]
    const resultCategory = getFormattedCategory(
      categories[groupName],
      groupItems,
    )
    resultList.push(resultCategory)
  })
  resultList.push(...result.groupless)
  return resultList
}

const getListCatalogue = async (event, searchPhase, grouped = false) => {
  const where = searchPhase
    ? {
        [Op.or]: [
          Sequelize.where(
            Sequelize.fn("UPPER", Sequelize.col("CatalogueItem.name")),
            {
              [Op.substring]: searchPhase,
            },
          ),
          Sequelize.where(
            Sequelize.fn("UPPER", Sequelize.col("CatalogueItem.description")),
            {
              [Op.substring]: searchPhase,
            },
          ),
          grouped &&
            Sequelize.where(
              Sequelize.fn("UPPER", Sequelize.col("Categories.name")),
              {
                [Op.substring]: searchPhase,
              },
            ),
        ],
      }
    : {}

  const include = grouped ? { model: Category } : null
  try {
    const items = await CatalogueItem.findAll({
      attributes: ["id", "name", "description"],
      include,
      where,
    })

    if (grouped) {
      return getCatalogueItemsGroupedByCategories(items)
    }
    return items.map((item) => item.dataValues)
  } catch (err) {
    console.error(err)
    throw err
  }
}

const createItem = async (event, { name, description, categoryIds }) => {
  try {
    const createdItem = await CatalogueItem.create({
      name,
      description,
    })
    if (categoryIds) {
      await handleCategoriesAddRemove(categoryIds, createdItem)
    }
    return JSON.stringify(createdItem.dataValues)
  } catch (error) {
    console.error(error)
    return JSON.stringify(error)
  }
}

// TODO after ts is added
class BulkCreateItemsHandler {
  items

  constructor(items) {
    this.items = items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
    }))
  }
}
/**
 * Returns CSV string splitted into rows and columns, remove doublequotes
 * https://github.com/peterthoeny/parse-csv-js, MIT License
 * @param {items} array example {
          description: '[{"type":"paragraph","children":[{"text":""}]}]',
          groupName: "dog,cat",
          id: "bcee9bab-57c5-48d8-a2ab-8e10bceb3d6f",
          name: "test item ABCD",
        },
 */
const bulkCreateItems = async (event, items) => {
  console.log("bulkCreateItems", items)
  const itemsDetails = items.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
  }))
  const categoriesPerItem = items
    .map((item) => {
      const groupNames = item.groupName
        .split(",")
        .map((group) => group)
        .filter((name) => !!name)
      if (!!groupNames.length) {
        return [item.id, groupNames]
      }
      return null
    })
    .filter((item) => !!item)

  try {
    const itemNames = await CatalogueItem.findAll({
      attributes: ["name"],
    })
    const itemNamesArr = itemNames.map((el) => el.name)
    const filteredItemsDetails = itemsDetails.filter(
      (el) => !itemNamesArr.includes(el.name),
    )
    const createdItems = await CatalogueItem.bulkCreate(filteredItemsDetails)

    const hasCategoriesToAdd = categoriesPerItem.length > 0
    if (hasCategoriesToAdd) {
      const allCategoryNames = categoriesPerItem
        .map(([itemId, categoryNames]) => {
          return categoryNames
        })
        .flat()
      const categories = await getOrCreateCategoryByNames(allCategoryNames)

      await Promise.all(
        categoriesPerItem.map(async ([itemId, categoryNames]) => {
          const categoriesOfItem = categories.filter((category) =>
            categoryNames.includes(category.dataValues.name),
          )
          if (!!categoriesOfItem.length) {
            let item = createdItems.find((el) => el.dataValues.id === itemId)
            if (!item) {
              item = await CatalogueItem.findByPk(itemId)
            }
            await item.addCategory(categoriesOfItem)
          }
        }),
      )
    }
    const allItemsIds = itemsDetails.map((item) => item.id)
    const itemsWithCategories = await CatalogueItem.findAll({
      include: { model: Category },
      where: {
        id: {
          [Sequelize.Op.in]: allItemsIds,
        },
      },
    })
    return JSON.stringify(itemsWithCategories)
  } catch (error) {
    console.error(error)
    return JSON.stringify(error)
  }
}

const getDetailedItem = async (event, id) => {
  const detailedItem = await CatalogueItem.findByPk(id, {
    include: { model: Category },
  })

  const requiredData = {
    ...pick(detailedItem.dataValues, [
      "id",
      "name",
      "description",
      "createdAt",
      "updatedAt",
    ]),
    Categories: detailedItem.dataValues.Categories.map((cat) =>
      pick(cat, CATEGORY_KEYS),
    ),
  }

  return JSON.stringify(requiredData)
}

const destroyItemById = async (event, id) => {
  await CatalogueItem.destroy({
    where: {
      id: id,
    },
  })
}

const updateItem = async (event, id, content) => {
  const categoryIds = content.categories

  try {
    await CatalogueItem.update(content, {
      where: {
        id: id,
      },
    })

    const catalogueItem = await CatalogueItem.findByPk(id, {
      include: Category,
    })
    const prevCategoriesIds = catalogueItem.dataValues.Categories.map(
      (cat) => cat.dataValues.id,
    )
    const categoryIdsToRemove = difference(prevCategoriesIds, categoryIds)
    const categoryIdsToAdd = difference(categoryIds, prevCategoriesIds)

    await handleCategoriesAddRemove(categoryIdsToAdd, catalogueItem)
    await handleCategoriesAddRemove(categoryIdsToRemove, catalogueItem, true)
  } catch (error) {
    console.error(error)
    return error
  }
}

exports.getDetailedItem = getDetailedItem
exports.getListCatalogue = getListCatalogue
exports.createItem = createItem
exports.destroyItemById = destroyItemById
exports.updateItem = updateItem
exports.bulkCreateItems = bulkCreateItems
