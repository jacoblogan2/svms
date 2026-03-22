import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Comments extends Model {
    static associate(models) {
      // A comment belongs to a post
      Comments.belongsTo(models.Posts, { foreignKey: "postID", as: "post" });
      Comments.belongsTo(models.Users, { foreignKey: "userID", as: "user" });
    }
  }

  Comments.init(
    {
      postID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userID: {  // Linking comment to the user
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Comments",
    }
  );

  return Comments;
};
