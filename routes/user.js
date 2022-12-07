const express = require('express')
const Controller = require('../controllers/controller')
const app = express.Router()

app.get('/', Controller.showCourse)

module.exports = app