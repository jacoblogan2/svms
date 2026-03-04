'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Reports', 'status', {
      type: Sequelize.ENUM('draft', 'submitted'),
      defaultValue: 'draft',
      allowNull: false
    });
    await queryInterface.addColumn('Reports', 'sentTo', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Reports', 'sentTo');
    await queryInterface.removeColumn('Reports', 'status');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Reports_status" CASCADE;');
  }
};
