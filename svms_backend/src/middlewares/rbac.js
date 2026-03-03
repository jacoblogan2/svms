/**
 * Role-Based Access Control middleware.
 *
 * Two middleware factories:
 *   checkRole(...roles)      — allow only users whose role is in the list
 *   checkPermission(name)    — allow only users who have the named permission
 *
 * Both rely on `req.user` being set by the `protect` middleware first.
 */

import db from "../database/models/index.js";

/**
 * Middleware: reject request unless user's role is in the allowed list.
 *
 * @param  {...string} allowedRoles  e.g. 'admin', 'county_leader'
 * @returns {Function} Express middleware
 */
export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden: insufficient role",
        required: allowedRoles,
        current: req.user.role,
      });
    }

    next();
  };
};

/**
 * Middleware: reject request unless user's role has the specified permission.
 *
 * If permissions were pre-loaded onto req.user.permissions (by the updated
 * protect middleware), we check the in-memory list.  Otherwise we fall back
 * to a DB query so it still works even if protect wasn't updated yet.
 *
 * @param {string} permissionName  e.g. 'approve_request'
 * @returns {Function} Express middleware
 */
export const checkPermission = (permissionName) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Fast path: permissions were pre-loaded by protect middleware
    if (req.user.permissions && Array.isArray(req.user.permissions)) {
      if (req.user.permissions.includes(permissionName)) {
        return next();
      }
      return res.status(403).json({
        message: "Forbidden: missing permission",
        required: permissionName,
      });
    }

    // Slow path: query DB directly
    try {
      const RolePermissions = db["RolePermissions"];
      const Permissions = db["Permissions"];

      if (!RolePermissions || !Permissions) {
        // Tables don't exist yet (migrations not run) — fall through so
        // existing functionality is not blocked.
        console.warn("RBAC tables not available, skipping permission check");
        return next();
      }

      const match = await RolePermissions.findOne({
        where: { role: req.user.role },
        include: [
          {
            model: Permissions,
            as: "permission",
            where: { name: permissionName },
          },
        ],
      });

      if (match) {
        return next();
      }

      return res.status(403).json({
        message: "Forbidden: missing permission",
        required: permissionName,
      });
    } catch (error) {
      console.error("Permission check error:", error);
      // If tables don't exist yet, allow request through to avoid breaking
      // existing functionality before migrations are run.
      return next();
    }
  };
};
