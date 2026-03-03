/**
 * Location-scoping middleware.
 *
 * Attaches `req.locationScope` — a Sequelize WHERE clause that limits
 * query results to the current user's jurisdiction.
 *
 * Must run AFTER `protect` middleware (needs req.user).
 */

import { getLocationScope } from "./roleConfig.js";

const locationScope = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  req.locationScope = getLocationScope(req.user);
  next();
};

export default locationScope;
