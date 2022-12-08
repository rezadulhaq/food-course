const Controller = require('../controllers/usersController')
const app = require('express').Router()
const admin = require('./admin')
const user = require('./user')


app.get("/register", Controller.registerForm)
app.post("/register", Controller.register)

app.get("/", Controller.loginForm)
app.post("/", Controller.login)

app.get("/logout", Controller.logout)

app.use((req,res,next) => {
    if(req.session.userId) {
        next()
    } else if(!req.session.userId) {
        res.redirect('/')
    }
})
app.use('/admin', admin)
app.use('/users', user)

module.exports = app