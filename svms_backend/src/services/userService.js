import bcrypt from "bcryptjs";
import db from "../database/models/index.js";
const {
  Counties,
  Districts,
  Clans,
  Towns,
  Villages,
  Categories,
  Users,
  Posts,
  Notifications,
  Documents,
} = db;

import Sequelize, { where } from "sequelize";

export const getMyUsers = async (id) => {
  try {
    const allUsers = await Users.findAll({
      where: {
        role: "citizen",
        village_id: id,
      },
      attributes: { exclude: ["password"] },
      include: [
        { model: Notifications, as: "notifications" },
        { model: Counties, as: "county" },
        { model: Districts, as: "district" },
        { model: Clans, as: "clan" },
        { model: Towns, as: "town" },
        { model: Villages, as: "village" },
      ],
    });

    return allUsers;
  } catch (error) {
    console.error("Error fetching my users:", error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const allUsers = await Users.findAll({
      attributes: { exclude: ["password"] },
      include: [
        { model: Notifications, as: "notifications" },
        { model: Counties, as: "county" },
        { model: Districts, as: "district" },
        { model: Clans, as: "clan" },
        { model: Towns, as: "town" },
        { model: Villages, as: "village" },
        {
          model: Documents,
          as: "documents",
          include: [{ model: Users, as: "recorder" }],
        },
      ],
    });

    return allUsers;
  } catch (error) {
    console.error("Error in getUsers service:", error);
    throw error;
  }
};
export const getalldocuments = async (userID) => {
  try {
    const allUsers = await Users.findAll({
      where: { id: userID },
      attributes: { exclude: ["password"] },
      include: [
        { model: Notifications, as: "notifications" },
        { model: Counties, as: "county" },
        { model: Districts, as: "district" },
        { model: Clans, as: "clan" },
        { model: Towns, as: "town" },
        { model: Villages, as: "village" },
        {
          model: Documents,
          as: "documents",
          include: [{ model: Users, as: "recorder" }],
        },
      ],
    });

    return allUsers;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
};

export const getUsers1 = async () => {
  try {
    const allUsers = await Users.findAll({
      where: { role: "user" },
      attributes: { exclude: ["password"] },
      include: [
        {
          model: db.ProfileDetails,
          as: "ProfileDetails",
          include: [{ model: db.ProfileCategories, as: "category" }],
        },
        { model: db.Missions, as: "missions" },
        { model: db.Appointments, as: "appointments" },
        { model: Notifications, as: "notifications" },
        {
          model: db.Department,
          as: "department",
          include: [
            {
              model: Users,
              as: "reader",
              attributes: { exclude: ["password"] },
            },
          ],
        },
      ],
    });

    return allUsers;
  } catch (error) {
    console.error("Error fetching users1:", error);
    throw error;
  }
};

export const createUser = async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  const newUser = await Users.create(user);
  return newUser;
};

export const createUserCustomer = async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  const newUser = await Users.create(user);
  return newUser;
};

export const getUser = async (id) => {
  const user = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
    include: [
      { model: Notifications, as: "notifications" },
      { model: Counties, as: "county" },
      { model: Districts, as: "district" },
      { model: Clans, as: "clan" },
      { model: Towns, as: "town" },
      { model: Villages, as: "village" },
      {
        model: Documents,
        as: "documents",
        include: [{ model: Users, as: "recorder" }],
      },
    ],
  });
  return user;
};

export const GetUserPassword = async (id) => {
  const user = await Users.findByPk(id, {
    attributes: ["password"],
  });
  return user ? user.password : null;
};

export const getUserByEmail = async (email) => {
  try {
    const user = await Users.findOne({
      where: { email },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
};

export const getUserByNid = async (nid) => {
  try {
    const user = await Users.findOne({
      where: { nid },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user by nid:", error);
    throw error;
  }
};

export const getUserByPhone = async (phone) => {
  try {
    const user = await Users.findOne({
      where: { phone },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user by phone:", error);
    throw error;
  }
};

export const getallUsers = async () => {
  const allUsers = await Users.findAll({
    attributes: { exclude: ["password"] },
    include: [
      { model: Notifications, as: "notifications" },
      { model: Counties, as: "county" },
      { model: Districts, as: "district" },
      { model: Clans, as: "clan" },
      { model: Towns, as: "town" },
      { model: Villages, as: "village" },
    ],
  });
  return allUsers;
};

export const updateUser = async (id, user) => {
  const userToUpdate = await Users.findOne({
    where: { id },
    attributes: { exclude: ["password"] },
  });
  if (userToUpdate) {
    await Users.update(user, { where: { id } });
    return user;
  }
  return null;
};

export const deleteUser = async (id) => {
  const userToDelete = await Users.findOne({ where: { id } });
  if (userToDelete) {
    await Users.destroy({ where: { id } });
    return userToDelete;
  }
  return null;
};

export const activateUser = async (id) => {
  const userToActivate = await Users.findOne({
    where: { id },
    attributes: { exclude: ["password"] },
  });
  if (userToActivate) {
    await Users.update({ status: "active" }, { where: { id } });
    return userToActivate;
  }
  return null;
};

export const deactivateUser = async (id) => {
  const userToDeactivate = await Users.findOne({
    where: { id },
    attributes: { exclude: ["password"] },
  });
  if (userToDeactivate) {
    await Users.update({ status: "inactive" }, { where: { id } });
    return userToDeactivate;
  }
  return null;
};

export const updateUserCode = async (email, user) => {
  const userToUpdate = await Users.findOne({
    where: { email },
    attributes: { exclude: ["password"] },
  });
  if (userToUpdate) {
    await Users.update(user, { where: { email } });
    return user;
  }
  return null;
};

export const getUserByCode = async (email, code) => {
  try {
    const user = await Users.findOne({
      where: { code: code, email: email },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user by code:", error);
    throw error;
  }
};
