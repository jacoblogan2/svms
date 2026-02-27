"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // ============================================================
    // STEP 1: Rename Tables
    // ============================================================
    await queryInterface.renameTable("Provinces", "Counties");
    await queryInterface.renameTable("Sectors", "Clans");
    await queryInterface.renameTable("Cells", "Towns");

    // ============================================================
    // STEP 2: Rename Foreign Key Columns in Address Tables
    // ============================================================
    // Districts: provinceId → countyId
    await queryInterface.renameColumn("Districts", "provinceId", "countyId");
    // Towns (was Cells): sectorId → clanId
    await queryInterface.renameColumn("Towns", "sectorId", "clanId");
    // Villages: cellId → townId
    await queryInterface.renameColumn("Villages", "cellId", "townId");

    // ============================================================
    // STEP 3: Rename Foreign Key Columns in Users Table
    // ============================================================
    await queryInterface.renameColumn("Users", "province_id", "county_id");
    await queryInterface.renameColumn("Users", "sector_id", "clan_id");
    await queryInterface.renameColumn("Users", "cell_id", "town_id");

    // ============================================================
    // STEP 4: Rename Foreign Key Columns in Posts Table
    // ============================================================
    await queryInterface.renameColumn("Posts", "province_id", "county_id");
    await queryInterface.renameColumn("Posts", "sector_id", "clan_id");
    await queryInterface.renameColumn("Posts", "cell_id", "town_id");

    // ============================================================
    // STEP 5: Rename Foreign Key Columns in Requests Table
    // ============================================================
    await queryInterface.renameColumn("Requests", "province_id", "county_id");
    await queryInterface.renameColumn("Requests", "sector_id", "clan_id");
    await queryInterface.renameColumn("Requests", "cell_id", "town_id");

    // ============================================================
    // STEP 6: Update User Roles ENUM (PostgreSQL only)
    // ============================================================
    try {
      await queryInterface.sequelize.query(
        `ALTER TYPE "enum_Users_role" RENAME VALUE 'province_leader' TO 'county_leader';`
      );
      await queryInterface.sequelize.query(
        `ALTER TYPE "enum_Users_role" RENAME VALUE 'sector_leader' TO 'clan_leader';`
      );
      await queryInterface.sequelize.query(
        `ALTER TYPE "enum_Users_role" RENAME VALUE 'cell_leader' TO 'town_leader';`
      );
    } catch (error) {
      console.log("ENUM rename skipped (values may already exist or not PostgreSQL):", error.message);
    }
  },

  async down(queryInterface, Sequelize) {
    // Reverse column renames first
    await queryInterface.renameColumn("Requests", "town_id", "cell_id");
    await queryInterface.renameColumn("Requests", "clan_id", "sector_id");
    await queryInterface.renameColumn("Requests", "county_id", "province_id");

    await queryInterface.renameColumn("Posts", "town_id", "cell_id");
    await queryInterface.renameColumn("Posts", "clan_id", "sector_id");
    await queryInterface.renameColumn("Posts", "county_id", "province_id");

    await queryInterface.renameColumn("Users", "town_id", "cell_id");
    await queryInterface.renameColumn("Users", "clan_id", "sector_id");
    await queryInterface.renameColumn("Users", "county_id", "province_id");

    await queryInterface.renameColumn("Villages", "townId", "cellId");
    await queryInterface.renameColumn("Towns", "clanId", "sectorId");
    await queryInterface.renameColumn("Districts", "countyId", "provinceId");

    // Reverse table renames
    await queryInterface.renameTable("Towns", "Cells");
    await queryInterface.renameTable("Clans", "Sectors");
    await queryInterface.renameTable("Counties", "Provinces");

    try {
      await queryInterface.sequelize.query(
        `ALTER TYPE "enum_Users_role" RENAME VALUE 'town_leader' TO 'cell_leader';`
      );
      await queryInterface.sequelize.query(
        `ALTER TYPE "enum_Users_role" RENAME VALUE 'clan_leader' TO 'sector_leader';`
      );
      await queryInterface.sequelize.query(
        `ALTER TYPE "enum_Users_role" RENAME VALUE 'county_leader' TO 'province_leader';`
      );
    } catch (error) {
      console.log("ENUM reverse skipped:", error.message);
    }
  },
};
