"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    static associate(models) {
      Posts.belongsTo(models.Users, { foreignKey: "userID", as: "user" });
      Posts.belongsTo(models.Categories, { foreignKey: "categoryID", as: "category" });

      Posts.belongsTo(models.Counties, { foreignKey: "county_id", as: "county" });
      Posts.belongsTo(models.Districts, { foreignKey: "district_id", as: "district" });
      Posts.belongsTo(models.Clans, { foreignKey: "clan_id", as: "clan" });
      Posts.belongsTo(models.Towns, { foreignKey: "town_id", as: "town" });
      Posts.belongsTo(models.Villages, { foreignKey: "village_id", as: "village" });

      Posts.hasMany(models.Comments, { foreignKey: "postID", as: "comments" });
      

    }
  }

  Posts.init(
    {
      userID: DataTypes.INTEGER,
      categoryID: DataTypes.INTEGER,
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      image: DataTypes.STRING,
      status: DataTypes.STRING,

      county_id: { type: DataTypes.INTEGER, allowNull: true },
      district_id: { type: DataTypes.INTEGER, allowNull: true },
      clan_id: { type: DataTypes.INTEGER, allowNull: true },
      town_id: { type: DataTypes.INTEGER, allowNull: true },
      village_id: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      sequelize,
      modelName: "Posts",
    }
  );

  return Posts;
};
