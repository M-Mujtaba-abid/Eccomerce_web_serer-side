"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Products", "category", {
      type: Sequelize.ENUM("perfume", "accesories"),
      allowNull: false,
      defaultValue: "perfume", // ✅ ek default rakhna zaroori hai ENUM me
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Products", "category");
  },
};
