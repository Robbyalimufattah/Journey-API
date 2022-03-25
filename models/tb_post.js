'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_post.belongsTo(models.tb_user, {
        as: "user",
        foreignKey: {
          name: "idUser",
        },
      });

      tb_post.hasOne(models.tb_bookmark, {
        as: "bookmark",
        foreignKey: {
          name: "idPost"
        }
      })
    }
  }
  tb_post.init({
    title: DataTypes.STRING,
    image: DataTypes.STRING,
    desc: DataTypes.TEXT,
    idUser: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tb_post',
  });
  return tb_post;
};