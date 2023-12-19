const { DataTypes, Model } = require("sequelize")
const db = require("./index")

class CatalogueItem extends Model {}

CatalogueItem.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // Or DataTypes.UUIDV1
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.JSON,
    },
  },
  {
    sequelize: db.sequelize,
    modelName: "CatalogueItem",
    timestamps: true,
  },
)

exports.CatalogueItem = CatalogueItem
