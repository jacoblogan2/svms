"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      Users.hasMany(models.Posts, { foreignKey: "userID", as: "Posts" });
      Users.hasMany(models.Notifications, { foreignKey: "userID", as: "notifications" });
      Users.hasMany(models.Requests, { foreignKey: "userID", as: "requests" });
      Users.hasMany(models.Documents, { foreignKey: "userID", as: "documents" });
      Users.belongsTo(models.Counties, { foreignKey: "county_id", as: "county" });
      Users.belongsTo(models.Districts, { foreignKey: "district_id", as: "district" });
      Users.belongsTo(models.Clans, { foreignKey: "clan_id", as: "clan" });
      Users.belongsTo(models.Towns, { foreignKey: "town_id", as: "town" });
      Users.belongsTo(models.Villages, { foreignKey: "village_id", as: "village" });
    }
  }

  Users.init(
    {
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      email: { type: DataTypes.STRING, unique: true },
      password: DataTypes.STRING,
      phone: { type: DataTypes.STRING, unique: true },
      gender: DataTypes.STRING,

      nid: DataTypes.STRING,
      familyinfo: DataTypes.STRING,
    

      code: DataTypes.STRING,
      status: DataTypes.STRING,
      image: DataTypes.STRING,
      role: {
        type: DataTypes.ENUM(
          "county_leader",
          "district_leader",
          "clan_leader",
          "town_leader",
          "village_leader",
          "admin",
          "citizen",
        ),
        allowNull: false,
      },
      county_id: { type: DataTypes.INTEGER, allowNull: true },
      district_id: { type: DataTypes.INTEGER, allowNull: true },
      clan_id: { type: DataTypes.INTEGER, allowNull: true },
      town_id: { type: DataTypes.INTEGER, allowNull: true },
      village_id: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      sequelize,
      modelName: "Users",
    }
  );

  return Users;
};
