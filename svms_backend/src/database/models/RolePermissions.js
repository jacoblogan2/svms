"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RolePermissions extends Model {
    static associate(models) {
      RolePermissions.belongsTo(models.Permissions, {
        foreignKey: "permissionId",
        as: "permission",
      });
    }
  }

  RolePermissions.init(
    {
      role: {
        type: DataTypes.ENUM(
          "admin",
          "county_leader",
          "district_leader",
          "clan_leader",
          "town_leader",
          "village_leader",
          "citizen"
        ),
        allowNull: false,
      },
      permissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "RolePermissions",
      tableName: "RolePermissions",
    }
  );

  return RolePermissions;
};
