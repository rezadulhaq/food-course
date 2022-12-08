const express = require('express')
const Controller = require('../controllers/usersController')
const app = express.Router()

app.get('/', Controller.home) // home
// app.get('/category', Controller.categoryList) //to category page
// app.get('/category/courses/:categoryId', Controller.courseList) //to courses list by category
// app.get('/category/courses/:courseId/buy', Controller.buy) //for buying course
// app.get('/profile', Controller.profile) //to user profile page
// app.get('/profile/edit', Controller.editProfileForm) // to form edit profile page
// app.post('/profile/edit', Controller.editProfile) // update database user
// app.get('/profile/:courseId/delete', Controller.deleteCourse) //for delete course in profile page

app.get('/:courseId/buy', Controller.buy)
module.exports = app