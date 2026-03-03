'use strict';

/**
 * Seed all permissions and map them to roles.
 *
 * Permission matrix matches implementation_plan.md exactly.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // 1) Insert permissions
    const permissions = [
      { name: 'view_dashboard',    description: 'View the dashboard page' },
      { name: 'view_statistics',   description: 'View statistics and analytics' },
      { name: 'create_user',       description: 'Create new users/leaders' },
      { name: 'manage_users',      description: 'Edit or delete users' },
      { name: 'view_leaders',      description: 'View list of leaders' },
      { name: 'view_citizens',     description: 'View list of citizens' },
      { name: 'approve_request',   description: 'Approve transfer/relocation requests' },
      { name: 'reject_request',    description: 'Reject transfer/relocation requests' },
      { name: 'send_broadcast',    description: 'Create and send broadcast posts' },
      { name: 'manage_post_type',  description: 'Manage post categories/types' },
      { name: 'submit_request',    description: 'Submit transfer/relocation requests' },
      { name: 'view_broadcasts',   description: 'View broadcast posts' },
      { name: 'escalate_issue',    description: 'Escalate issues to higher authority' },
      { name: 'manage_documents',  description: 'Add, view, or delete documents' },
      { name: 'view_all_reports',  description: 'View reports across the system' },
      { name: 'manage_regions',    description: 'Manage counties, districts, towns, villages' },
      { name: 'suspend_users',     description: 'Activate or deactivate user accounts' },
      { name: 'view_notifications', description: 'View notifications' },
    ];

    await queryInterface.bulkInsert(
      'Permissions',
      permissions.map(p => ({ ...p, createdAt: now, updatedAt: now }))
    );

    // 2) Fetch inserted permission IDs by name
    const [rows] = await queryInterface.sequelize.query(
      `SELECT id, name FROM "Permissions"`
    );
    const permMap = {};
    rows.forEach(r => { permMap[r.name] = r.id; });

    // 3) Define role → permissions mapping
    const rolePermissions = {
      admin: [
        'view_dashboard', 'view_statistics', 'create_user', 'manage_users',
        'view_leaders', 'view_citizens', 'approve_request', 'reject_request',
        'send_broadcast', 'manage_post_type', 'view_broadcasts',
        'manage_documents', 'view_all_reports', 'manage_regions',
        'suspend_users', 'view_notifications',
      ],
      county_leader: [
        'view_dashboard', 'view_statistics', 'create_user', 'manage_users',
        'view_leaders', 'view_citizens', 'approve_request', 'reject_request',
        'send_broadcast', 'view_broadcasts', 'escalate_issue',
        'manage_documents', 'view_all_reports', 'view_notifications',
      ],
      district_leader: [
        'view_dashboard', 'view_statistics', 'create_user', 'manage_users',
        'view_leaders', 'view_citizens', 'approve_request', 'reject_request',
        'send_broadcast', 'view_broadcasts', 'escalate_issue',
        'manage_documents', 'view_all_reports', 'view_notifications',
      ],
      clan_leader: [
        'view_dashboard', 'view_statistics', 'view_citizens',
        'send_broadcast', 'view_broadcasts', 'escalate_issue',
        'view_notifications',
      ],
      town_leader: [
        'view_dashboard', 'view_statistics', 'create_user', 'manage_users',
        'view_leaders', 'view_citizens', 'approve_request', 'reject_request',
        'send_broadcast', 'view_broadcasts', 'escalate_issue',
        'view_notifications',
      ],
      village_leader: [
        'view_dashboard', 'view_statistics', 'create_user', 'manage_users',
        'view_citizens', 'approve_request', 'reject_request',
        'send_broadcast', 'view_broadcasts', 'escalate_issue',
        'manage_documents', 'view_notifications',
      ],
      citizen: [
        'view_dashboard', 'view_statistics', 'submit_request',
        'view_broadcasts', 'manage_documents', 'view_notifications',
      ],
    };

    // 4) Build and insert role-permission rows
    const rpRows = [];
    for (const [role, perms] of Object.entries(rolePermissions)) {
      for (const permName of perms) {
        rpRows.push({
          role,
          permissionId: permMap[permName],
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    await queryInterface.bulkInsert('RolePermissions', rpRows);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('RolePermissions', null, {});
    await queryInterface.bulkDelete('Permissions', null, {});
  }
};
