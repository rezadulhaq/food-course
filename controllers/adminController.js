const {Category, Course, Profile, User} = require('../models/index')
const { Op } = require("sequelize");
const formatDate = require('../helpers/formatDate')
const formatRupiah = require('../helpers/formatRupiah')

class Controller{
    static showCourse(req, res){
        Course.findAll()
        .then(function(data){
            res.render('admin/index', {data, formatDate, formatRupiah})
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
            res.redirect('/admin')
        })
    }

    static formEditCourse(req, res){
        const {id} = req.params
        let result
        Course.findOne({
            where:{
                id
            }
        })
        .then(function(data){
            // console.log(data.Category);
            result = data
            return Category.findAll()
        })
        .then(function(data){
            res.render('admin/formEditCourse', {data, result})
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        })
    }

    static postEditCourse(req, res){
        const {id} = req.params
        console.log(req.params);
        const{name, price, description, CategoryId} = req.body
        Course.update({
            name, price, description, CategoryId
        },
        {
            where: {id}
        })
        .then(function(data){
            res.redirect('/admin')
        })
        .catch(function(err){
            res.send(err)
        })
    }

    static deleteCourse(req, res){
        const {id} = req.params
        Course.destroy({
            where:{id}
        })
        .then(function(data){
            res.redirect('/admin')
        })
        .catch(function(err){
            res.send(err)
        })
    }

    static showCategory(req, res){
        Category.findAll()
        .then(function(data){
            res.render('admin/category', {data})
        })
        .catch(function(err){
            res.send(err)
        })
    }

    static renderAddCategory(req, res){
        res.render('admin/formAddCategory')
    }

    static postAddCategory(req, res){
        const {name} = req.body
        Category.create({
            name
        })
        .then(function(data){
            res.redirect('/admin')
        })
        .catch(function(data){
            res.send(data)
        })
    }

    static showCategoryById(req, res){
        const {id} = req.params
        Category.findOne({
            include: {model: Course}
        },
        {
            where:{id}
        })
        .then(function(data){
            // console.log(data);
            res.render('admin/categoryDetail', {data, formatDate, formatRupiah})
        })
        .catch(function(err){
            res.send(err)
        })
    }
}

module.exports = Controller