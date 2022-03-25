'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_user.hasMany(models.tb_post, {
        as: "post",
        foreignKey: {
          name: "idUser",
        },
      });

      tb_user.hasMany(models.tb_bookmark, {
        as: "bookmark",
        foreignKey: {
          name: "idUser"
        }
      })
    }
  }
  tb_user.init({
    fullname: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tb_user',
  });
  return tb_user;
};