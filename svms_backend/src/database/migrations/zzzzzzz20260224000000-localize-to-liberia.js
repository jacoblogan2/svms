"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Helper: check if a table exists
    const tableExists = async (name) => {
      try {
        const [results] = await queryInterface.sequelize.query(
          `SELECT to_regclass('"${name}"') AS tbl;`
        );
        return results[0] && results[0].tbl !== null;
      } catch {
        return false;
      }
    };

    // Helper: check if a column exists on a table
    const columnExists = async (table, column) => {
      try {
        const desc = await queryInterface.describeTable(table);
        return !!desc[column];
      } catch {
        return false;
      }
    };

    // ============================================================
    // STEP 1: Rename Tables (only if old names still exist)
    // ============================================================
    if (await tableExists("Provinces")) {
      await queryInterface.renameTable("Provinces", "Counties");
    }
    if (await tableExists("Sectors")) {
      await queryInterface.renameTable("Sectors", "Clans");
    }
    if (await tableExists("Cells")) {
      await queryInterface.renameTable("Cells", "Towns");
    }

    // ============================================================
    // STEP 2: Rename Foreign Key Columns in Address Tables
    // ============================================================
    if (await columnExists("Districts", "provinceId")) {
      await queryInterface.renameColumn("Districts", "provinceId", "countyId");
    }
    if (await columnExists("Towns", "sectorId")) {
      await queryInterface.renameColumn("Towns", "sectorId", "clanId");
    }
    if (await columnExists("Villages", "cellId")) {
      await queryInterface.renameColumn("Villages", "cellId", "townId");
    }

    // ============================================================
    // STEP 3: Rename Foreign Key Columns in Users Table
    // ============================================================
    if (await columnExists("Users", "province_id")) {
      await queryInterface.renameColumn("Users", "province_id", "county_id");
    }
    if (await columnExists("Users", "sector_id")) {
      await queryInterface.renameColumn("Users", "sector_id", "clan_id");
    }
    if (await columnExists("Users", "cell_id")) {
      await queryInterface.renameColumn("Users", "cell_id", "town_id");
    }

    // ============================================================
    // STEP 4: Rename Foreign Key Columns in Posts Table
    // ============================================================
    if (await columnExists("Posts", "province_id")) {
      await queryInterface.renameColumn("Posts", "province_id", "county_id");
    }
    if (await columnExists("Posts", "sector_id")) {
      await queryInterface.renameColumn("Posts", "sector_id", "clan_id");
    }
    if (await columnExists("Posts", "cell_id")) {
      await queryInterface.renameColumn("Posts", "cell_id", "town_id");
    }

    // ============================================================
    // STEP 5: Rename Foreign Key Columns in Requests Table
    // ============================================================
    if (await columnExists("Requests", "province_id")) {
      await queryInterface.renameColumn("Requests", "province_id", "county_id");
    }
    if (await columnExists("Requests", "sector_id")) {
      await queryInterface.renameColumn("Requests", "sector_id", "clan_id");
    }
    if (await columnExists("Requests", "cell_id")) {
      await queryInterface.renameColumn("Requests", "cell_id", "town_id");
    }

    // ============================================================
    // STEP 6: Update User Roles ENUM (PostgreSQL only)
    // ============================================================
    try {
      await queryInterface.sequelize.query(
        `ALTER TYPE "enum_Users_role" RENAME VALUE 'province_leader' TO 'county_leader';`
      );
    } catch (error) {
      console.log("ENUM rename province_leader skipped:", error.message);
    }
    try {
      await queryInterface.sequelize.query(
        `ALTER TYPE "enum_Users_role" RENAME VALUE 'sector_leader' TO 'clan_leader';`
      );
    } catch (error) {
      console.log("ENUM rename sector_leader skipped:", error.message);
    }
    try {
      await queryInterface.sequelize.query(
        `ALTER TYPE "enum_Users_role" RENAME VALUE 'cell_leader' TO 'town_leader';`
      );
    } catch (error) {
      console.log("ENUM rename cell_leader skipped:", error.message);
    }
  },

  async down(queryInterface, Sequelize) {
    // Reverse column renames
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
