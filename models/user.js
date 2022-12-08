'use strict';
const bcryptjs = require("bcryptjs")
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile)
      User.hasMany(models.UsersCourse)
    }
  }
  User.init({
    email: {
     type : DataTypes.STRING,
     allowNull: false,
     validate:{
      notNull: {
        msg: 'Please enter your email',
      },
      isEmail: true
     }
    },
    password: DataTypes.STRING,
    role: DataTypes.BOOLEAN
  }, {
    hooks :{
      beforeCreate(instance, option) {
        let salt = bcryptjs.genSaltSync(10);
        let hash = bcryptjs.hashSync(instance.password, salt);

        instance.password = hash
      }

    },
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate(el =>{
    if (el.email.slice(0,6) === 'admin.'){
      el.role = true
    } else {
      el.role = false
    }
  })
  return User;
};