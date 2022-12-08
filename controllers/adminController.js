const {Category, Course, Profile, User} = require('../models/index')
const { Op } = require("sequelize");

class Controller{
    static showCourse(req, res){
        Course.findAll()
        .then(function(data){
            res.render('users/showCourse', {data})
        })
        .catch(function(err){
            res.send(err)
        })
    }
}

module.exports = Controller