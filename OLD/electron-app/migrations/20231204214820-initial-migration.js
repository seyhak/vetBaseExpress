module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("CatalogueItems", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      description: {
        type: Sequelize.JSON,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })
    // Create Category table
    await queryInterface.createTable("Categories", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })

    // Create CategoryCatalogueItemThroughTable table
    await queryInterface.createTable("CategoryCatalogueItemThroughTable", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      CategoryId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      CatalogueItemId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // Assuming 'CatalogueItems' is the name of your CatalogueItem table
        references: {
          model: "CatalogueItems",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })

    // Add foreign keys for the Many-to-Many relationship
    await queryInterface.addConstraint("CategoryCatalogueItemThroughTable", {
      fields: ["CategoryId"],
      type: "foreign key",
      name: "fk_CategoryCatalogueItemThroughTable_CategoryId",
      references: {
        table: "Categories",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    })

    await queryInterface.addConstraint("CategoryCatalogueItemThroughTable", {
      fields: ["CatalogueItemId"],
      type: "foreign key",
      name: "fk_CategoryCatalogueItemThroughTable_CatalogueItemId",
      references: {
        table: "CatalogueItems",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    })
  },

  down: async (queryInterface, Sequelize) => {
    // Drop tables in reverse order to avoid foreign key constraints
    await queryInterface.dropTable("CategoryCatalogueItemThroughTable")
    await queryInterface.dropTable("Categories")
    await queryInterface.dropTable("CatalogueItems")
  },
}
