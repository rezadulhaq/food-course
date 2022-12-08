const express = require('express')
const Controller = require('../controllers/adminController')
const app = express.Router()
const admin = require('./admin')
const user = require('./user')

app.get('/', Controller.showCourse)
app.use('/admin', admin)
app.use('/user', user)

module.exports = app