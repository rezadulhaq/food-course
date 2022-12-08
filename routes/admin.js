const express = require('express')
const Controller = require('../controllers/adminController')
const app = express.Router()

app.get('/', Controller.showCourse)

app.get('/add-course', Controller.formAddCourse)
app.post('/add-course', Controller.postAddCourse)

app.get('/add-category')
app.post('/add-category')

module.exports = app