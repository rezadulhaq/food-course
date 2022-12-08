const { Category, Course, Profile, User, UsersCourse, sequelize } = require("../models")
const { Op } = require("sequelize")
const { fn } = require("sequelize")
const bcryptjs = require("bcryptjs")
const formatDate = require('../helpers/formatDate')
const formatRupiah = require('../helpers/formatRupiah')
const nodeMailer = require('../helpers/nodemailer')
const getUserId = require('../helpers/getUserId')

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
        // console.log(req.session);
        User.findByPk(id, {
            include: Profile
        })
            .then((data) => {
                let object = {
                    fullName: data.Profile.fullName,
                    imageUrl: data.Profile.imageUrl
                }
                Object.assign(req.session, object)
                imageUrl = req.session.imageUrl
                fullName = req.session.fullName
                // result = data
                return Category.findAll()
            })
            .then(function (data) {
                // console.log(data);
                res.render('./users/home', { data, imageUrl, fullName, formatDate, formatRupiah })
            })
            .catch((err) => {
                // console.log(err);
                res.send(err)
            })
    }

    static courseList(req, res) {
        const { categoryId } = req.params
        const id = req.session.userId
        // console.log(search);
        let imageUrl
        let fullName
        User.findByPk(id, {
            include: {
                model: Profile
            }
        })
            .then(function (data) {
                console.log(data.Profile);
                imageUrl = req.session.imageUrl
                fullName = req.session.fullName
                return Category.findOne({
                    include: [
                        {
                            model: Course,
                            include: { model: UsersCourse }
                        }
                    ]
                },
                    {
                        where: { id }
                    })
            })
            .then((data) => {
                let arr = getUserId(data.Courses[0])
                console.log(data.Courses)
                res.render('./users/courseList', {id, arr, data, imageUrl, fullName, formatDate, formatRupiah })
            })
            .catch((err) => {
                console.log(err);
                res.send(err)
            })
    }

    static allCourse(req, res){
        let imageUrl
        let fullName
        const {search} = req.query
        let option = {
            where:{}
        }
        if(search){
            option.where={
                name: {
                    [Op.iLike]: `%${search}%`
                }
            }
        }
        Course.findAll(option)
        .then(function(data){
            imageUrl = req.session.imageUrl
            fullName = req.session.fullName
            res.render('users/showAllCourse', {data, formatRupiah, formatDate, imageUrl, fullName})
        })
        .catch(function(err){
            res.send(err)
        })
    }

    // static courseList(req, res) {
    //     const id = req.params.categoryId
    //     Course.findAll({
    //         include: Category
    //     }, {
    //         where: {
    //             id: id
    //         }
    //     })
    //         .then((data) => {
    //             res.render('./users/courseList', { data })
    //         })
    //         .catch((err) => {
    //             res.send(err)
    //         })
    // }

    static buy(req, res) {

        const { courseId } = req.params
        const { userId, email } = req.session
        let result
        Course.findOne({
            where: { id: courseId },
            include: {
                model: UsersCourse
            }
        })
            .then(function (data) {
                result = data
                return UsersCourse.create({ UserId: userId, CourseId: courseId })
            })
            .then((data) => {
                console.log(result.UsersCourses);
                nodeMailer(email, result.name)
                
                console.log(arr);
                res.redirect('/users')
                // res.render('',{data})
            })
            .catch((err) => {
                // console.log(courseId, id,"<<<<<<<<<<<<<<<<<");
                console.log(err);
                res.send(err)
            })
    }

    static profile(req, res) {
        let imageUrl
        let fullName
        const id = req.session.userId
        User.findOne({
            include: [
                {
                    model: UsersCourse,
                    include: { model: Course }
                },
                {
                    model: Profile
                }
                
            ],
            where: {
                id
            }
            
        })
        .then((data)=>{
            imageUrl = req.session.imageUrl
            fullName = req.session.fullName
            // console.log(data.UsersCourses);
            console.log(data.Profile);
            res.render('users/profile',{data})
        })
        .catch((err)=>{
            console.log(err);
            res.send(err)
        })
    }

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