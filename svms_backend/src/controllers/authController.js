import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { getUserByEmail } from "../services/userService.js";
import db from "../database/models/index.js";
const { RolePermissions, Permissions } = db;



export const login = async (req, res) => {
  if (!req.body.email || req.body.email === "") {
    return res.status(400).json({
      success: false,
      message: "Please provide email",
    });
  }
  if (!req.body.password || req.body.password === "") {
    return res.status(400).json({
      success: false,
      message: "Please provide password",
    });
  }
  let user = await getUserByEmail(req.body.email);
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid email or password",
    });
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).json({
      success: false,
      message: "Invalid email or password",
    });
  }
  if (user.status !== "active") {
    return res.status(400).json({
      success: false,
      message: "Your account is not active",
    });
  }
  // Fetch permissions for the role
  const rolePermissions = await RolePermissions.findAll({
    where: { role: user.role },
    include: [{ model: Permissions, as: "permission" }],
  });
  const permissions = rolePermissions.map((rp) => rp.permission.name);

  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    token: generateToken(user.id),
    user: {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      restaurents: user.restaurents,
      gender: user.gender,
      address: user.address,
      image: user.image,
      county_id: user.county_id,
      district_id: user.district_id,
      clan_id: user.clan_id,
      town_id: user.town_id,
      village_id: user.village_id,
      permissions: permissions, // Added permissions to the user object
    },
  });
};

export const forgotPassword = async (req, res) => {
  if (!req.body.email || req.body.email === "") {
    return res.status(400).json({
      success: false,
      message: "Please provide email",
    });
  }
  const user = await getUserByEmail(req.body.email);
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid email",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Password reset link sent to your email",
  });
};

export const resetPassword = async (req, res) => {
  if (!req.body.password || req.body.password === "") {
    return res.status(400).json({
      success: false,
      message: "Please provide password",
    });
  }
  if (!req.body.confirmPassword || req.body.confirmPassword === "") {
    return res.status(400).json({
      success: false,
      message: "Please provide confirmPassword",
    });
  }
  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "password and confirmPassword does not match",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
};

// generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
