/**
 * Role hierarchy configuration and location scoping helpers.
 *
 * Simplified hierarchy (3 roles only):
 *   admin(0) > village_leader(1) > citizen(2)
 */

// Numeric level per role — lower number = higher authority
export const ROLE_LEVELS = {
  admin: 0,
  // county_leader: 1,    // REMOVED
  // district_leader: 2,  // REMOVED
  // clan_leader: 3,      // REMOVED
  // town_leader: 4,      // REMOVED
  village_leader: 1,
  citizen: 2,
};

// Human-readable labels for each role
export const ROLE_LABELS = {
  admin: "Admin",
  // county_leader: "County Leader",      // REMOVED
  // district_leader: "District Leader",  // REMOVED
  // clan_leader: "Clan Leader",          // REMOVED
  // town_leader: "Town Leader",          // REMOVED
  village_leader: "Village Leader",
  citizen: "Citizen",
};

// All roles in hierarchy order
export const ALL_ROLES = [
  "admin",
  // "county_leader",    // REMOVED
  // "district_leader",  // REMOVED
  // "clan_leader",      // REMOVED
  // "town_leader",      // REMOVED
  "village_leader",
  "citizen",
];

// All leader roles (non-admin and non-citizen)
export const LEADER_ROLES = [
  // "county_leader",    // REMOVED
  // "district_leader",  // REMOVED
  // "clan_leader",      // REMOVED
  // "town_leader",      // REMOVED
  "village_leader",
];

/**
 * Build a Sequelize WHERE clause that scopes data to the user's location.
 *
 * - admin → no filter (sees everything)
 * - village_leader → filter by village_id (and parent location chain)
 * - citizen → filter by village_id
 *
 * @param {object} user — the logged-in user record (must have role and location IDs)
 * @returns {object} Sequelize WHERE clause
 */
export const getLocationScope = (user) => {
  if (!user) return {};

  switch (user.role) {
    case "admin":
      return {}; // no restriction

    /* REMOVED — intermediate leader roles no longer exist
    case "county_leader":
      return { county_id: user.county_id };

    case "district_leader":
      return {
        county_id: user.county_id,
        district_id: user.district_id,
      };

    case "clan_leader":
      return {
        county_id: user.county_id,
        district_id: user.district_id,
        clan_id: user.clan_id,
      };

    case "town_leader":
      return {
        county_id: user.county_id,
        district_id: user.district_id,
        clan_id: user.clan_id,
        town_id: user.town_id,
      };
    */

    case "village_leader":
      return {
        county_id: user.county_id,
        district_id: user.district_id,
        clan_id: user.clan_id,
        town_id: user.town_id,
        village_id: user.village_id,
      };

    case "citizen": {
      const scope = {};
      if (user.village_id) scope.village_id = user.village_id;
      else if (user.town_id) scope.town_id = user.town_id;
      else if (user.county_id) scope.county_id = user.county_id;
      return scope;
    }

    default:
      return {};
  }
};

/**
 * Check if roleA outranks roleB (i.e. has a lower level number).
 */
export const outranks = (roleA, roleB) => {
  return (ROLE_LEVELS[roleA] ?? 99) < (ROLE_LEVELS[roleB] ?? 99);
};
