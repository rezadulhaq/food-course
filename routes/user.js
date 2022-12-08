const express = require('express')
const Controller = require('../controllers/usersController')
const app = express.Router()

app.use((req,res,next) => {
    if(req.session.role === false) {
        next()
    } else if(req.session.role === true) {
        res.redirect('/')
    }
})

app.get('/', Controller.home) // home
app.get('/course', Controller.allCourse)
// app.get('/category', Controller.categoryList) //to category page
app.get('/category/:categoryId', Controller.courseList) //to courses list by category
// app.get('/category/courses/:courseId/buy', Controller.buy) //for buying course
app.get('/profile', Controller.profile) //to user profile page
app.get('/profile/edit/:profileId', Controller.editProfileForm) // to form edit profile page
app.post('/profile/edit/:profileId', Controller.editProfile) // update database user
app.get('/profile/:courseId/delete', Controller.deleteCourse) //for delete course in profile page

app.get('/:courseId/buy', Controller.buy)
module.exports = app