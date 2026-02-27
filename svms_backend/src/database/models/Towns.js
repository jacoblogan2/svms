"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Towns extends Model {
    static associate(models) {
      Towns.belongsTo(models.Clans, { foreignKey: "clanId", as: "clan" });
      Towns.hasMany(models.Villages, { foreignKey: "townId", as: "villages" });
    }
  }

  Towns.init(
    {
      name: DataTypes.STRING,
      clanId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Towns",
    }
  );

  return Towns;
};
