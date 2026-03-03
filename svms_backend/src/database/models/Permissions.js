"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Permissions extends Model {
    static associate(models) {
      Permissions.hasMany(models.RolePermissions, {
        foreignKey: "permissionId",
        as: "rolePermissions",
      });
    }
  }

  Permissions.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Permissions",
      tableName: "Permissions",
    }
  );

  return Permissions;
};
