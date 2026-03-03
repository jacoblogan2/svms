"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class FamilyMembers extends Model {
    static associate(models) {
      FamilyMembers.belongsTo(models.Users, { foreignKey: "household_head_id", as: "head" });
      FamilyMembers.belongsTo(models.Counties, { foreignKey: "county_id", as: "county" });
      FamilyMembers.belongsTo(models.Districts, { foreignKey: "district_id", as: "district" });
      FamilyMembers.belongsTo(models.Clans, { foreignKey: "clan_id", as: "clan" });
      FamilyMembers.belongsTo(models.Towns, { foreignKey: "town_id", as: "town" });
      FamilyMembers.belongsTo(models.Villages, { foreignKey: "village_id", as: "village" });
    }
  }

  FamilyMembers.init(
    {
      fullname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      dob: DataTypes.DATE,
      gender: DataTypes.STRING,
      relationship: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM("Alive", "Deceased"),
        defaultValue: "Alive"
      },
      dod: DataTypes.DATE,
      marital_status: DataTypes.STRING,
      occupation: DataTypes.STRING,
      notes: DataTypes.TEXT,
      household_head_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      county_id: DataTypes.INTEGER,
      district_id: DataTypes.INTEGER,
      clan_id: DataTypes.INTEGER,
      town_id: DataTypes.INTEGER,
      village_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "FamilyMembers",
    }
  );

  return FamilyMembers;
};
