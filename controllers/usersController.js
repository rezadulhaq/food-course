const {Category, Course,Profile, User,UsersCourse} = require("../models")
const { Op, fn } = require("sequelize")


class Controller {
    static home(req, res) {
        res.render('./users/home')
    }

    static categoryList(req, res) {
        Category.findAll()
        .then((data)=>{
            res.render('./users/categoryList',{data})
        })
        .catch((err)=>{
            res.send(err)
        })
    }

    static courseList(req, res) {
        const id = req.params.categoryId
        Course.findAll({
            include: Category
        }, {
            where: {
                id:id
            }
        })
        .then((data)=>{
            res.render('./users/courseList',{data})
        })
        .catch((err)=>{
            res.send(err)
        })
    }

    // static buy(req, res) {
        
    //     .then((data)=>{
    //         res.render('',{data})
    //     })
    //     .catch((err)=>{
    //         res.send(err)
    //     })
    // }
    
    // static profile(req, res) {
        
    //     .then((data)=>{
    //         res.render('',{data)
    //     })
    //     .catch((err)=>{
    //         res.send(err)
    //     })
    // }

    // static editProfileForm(req, res) {
        
    //     .then((data)=>{
    //         res.render('',{data)
    //     })
    //     .catch((err)=>{
    //         res.send(err)
    //     })
    // }
    // static editProfile(req, res) {
        
    //     .then((data)=>{
    //         res.render('',{data})
    //     })
    //     .catch((err)=>{
    //         res.send(err)
    //     })
    // }

    // static deleteCourse(req, res) {
        
    //     .then((data)=>{
    //         res.render('',{data})
    //     })
    //     .catch((err)=>{
    //         res.send(err)
    //     })
    // }

}
module.exports = Controller