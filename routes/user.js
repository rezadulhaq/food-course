const express = require('express')
const Controller = require('../controllers/adminController')
const app = express.Router()

app.get('/', Controller.showCourse)

module.exports = app