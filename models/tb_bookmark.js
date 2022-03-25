'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_bookmark extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_bookmark.belongsTo(models.tb_user, {
        as: "user",
        foreignKey: {
          name: "idUser"
        }
      });

      tb_bookmark.belongsTo(models.tb_post, {
        as: "post",
        foreignKey: {
          name: "idPost"
        }
      });
    }
  }
  tb_bookmark.init({
    idUser: DataTypes.INTEGER,
    idPost: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tb_bookmark',
  });
  return tb_bookmark;
};