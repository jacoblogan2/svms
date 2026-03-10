'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Requests', 'full_name', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('Requests', 'national_id', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('Requests', 'phone_number', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('Requests', 'household_size', { type: Sequelize.INTEGER, allowNull: true });

    // Current Location
    await queryInterface.addColumn('Requests', 'current_county_id', { type: Sequelize.INTEGER, allowNull: true });
    await queryInterface.addColumn('Requests', 'current_district_id', { type: Sequelize.INTEGER, allowNull: true });
    await queryInterface.addColumn('Requests', 'current_clan_id', { type: Sequelize.INTEGER, allowNull: true });
    await queryInterface.addColumn('Requests', 'current_town_id', { type: Sequelize.INTEGER, allowNull: true });
    await queryInterface.addColumn('Requests', 'current_village_id', { type: Sequelize.INTEGER, allowNull: true });

    // Transfer Details
    await queryInterface.addColumn('Requests', 'transfer_type', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('Requests', 'move_date', { type: Sequelize.DATE, allowNull: true });
    await queryInterface.addColumn('Requests', 'transfer_duration', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('Requests', 'supporting_document', { type: Sequelize.STRING, allowNull: true });

    // Destination Contact (Host)
    await queryInterface.addColumn('Requests', 'host_name', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('Requests', 'host_phone', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('Requests', 'host_relationship', { type: Sequelize.STRING, allowNull: true });
    
    // Add missing Liberian terminology columns if they don't exist
    // Based on previous findings, the table might have province_id, sector_id, cell_id
    // We'll add the new ones and keep the old ones for compatibility if needed, or just focus on the new ones.
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Requests', 'full_name');
    await queryInterface.removeColumn('Requests', 'national_id');
    await queryInterface.removeColumn('Requests', 'phone_number');
    await queryInterface.removeColumn('Requests', 'household_size');
    await queryInterface.removeColumn('Requests', 'current_county_id');
    await queryInterface.removeColumn('Requests', 'current_district_id');
    await queryInterface.removeColumn('Requests', 'current_clan_id');
    await queryInterface.removeColumn('Requests', 'current_town_id');
    await queryInterface.removeColumn('Requests', 'current_village_id');
    await queryInterface.removeColumn('Requests', 'transfer_type');
    await queryInterface.removeColumn('Requests', 'move_date');
    await queryInterface.removeColumn('Requests', 'transfer_duration');
    await queryInterface.removeColumn('Requests', 'supporting_document');
    await queryInterface.removeColumn('Requests', 'host_name');
    await queryInterface.removeColumn('Requests', 'host_phone');
    await queryInterface.removeColumn('Requests', 'host_relationship');
  }
};
