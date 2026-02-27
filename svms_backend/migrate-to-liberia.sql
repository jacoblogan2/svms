-- ============================================================
-- SVMS: Localize Database to Liberian Administrative Hierarchy
-- Run this SQL directly against your PostgreSQL database
-- ============================================================

-- ============================================================
-- STEP 1: Rename Tables
-- ============================================================

-- ============================================================
-- STEP 2: Rename FK Columns in Address Tables
-- ============================================================
-- Districts: provinceId → countyId
ALTER TABLE "Districts" RENAME COLUMN "provinceId" TO "countyId";

-- Towns (was Cells): sectorId → clanId
ALTER TABLE "Towns" RENAME COLUMN "sectorId" TO "clanId";

-- Villages: cellId → townId
ALTER TABLE "Villages" RENAME COLUMN "cellId" TO "townId";

-- ============================================================
-- STEP 3: Rename FK Columns in Users Table
-- ============================================================
ALTER TABLE "Users" RENAME COLUMN "province_id" TO "county_id";

ALTER TABLE "Users" RENAME COLUMN "sector_id" TO "clan_id";

ALTER TABLE "Users" RENAME COLUMN "cell_id" TO "town_id";

-- ============================================================
-- STEP 4: Rename FK Columns in Posts Table
-- ============================================================
ALTER TABLE "Posts" RENAME COLUMN "province_id" TO "county_id";

ALTER TABLE "Posts" RENAME COLUMN "sector_id" TO "clan_id";

ALTER TABLE "Posts" RENAME COLUMN "cell_id" TO "town_id";

-- ============================================================
-- STEP 5: Rename FK Columns in Requests Table
-- ============================================================
ALTER TABLE "Requests" RENAME COLUMN "province_id" TO "county_id";

ALTER TABLE "Requests" RENAME COLUMN "sector_id" TO "clan_id";

ALTER TABLE "Requests" RENAME COLUMN "cell_id" TO "town_id";

-- ============================================================
-- STEP 6: Update User Roles ENUM (PostgreSQL only)
-- ============================================================
ALTER TYPE "enum_Users_role" RENAME VALUE 'province_leader' TO 'county_leader';

ALTER TYPE "enum_Users_role" RENAME VALUE 'sector_leader'   TO 'clan_leader';

ALTER TYPE "enum_Users_role" RENAME VALUE 'cell_leader'     TO 'town_leader';

-- ============================================================
-- STEP 7: Mark migration as run in SequelizeMeta
-- (So Sequelize won't try to run it again)
-- ============================================================
INSERT INTO
    "SequelizeMeta" ("name")
VALUES (
        '20260224000000-localize-to-liberia.js'
    );

-- ============================================================
-- DONE! Your database now uses Liberian administrative names:
--   Counties (was Provinces)
--   Districts (unchanged)
--   Clans    (was Sectors)
--   Towns    (was Cells)
--   Villages (unchanged)
-- ============================================================