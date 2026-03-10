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

      Requests.belongsTo(models.Counties, { foreignKey: "current_county_id", as: "current_county" });
      Requests.belongsTo(models.Districts, { foreignKey: "current_district_id", as: "current_district" });
      Requests.belongsTo(models.Clans, { foreignKey: "current_clan_id", as: "current_clan" });
      Requests.belongsTo(models.Towns, { foreignKey: "current_town_id", as: "current_town" });
      Requests.belongsTo(models.Villages, { foreignKey: "current_village_id", as: "current_village" });
    }
  }

  Requests.init(
    {
      userID: DataTypes.INTEGER,
      reason: DataTypes.STRING,
      status: DataTypes.STRING,
      full_name: DataTypes.STRING,
      national_id: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      household_size: DataTypes.INTEGER,
      current_county_id: DataTypes.INTEGER,
      current_district_id: DataTypes.INTEGER,
      current_clan_id: DataTypes.INTEGER,
      current_town_id: DataTypes.INTEGER,
      current_village_id: DataTypes.INTEGER,
      county_id: { type: DataTypes.INTEGER, allowNull: true },
      district_id: { type: DataTypes.INTEGER, allowNull: true },
      clan_id: { type: DataTypes.INTEGER, allowNull: true },
      town_id: { type: DataTypes.INTEGER, allowNull: true },
      village_id: { type: DataTypes.INTEGER, allowNull: true },
      transfer_type: DataTypes.STRING,
      move_date: DataTypes.DATE,
      transfer_duration: DataTypes.STRING,
      supporting_document: DataTypes.STRING,
      host_name: DataTypes.STRING,
      host_phone: DataTypes.STRING,
      host_relationship: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Requests",
    }
  );

  return Requests;
};
