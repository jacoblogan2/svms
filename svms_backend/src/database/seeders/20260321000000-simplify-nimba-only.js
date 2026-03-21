'use strict';

/**
 * Seeder: Simplify SVMS to Nimba-only with 3 roles (admin, village_leader, citizen).
 *
 * This seeder:
 * 1. Removes all Bong county address data (Villages → Towns → Clans → Districts → County)
 * 2. Adds "Sophea" village under "Sanniquellie City" town
 * 3. Downgrades users with removed roles to "citizen"
 * 4. Cleans up RolePermissions for removed roles
 * 5. Re-seeds RolePermissions for the 3 remaining roles
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // ──────────────────────────────────────────────
    // 1. Remove Bong county and all its child data
    // ──────────────────────────────────────────────
    console.log('🔄 Step 1: Removing Bong county data...');
    
    // Find the Bong county ID
    const [bongRows] = await queryInterface.sequelize.query(
      `SELECT id FROM "Counties" WHERE name = 'Bong'`
    );

    if (bongRows.length > 0) {
      const bongId = bongRows[0].id;

      // Get all Bong district IDs
      const [bongDistricts] = await queryInterface.sequelize.query(
        `SELECT id FROM "Districts" WHERE "countyId" = ${bongId}`
      );
      const districtIds = bongDistricts.map(d => d.id);

      if (districtIds.length > 0) {
        // Get all Bong clan IDs
        const [bongClans] = await queryInterface.sequelize.query(
          `SELECT id FROM "Clans" WHERE "districtId" IN (${districtIds.join(',')})`
        );
        const clanIds = bongClans.map(c => c.id);

        if (clanIds.length > 0) {
          // Get all Bong town IDs
          const [bongTowns] = await queryInterface.sequelize.query(
            `SELECT id FROM "Towns" WHERE "clanId" IN (${clanIds.join(',')})`
          );
          const townIds = bongTowns.map(t => t.id);

          if (townIds.length > 0) {
            // Delete villages belonging to Bong towns
            await queryInterface.sequelize.query(
              `DELETE FROM "Villages" WHERE "townId" IN (${townIds.join(',')})`
            );
            console.log(`  ✅ Deleted villages for ${townIds.length} Bong towns`);

            // Delete Bong towns
            await queryInterface.sequelize.query(
              `DELETE FROM "Towns" WHERE "clanId" IN (${clanIds.join(',')})`
            );
            console.log(`  ✅ Deleted ${townIds.length} Bong towns`);
          }

          // Delete Bong clans
          await queryInterface.sequelize.query(
            `DELETE FROM "Clans" WHERE "districtId" IN (${districtIds.join(',')})`
          );
          console.log(`  ✅ Deleted ${clanIds.length} Bong clans`);
        }

        // Delete Bong districts
        await queryInterface.sequelize.query(
          `DELETE FROM "Districts" WHERE "countyId" = ${bongId}`
        );
        console.log(`  ✅ Deleted ${districtIds.length} Bong districts`);
      }

      // Nullify any user references to Bong county before deleting it
      await queryInterface.sequelize.query(
        `UPDATE "Users" SET county_id = NULL, district_id = NULL, clan_id = NULL, town_id = NULL, village_id = NULL WHERE county_id = ${bongId}`
      );

      // Delete the Bong county itself
      await queryInterface.sequelize.query(
        `DELETE FROM "Counties" WHERE id = ${bongId}`
      );
      console.log('  ✅ Deleted Bong county');
    } else {
      console.log('  ℹ️  Bong county not found, skipping');
    }

    // ──────────────────────────────────────────────
    // 2. Add "Sophea" village to Sanniquellie City
    // ──────────────────────────────────────────────
    console.log('🔄 Step 2: Adding Sophea village...');

    const [sanniquellieRows] = await queryInterface.sequelize.query(
      `SELECT id FROM "Towns" WHERE name = 'Sanniquellie City'`
    );

    if (sanniquellieRows.length > 0) {
      const townId = sanniquellieRows[0].id;

      // Check if Sophea already exists
      const [existingSophea] = await queryInterface.sequelize.query(
        `SELECT id FROM "Villages" WHERE name = 'Sophea' AND "townId" = ${townId}`
      );

      if (existingSophea.length === 0) {
        await queryInterface.bulkInsert('Villages', [{
          name: 'Sophea',
          townId: townId,
          createdAt: now,
          updatedAt: now,
        }]);
        console.log('  ✅ Added Sophea village to Sanniquellie City');
      } else {
        console.log('  ℹ️  Sophea already exists, skipping');
      }
    } else {
      console.log('  ⚠️  Sanniquellie City town not found — run the address seeder first');
    }

    // ──────────────────────────────────────────────
    // 3. Downgrade removed roles to "citizen"
    // ──────────────────────────────────────────────
    console.log('🔄 Step 3: Downgrading removed leader roles to citizen...');

    const removedRoles = ['county_leader', 'district_leader', 'clan_leader', 'town_leader'];

    for (const oldRole of removedRoles) {
      const [result] = await queryInterface.sequelize.query(
        `UPDATE "Users" SET role = 'citizen' WHERE role = '${oldRole}' RETURNING id`
      );
      if (result.length > 0) {
        console.log(`  ✅ Downgraded ${result.length} ${oldRole}(s) to citizen`);
      }
    }

    // ──────────────────────────────────────────────
    // 4. Clean up RolePermissions for removed roles
    // ──────────────────────────────────────────────
    console.log('🔄 Step 4: Cleaning up RolePermissions...');

    try {
      await queryInterface.sequelize.query(
        `DELETE FROM "RolePermissions" WHERE role IN ('county_leader', 'district_leader', 'clan_leader', 'town_leader')`
      );
      console.log('  ✅ Removed RolePermissions for old leader roles');
    } catch (e) {
      console.log('  ℹ️  RolePermissions table may not exist yet, skipping:', e.message);
    }

    // ──────────────────────────────────────────────
    // 5. Re-seed RolePermissions for 3 remaining roles
    // ──────────────────────────────────────────────
    console.log('🔄 Step 5: Re-seeding RolePermissions for admin, village_leader, citizen...');

    try {
      // First, clear existing permissions for the 3 roles to avoid duplicates
      await queryInterface.sequelize.query(
        `DELETE FROM "RolePermissions" WHERE role IN ('admin', 'village_leader', 'citizen')`
      );

      // Fetch permission IDs
      const [permRows] = await queryInterface.sequelize.query(
        `SELECT id, name FROM "Permissions"`
      );
      const permMap = {};
      permRows.forEach(r => { permMap[r.name] = r.id; });

      const rolePermissions = {
        admin: [
          'view_dashboard', 'view_statistics', 'create_user', 'manage_users',
          'view_leaders', 'view_citizens', 'approve_request', 'reject_request',
          'send_broadcast', 'manage_post_type', 'view_broadcasts',
          'manage_documents', 'view_all_reports', 'manage_regions',
          'suspend_users', 'view_notifications',
          'view_households', 'create_report', 'view_reports', 'manage_family',
          'register_birth', 'mark_deceased',
        ],
        village_leader: [
          'view_dashboard', 'view_statistics', 'create_user', 'view_citizens',
          'approve_request', 'reject_request',
          'send_broadcast', 'view_broadcasts',
          'manage_documents', 'view_notifications',
          'view_households', 'create_report', 'view_reports',
          'register_birth', 'mark_deceased',
        ],
        citizen: [
          'view_dashboard', 'view_statistics', 'submit_request',
          'view_broadcasts', 'manage_documents', 'view_notifications',
          'manage_family', 'register_birth', 'mark_deceased',
        ],
      };

      const rpRows = [];
      for (const [role, perms] of Object.entries(rolePermissions)) {
        for (const permName of perms) {
          if (permMap[permName]) {
            rpRows.push({
              role,
              permissionId: permMap[permName],
              createdAt: now,
              updatedAt: now,
            });
          } else {
            console.log(`  ⚠️  Permission "${permName}" not found in DB, skipping`);
          }
        }
      }

      if (rpRows.length > 0) {
        await queryInterface.bulkInsert('RolePermissions', rpRows);
        console.log(`  ✅ Inserted ${rpRows.length} role-permission mappings`);
      }
    } catch (e) {
      console.log('  ℹ️  Could not re-seed RolePermissions:', e.message);
    }

    console.log('✅ Simplification seeder complete!');
  },

  async down(queryInterface, Sequelize) {
    // This seeder is not easily reversible.
    // To undo: restore from a database backup taken before running this seeder.
    console.log('⚠️  This seeder cannot be automatically reverted. Restore from backup if needed.');
  }
};
