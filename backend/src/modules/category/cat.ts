const { pick } = require("lodash")
const { Category } = require("#root/models/category.js")
const { Sequelize, Op } = require("sequelize")
const { CATEGORY_KEYS } = require("#root/constants.ts")

// const getListCategories = async (event, searchPhase) => {
//   const where = searchPhase
//     ? {
//         [Op.or]: [
//           Sequelize.where(Sequelize.fn("UPPER", Sequelize.col("name")), {
//             [Op.substring]: searchPhase,
//           }),
//           Sequelize.where(Sequelize.fn("UPPER", Sequelize.col("description")), {
//             [Op.substring]: searchPhase,
//           }),
//         ],
//       }
//     : {}

//   const items = await Category.findAll({
//     attributes: ["id", "name", "description", "createdAt", "updatedAt"],
//     where,
//   })

//   await new Promise((resolve) => {
//     setTimeout(resolve, 500)
//   })
//   return items.map((item) => ({
//     ...item.dataValues,
//     createdAt: item.createdAt.toString(),
//     updatedAt: item.updatedAt.toString(),
//   }))
// }

const createCategory = async (event, name, description = "") => {
  try {
    const created = await Category.create({
      name,
      description,
    })
    return JSON.stringify(created.dataValues)
  } catch (err) {
    return err
  }
}

const getDetailedCategory = async (event, id) => {
  const detailedItem = await Category.findByPk(id)
  return detailedItem.dataValues.map((cat) => pick(cat, CATEGORY_KEYS))
}

const destroyCategoryById = async (event, id) => {
  await Category.destroy({
    where: {
      id: id,
    },
  })
}

const updateCategory = async (event, id, content) => {
  await Category.update(content, {
    where: {
      id: id,
    },
  })
}

exports.getDetailedCategory = getDetailedCategory
exports.getListCategories = getListCategories
exports.createCategory = createCategory
exports.destroyCategoryById = destroyCategoryById
exports.updateCategory = updateCategory
