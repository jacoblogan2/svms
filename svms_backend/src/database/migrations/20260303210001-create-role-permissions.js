'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RolePermissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      role: {
        type: Sequelize.ENUM(
          'admin',
          'county_leader',
          'district_leader',
          'clan_leader',
          'town_leader',
          'village_leader',
          'citizen'
        ),
        allowNull: false
      },
      permissionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Permissions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

    // Composite unique constraint so no duplicate role+permission combos
    await queryInterface.addConstraint('RolePermissions', {
      fields: ['role', 'permissionId'],
      type: 'unique',
      name: 'unique_role_permission'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('RolePermissions');
  }
};
