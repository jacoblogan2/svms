import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import db from "../database/models/index.js";

const User = db["Users"];

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
      });

      // Pre-load user permissions from RolePermissions table (if available)
      try {
        const RolePermissions = db["RolePermissions"];
        const Permissions = db["Permissions"];
        if (RolePermissions && Permissions && req.user) {
          const rolePerms = await RolePermissions.findAll({
            where: { role: req.user.role },
            include: [{ model: Permissions, as: "permission" }],
          });
          req.user.permissions = rolePerms.map(
            (rp) => rp.permission && rp.permission.name
          ).filter(Boolean);
        }
      } catch (permError) {
        // RBAC tables may not exist yet — don't block auth
        console.warn("Could not load permissions (tables may not exist yet):", permError.message);
        req.user.permissions = [];
      }

      return next();
    } catch (error) {
      console.error("JWT Verification Error:", error);
      return res.status(401).json({ message: "Not authorized" });
    }
  }

  return res.status(401).json({ message: "Not authorized, no token" });
});

// Optional protection middleware
export const optionalProtect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
      });
    } catch (error) {
      console.error("JWT Verification Error (Optional Protect):", error);
    }
  }

  next();
});
