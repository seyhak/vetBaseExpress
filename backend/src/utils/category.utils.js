const { Category } = require("#root/models/category.js")
const { Sequelize } = require("sequelize")

const getOrCreateCategoryByNames = async (allCategoryNames) => {
  const existingCategories = await Category.findAll({
    where: {
      name: {
        [Sequelize.Op.in]: allCategoryNames,
      },
    },
  })
  const foundCategoryNames = existingCategories.map(
    (cat) => cat.dataValues.name,
  )
  const notFoundCategoryNames = allCategoryNames
    .filter((catName) => !foundCategoryNames.includes(catName))
    .map((catName) => ({ name: catName }))

  const createdCategories = await Category.bulkCreate(notFoundCategoryNames)
  return [...existingCategories, ...createdCategories]
}

exports.getOrCreateCategoryByNames = getOrCreateCategoryByNames
