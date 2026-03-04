/**
 * Fix permissions script — checks and inserts missing role-permission mappings.
 * Run with: npx babel-node src/scripts/fix-permissions.js
 */
import dotenv from "dotenv";
dotenv.config();

import db from "../database/models/index.js";
const { Permissions, RolePermissions } = db;

const ROLE_PERMISSIONS = {
  admin: [
    'view_dashboard', 'view_statistics', 'create_user', 'manage_users',
    'view_leaders', 'view_citizens', 'approve_request', 'reject_request',
    'send_broadcast', 'manage_post_type', 'view_broadcasts',
    'manage_documents', 'view_all_reports', 'manage_regions',
    'suspend_users', 'view_notifications',
    'view_households', 'create_report', 'view_reports', 'manage_family', 'register_birth', 'mark_deceased',
  ],
  county_leader: [
    'view_dashboard', 'view_statistics', 'create_user', 'manage_users',
    'view_leaders', 'view_citizens', 'approve_request', 'reject_request',
    'send_broadcast', 'view_broadcasts', 'escalate_issue',
    'manage_documents', 'view_all_reports', 'view_notifications',
    'view_households', 'create_report', 'view_reports',
  ],
  district_leader: [
    'view_dashboard', 'view_statistics', 'create_user', 'manage_users',
    'view_leaders', 'view_citizens', 'approve_request', 'reject_request',
    'send_broadcast', 'view_broadcasts', 'escalate_issue',
    'manage_documents', 'view_all_reports', 'view_notifications',
    'view_households', 'create_report', 'view_reports',
  ],
  clan_leader: [
    'view_dashboard', 'view_statistics', 'view_citizens',
    'send_broadcast', 'view_broadcasts', 'escalate_issue',
    'view_notifications',
    'view_households', 'create_report', 'view_reports',
  ],
  town_leader: [
    'view_dashboard', 'view_statistics', 'create_user', 'manage_users',
    'view_leaders', 'view_citizens', 'approve_request', 'reject_request',
    'send_broadcast', 'view_broadcasts', 'escalate_issue',
    'view_notifications',
    'view_households', 'create_report', 'view_reports',
  ],
  village_leader: [
    'view_dashboard', 'view_statistics', 'create_user', 'manage_users',
    'view_citizens', 'approve_request', 'reject_request',
    'send_broadcast', 'view_broadcasts', 'escalate_issue',
    'manage_documents', 'view_notifications',
    'view_households', 'create_report', 'view_reports', 'register_birth', 'mark_deceased',
  ],
  citizen: [
    'view_dashboard', 'view_statistics', 'submit_request',
    'view_broadcasts', 'manage_documents', 'view_notifications',
    'manage_family', 'register_birth', 'mark_deceased',
  ],
};

async function fixPermissions() {
  try {
    console.log("=== Permission Fix Script ===\n");

    // 1) Ensure all permission rows exist
    const allPermNames = [...new Set(Object.values(ROLE_PERMISSIONS).flat())];
    for (const name of allPermNames) {
      const [perm, created] = await Permissions.findOrCreate({
        where: { name },
        defaults: { name, description: name.replace(/_/g, ' ') }
      });
      if (created) console.log(`  Created permission: ${name}`);
    }

    // 2) Build a lookup
    const allPerms = await Permissions.findAll();
    const permMap = {};
    allPerms.forEach(p => { permMap[p.name] = p.id; });

    // 3) For each role, ensure all mappings exist
    let added = 0;
    for (const [role, perms] of Object.entries(ROLE_PERMISSIONS)) {
      for (const permName of perms) {
        const permId = permMap[permName];
        if (!permId) {
          console.warn(`  ⚠ Permission "${permName}" not found in DB`);
          continue;
        }
        const [rp, created] = await RolePermissions.findOrCreate({
          where: { role, permissionId: permId },
          defaults: { role, permissionId: permId }
        });
        if (created) {
          console.log(`  ✅ Added ${role} → ${permName}`);
          added++;
        }
      }
    }

    console.log(`\n=== Done! Added ${added} missing role-permission mappings ===`);
    process.exit(0);
  } catch (err) {
    console.error("Script error:", err);
    process.exit(1);
  }
}

fixPermissions();
