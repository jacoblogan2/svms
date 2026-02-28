"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Districts extends Model {
    static associate(models) {
      Districts.belongsTo(models.Counties, { foreignKey: "countyId", as: "county" });
      Districts.hasMany(models.Clans, { foreignKey: "districtId", as: "clans" });
    }
  }

  Districts.init(
    {
      name: DataTypes.STRING,
      countyId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Districts",
      tableName: "Districts",
    }
  );

  return Districts;
};
