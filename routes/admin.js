const express = require('express')
const Controller = require('../controllers/adminController')
const app = express.Router()

app.get('/', Controller.showCourse)

app.get('/category', Controller.showCategory)
app.get('/category/:categoryId', Controller.showCategoryById)

app.get('/add-course', Controller.formAddCourse)
app.post('/add-course', Controller.postAddCourse)

app.get('/add-category', Controller.renderAddCategory)
app.post('/add-category', Controller.postAddCategory)

app.get('/:id/edit', Controller.formEditCourse)
app.post('/:id/edit', Controller.postEditCourse)

app.get('/:id/delete', Controller.deleteCourse)


module.exports = app