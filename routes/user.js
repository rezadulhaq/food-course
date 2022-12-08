const express = require('express')
const Controller = require('../controllers/usersController')
const app = express.Router()

app.get('/', Controller.home) // home
// app.get('/:userId/category', Controller.categoryList) //to category page
// app.get('/:userId/category/courses/:categoryId', Controller.courseList) //to courses list by category
// app.get('/:userId/category/courses/:courseId/:userId/buy', Controller.buy) //for buying course
// app.get('/:userId/profile', Controller.profile) //to user profile page
// app.get('/:userId/profile/edit', Controller.editProfileForm) // to form edit profile page
// app.post('/:userId/profile/:userId/edit', Controller.editProfile) // update database user
// app.get('/:userId/profile/:courseId/delete', Controller.deleteCourse) //for delete course in profile page
module.exports = app