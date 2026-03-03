"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Reports extends Model {
    static associate(models) {
      Reports.belongsTo(models.Users, { foreignKey: "generatedBy", as: "generator" });
      Reports.belongsTo(models.Counties, { foreignKey: "county_id", as: "county" });
      Reports.belongsTo(models.Districts, { foreignKey: "district_id", as: "district" });
      Reports.belongsTo(models.Clans, { foreignKey: "clan_id", as: "clan" });
      Reports.belongsTo(models.Towns, { foreignKey: "town_id", as: "town" });
      Reports.belongsTo(models.Villages, { foreignKey: "village_id", as: "village" });
    }
  }

  Reports.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      summary: DataTypes.TEXT,
      generatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      scope: {
        type: DataTypes.STRING,
        allowNull: false
      },
      data: {
        type: DataTypes.JSONB,
        defaultValue: {}
      },
      county_id: DataTypes.INTEGER,
      district_id: DataTypes.INTEGER,
      clan_id: DataTypes.INTEGER,
      town_id: DataTypes.INTEGER,
      village_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Reports",
    }
  );

  return Reports;
};
