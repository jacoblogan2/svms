"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Villages extends Model {
    static associate(models) {
      Villages.belongsTo(models.Towns, { foreignKey: "townId", as: "town" });
    }
  }

  Villages.init(
    {
      name: DataTypes.STRING,
      townId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Villages",
      tableName: "Villages",
    }
  );

  return Villages;
};
