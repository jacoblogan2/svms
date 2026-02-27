"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Counties extends Model {
    static associate(models) {
      Counties.hasMany(models.Districts, { foreignKey: "countyId", as: "districts" });
    }
  }

  Counties.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Counties",
    }
  );

  return Counties;
};
