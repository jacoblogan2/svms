/**
 * Role hierarchy configuration and location scoping helpers.
 *
 * Hierarchy levels (lower = higher authority):
 *   admin(0) > county_leader(1) > district_leader(2) > clan_leader(3) > town_leader(4) > village_leader(5) > citizen(6)
 */

// Numeric level per role — lower number = higher authority
export const ROLE_LEVELS = {
  admin: 0,
  county_leader: 1,
  district_leader: 2,
  clan_leader: 3,
  town_leader: 4,
  village_leader: 5,
  citizen: 6,
};

// Human-readable labels for each role
export const ROLE_LABELS = {
  admin: "Admin",
  county_leader: "County Leader",
  district_leader: "District Leader",
  clan_leader: "Clan Leader",
  town_leader: "Town Leader",
  village_leader: "Village Leader",
  citizen: "Citizen",
};

// All roles in hierarchy order
export const ALL_ROLES = [
  "admin",
  "county_leader",
  "district_leader",
  "clan_leader",
  "town_leader",
  "village_leader",
  "citizen",
];

// All leader roles (non-admin and non-citizen)
export const LEADER_ROLES = [
  "county_leader",
  "district_leader",
  "clan_leader",
  "town_leader",
  "village_leader",
];

/**
 * Build a Sequelize WHERE clause that scopes data to the user's location.
 *
 * - admin → no filter (sees everything)
 * - county_leader → filter by county_id
 * - district_leader → filter by county_id + district_id
 * - clan_leader → filter by county_id + district_id + clan_id
 * - town_leader → filter by county_id + district_id + clan_id + town_id
 * - village_leader → filter by county_id + district_id + clan_id + town_id + village_id
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

    case "village_leader":
      return {
        county_id: user.county_id,
        district_id: user.district_id,
        clan_id: user.clan_id,
        town_id: user.town_id,
        village_id: user.village_id,
      };

    case "citizen":
      return { village_id: user.village_id };

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
