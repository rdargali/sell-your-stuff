"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addConstraint("Comments", {
      fields: ["productId"], //different from azam
      type: "FOREIGN KEY",
      name: "postid-fk-in-comments",
      references: {
        table: "Products",
        field: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint("Comments", "postid-fk-in-comments");
  },
};
