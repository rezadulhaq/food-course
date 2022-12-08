const { Category, Course, Profile, User, UsersCourse, sequelize } = require("../models")
const { Op } = require("sequelize")
const { fn } = require("sequelize")
const bcryptjs = require("bcryptjs")
const formatDate = require('../helpers/formatDate')
const formatRupiah = require('../helpers/formatRupiah')
const nodeMailer = require('../helpers/nodemailer')

class Controller {

    static registerForm(req, res) {
        res.render('./users/registerForm')
    }
    static register(req, res) {
        console.log(req.body)
        const { fullName, email, password, age, imageUrl, gender } = req.body
        User.create({ email, password })
            .then((_) => {
                return User.findAll({
                    where: { email: email }
                })
            })
            .then((data) => {
                let UserId = data[0].id
                return Profile.create({ fullName, email, password, age, imageUrl, gender, UserId })
            })
            .then((_) => {
                res.redirect('/')
            })
            .catch((err) => {
                console.log(err)
                res.send(err)
            })
    }

    static loginForm(req, res) {
        res.render('./users/loginForm')
    }
    static login(req, res) {
        const { email, password } = req.body
        User.findOne({ where: { email } })
            .then((data) => {
                if (data) {
                    const isInvalidPassword = bcryptjs.compareSync(password, data.password)
                    if (isInvalidPassword) {
                        req.session.userId = data.id
                        req.session.role = data.role
                        req.session.email = data.email
                        if (data.role === true) {
                            res.redirect('/admin')
                        } else {
                            res.redirect('/users')
                        }
                    } else if (!isInvalidPassword) {
                        const errors = 'invalid email or password'
                        res.redirect(`/?error=${errors}`)
                    }
                }
            })
            .catch((err) => {
                console.log(err)
                res.send(err)
            })
    }

    static logout(req, res) {
        req.session.destroy(err => {
            if (err) {
                res.send(err)
            } else {
                res.redirect('/')
            }
        })
    }

    // batas login

    static home(req, res) {
        // res.render('./users/home')
        const id = req.session.userId
        // console.log(id);
        let imageUrl
        let fullName
        console.log(req.session);
        User.findByPk(id, {
            include: Profile
        })
            .then((data) => {
                let object = {
                    fullName: data.Profile.fullName,
                    imageUrl: data.Profile.imageUrl
                }
                Object.assign(req.session,object)
                imageUrl = req.session.imageUrl
                fullName = req.session.fullName
                // result = data
                return Category.findAll()
            })
            .then(function(data){
                res.render('./users/home', { data, imageUrl, fullName, formatDate, formatRupiah })
            })
            .catch((err) => {
                console.log(err);
                res.send(err)
            })
    }

    static categoryList(req, res) {
        const id = req.params.userId
        User.findByPk(id, {
            model: Course,
            include: {
                model: Category
            }
        })
        Category.findAll()
            .then((data) => {
                console.log(data)
                // res.render('./users/categoryList',{data: data.Category})
            })
            .catch((err) => {
                res.send(err)
            })
    }

    static courseList(req, res) {
        const id = req.params.categoryId
        Course.findAll({
            include: Category
        }, {
            where: {
                id: id
            }
        })
            .then((data) => {
                res.render('./users/courseList', { data })
            })
            .catch((err) => {
                res.send(err)
            })
    }

    static buy(req, res) {

        const {courseId} = req.params
        const {userId, email} = req.session
        console.log(req.session,"<<<<<<<<<<<<<<<<<");
        UsersCourse.create({UserId: userId, CourseId: courseId})
        .then((data)=>{
            nodeMailer(email, "pisang")
            res.redirect('/users')
            // res.render('',{data})
        })
        .catch((err)=>{
            console.log(courseId, id,"<<<<<<<<<<<<<<<<<");
            console.log(err);
            res.send(err)
        })
    } 

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