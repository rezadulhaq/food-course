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
    static methodApa(data){
      data.map(function(el){
        return el.name = el.name +'aneh'
      })
    }
    courseCodeSet(){ //instenceMethod
      return `${this.name.toLowerCase().split(" ").join("_")}_${this.createdAt.toISOString().slice(0, 10)}`
    }
  }
  Course.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    courseCode: DataTypes.STRING,
    price: DataTypes.INTEGER,
    CategoryId: DataTypes.INTEGER,
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