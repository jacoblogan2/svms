"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Requests extends Model {
    static associate(models) {
      Requests.belongsTo(models.Users, { foreignKey: "userID", as: "user" });

      Requests.belongsTo(models.Counties, { foreignKey: "county_id", as: "county" });
      Requests.belongsTo(models.Districts, { foreignKey: "district_id", as: "district" });
      Requests.belongsTo(models.Clans, { foreignKey: "clan_id", as: "clan" });
      Requests.belongsTo(models.Towns, { foreignKey: "town_id", as: "town" });
      Requests.belongsTo(models.Villages, { foreignKey: "village_id", as: "village" });

    }
  }

  Requests.init(
    {
      userID: DataTypes.STRING,
      reason: DataTypes.STRING,
      status: DataTypes.STRING,
      county_id: { type: DataTypes.INTEGER, allowNull: true },
      district_id: { type: DataTypes.INTEGER, allowNull: true },
      clan_id: { type: DataTypes.INTEGER, allowNull: true },
      town_id: { type: DataTypes.INTEGER, allowNull: true },
      village_id: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      sequelize,
      modelName: "Requests",
    }
  );

  return Requests;
};
