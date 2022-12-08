const {Category, Course, Profile, User} = require('../models/index')
const { Op } = require("sequelize");

class Controller{
    static showCourse(req, res){
        Course.findAll()
        .then(function(data){
            res.render('admin/index', {data})
        })
        .catch(function(err){
            res.send(err)
        })
    }

    static formAddCourse(req, res){
        Category.findAll()
        .then(function(data){
            res.render('admin/formAddCourse', {data})
        })
        .catch(function(err){
            res.send(err)
        })
    }

    static postAddCourse(req, res){
        console.log(req.body);
        const{name, price, description, CategoryId} = req.body
        Course.create({
            name, price, description, CategoryId
        })
        .then(function(data){
            res.redirect('/admin/add-course')
        })
    }
}

module.exports = Controller