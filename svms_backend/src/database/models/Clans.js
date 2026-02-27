"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Clans extends Model {
    static associate(models) {
      Clans.belongsTo(models.Districts, { foreignKey: "districtId", as: "district" });
      Clans.hasMany(models.Towns, { foreignKey: "clanId", as: "towns" });
    }
  }

  Clans.init(
    {
      name: DataTypes.STRING,
      districtId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Clans",
    }
  );

  return Clans;
};
