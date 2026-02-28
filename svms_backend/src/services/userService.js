import bcrypt from "bcryptjs";
import db from "../database/models/index.js";
import Sequelize from "sequelize";

const getModels = () => {
    const {
        Counties,
        Districts,
        Clans,
        Towns,
        Villages,
        Users,
        Notifications,
        Documents,
    } = db;
    if (!Users || !Counties || !Districts || !Clans || !Towns || !Villages) {
        console.error("Missing models in userService:", Object.keys(db).filter(k => !db[k]));
        throw new Error("Database error: Missing user related models");
    }
    return { Counties, Districts, Clans, Towns, Villages, Users, Notifications, Documents };
};

export const getMyUsers = async (id) => {
  try {
    const { Counties, Districts, Clans, Towns, Villages, Users, Notifications } = getModels();
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
    const { Counties, Districts, Clans, Towns, Villages, Users, Notifications, Documents } = getModels();
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
    const { Counties, Districts, Clans, Towns, Villages, Users, Notifications, Documents } = getModels();
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

export const createUser = async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  const newUser = await db.Users.create(user);
  return newUser;
};

export const createUserCustomer = async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  const newUser = await db.Users.create(user);
  return newUser;
};

export const getUser = async (id) => {
  const { Counties, Districts, Clans, Towns, Villages, Users, Notifications, Documents } = getModels();
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
    const { Users } = getModels();
  const user = await Users.findByPk(id, {
    attributes: ["password"],
  });
  return user ? user.password : null;
};

export const getUserByEmail = async (email) => {
  try {
    const { Users } = getModels();
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
    const { Users } = getModels();
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
    const { Users } = getModels();
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
    const { Counties, Districts, Clans, Towns, Villages, Users, Notifications } = getModels();
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
    const { Users } = getModels();
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
    const { Users } = getModels();
  const userToDelete = await Users.findOne({ where: { id } });
  if (userToDelete) {
    await Users.destroy({ where: { id } });
    return userToDelete;
  }
  return null;
};

export const activateUser = async (id) => {
    const { Users } = getModels();
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
    const { Users } = getModels();
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
    const { Users } = getModels();
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
    const { Users } = getModels();
    const user = await Users.findOne({
      where: { code: code, email: email },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user by code:", error);
    throw error;
  }
};

