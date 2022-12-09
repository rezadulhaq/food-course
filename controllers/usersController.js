const { Category, Course, Profile, User, UsersCourse } = require("../models")
const { Op } = require("sequelize")
const { fn } = require("sequelize")
const bcryptjs = require("bcryptjs")
const formatDate = require('../helpers/formatDate')
const formatRupiah = require('../helpers/formatRupiah')
const nodeMailer = require('../helpers/nodemailer')
const getUserId = require('../helpers/getUserId')

class Controller {

    static registerForm(req, res) {
        let { errors } = req.query
        res.render('./users/registerForm', { errors })
    }
    static register(req, res) {
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
                if (err.name === "SequelizeValidationError") {
                    let dataErr = err.errors.map(function (el) {
                        return el.message
                    })
                    res.redirect(`/register?errors=${dataErr}`)
                }
                else {
                    res.send(err)
                }
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

    static home(req, res) {
        const id = req.session.userId
        let imageUrl
        let fullName
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
                return Category.findAll()
            })
            .then(function (data) {
                res.render('./users/home', { data, imageUrl, fullName, formatDate, formatRupiah })
            })
            .catch((err) => {
                res.send(err)
            })
    }

    static courseList(req, res) {
        const { categoryId } = req.params
        const id = req.session.userId

        let imageUrl
        let fullName
        User.findByPk(id, {
            include: {
                model: Profile
            }
        })
            .then(function (data) {
                imageUrl = req.session.imageUrl
                fullName = req.session.fullName
                return Category.findOne({
                    where: { id: categoryId },
                    include: [
                        {
                            model: Course,
                            include: { model: UsersCourse }
                        }
                    ]
                })
            })
            .then((data) => {
                let arr = []
                if (data.Courses.length !== 0) {
                    arr = getUserId(data.Courses[0])
                }
                res.render('./users/courseList', { id, arr, data, imageUrl, fullName, formatDate, formatRupiah })
            })
            .catch((err) => {
                res.send(err)
            })
    }

    static allCourse(req, res) {
        let imageUrl
        let fullName
        const { search } = req.query
        let option = {
            where: {}
        }
        if (search) {
            option.where = {
                name: {
                    [Op.iLike]: `%${search}%`
                }
            }
        }
        Course.findAll(option)
            .then(function (data) {
                imageUrl = req.session.imageUrl
                fullName = req.session.fullName
                res.render('users/showAllCourse', { data, formatRupiah, formatDate, imageUrl, fullName })
            })
            .catch(function (err) {
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
                nodeMailer(email, result.name)
                res.redirect(`/users/category/${result.CategoryId}`)
                // res.render('',{data})
            })
            .catch((err) => {
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
            .then((data) => {
                imageUrl = req.session.imageUrl
                fullName = req.session.fullName
                let name = Profile.addGender(data.Profile)
                res.render('users/profile', { data, name, imageUrl, fullName })
            })
            .catch((err) => {
                res.send(err)
            })
    }

    static editProfileForm(req, res) {
        let { errors } = req.query
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
            .then((data) => {
                res.render('./users/editProfileForm', { data, errors })
            })
            .catch((err) => {
                res.send(err)
            })
    }
    static editProfile(req, res) {
        let userId = req.session.userId
        const UserId = userId
        let ProfileId
        const { fullName, email, password, age, imageUrl, gender } = req.body
        Profile.findOne({
            where: {
                UserId: UserId
            }
        })
            .then(function (data) {
                ProfileId = data.id
                return Profile.update({ fullName, age, imageUrl, gender }, { where: { UserId } })
            })
            .then((_) => {
                let salt = bcryptjs.genSaltSync(10);
                let hash = bcryptjs.hashSync(password, salt);

                let newPassword = hash
                return User.update({ email, password: newPassword }, { where: { id: userId } })
            })
            .then((_) => {
                res.redirect('/users/profile')
            })
            .catch((err) => {
                if (err.name === "SequelizeValidationError") {
                    let dataErr = err.errors.map(function (el) {
                        return el.message
                    })
                    res.redirect(`/users/profile/edit/${ProfileId}?errors=${dataErr}`)
                }
                else {
                    res.send(err)
                }
            })
    }

    static deleteCourse(req, res) {
        const CoursId = +req.params.courseId
        UsersCourse.destroy({ where: { CourseId: CoursId } })
            .then((_) => {
                res.redirect('/users/profile')
            })
            .catch((err) => {
                res.send(err)
            })
    }

}
module.exports = Controller