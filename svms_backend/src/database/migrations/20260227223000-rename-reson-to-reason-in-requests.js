"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn("Requests", "reson", "reason");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn("Requests", "reason", "reson");
  },
};
