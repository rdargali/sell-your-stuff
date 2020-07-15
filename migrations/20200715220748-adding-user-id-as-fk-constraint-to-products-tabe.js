"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addConstraint("Products", {
      fields: ["userId"],
      type: "FOREIGN KEY",
      name: "userid-fk-in-products",
      references: {
        table: "Users",
        field: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint("Products", "userid-fk-in-products");
  },
};
