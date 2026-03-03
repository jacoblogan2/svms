'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FamilyMembers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      household_head_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      fullname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dob: {
        type: Sequelize.DATE
      },
      gender: {
        type: Sequelize.STRING
      },
      relationship: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('Alive', 'Deceased'),
        defaultValue: 'Alive'
      },
      dod: {
        type: Sequelize.DATE,
        allowNull: true
      },
      marital_status: {
        type: Sequelize.STRING
      },
      occupation: {
        type: Sequelize.STRING
      },
      notes: {
        type: Sequelize.TEXT
      },
      county_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      district_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      clan_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      town_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      village_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FamilyMembers');
  }
};
