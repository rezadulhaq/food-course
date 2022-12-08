'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.belongsTo(models.Category)
      Course.hasMany(models.UsersCourse)
    }
    static methodApa(data) {
      data.map(function (el) {
        return el.name = el.name + 'aneh'
      })
    }
    courseCodeSet() { //instenceMethod
      return `${this.name.toLowerCase().split(" ").join("_")}_${this.createdAt.toISOString().slice(0, 10)}`
    }
  }
  Course.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Course name is required`
        },
        notEmpty: {
          msg: `Course name is required`
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Description is required`
        },
        notEmpty: {
          msg: `Description is required`
        }
      }
    },
    courseCode: DataTypes.STRING,
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Course price is required`
        },
        notEmpty: {
          msg: `Course prise is required`
        }
      }
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      validate: {
        notCoosen() {
          if(value === '--Pilih Category--') {
            throw new Error `Please choose category`
          }
        }
      }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
    {
      hooks: { //hooks
        beforeCreate: function (course, options) {
          course.courseCode = course.courseCodeSet()
        }
      },
      sequelize,
      modelName: 'Course',
    });
  return Course;
};