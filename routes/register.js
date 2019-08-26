/**
 *
 *  "Register" route
 *
 */

const { Router } = require('express')
const registerRoute = Router()


const userQuerys = require('../public/js/userQuerys')

const bcrypt = require('bcrypt');
const saltRounds = 10; // increase the number to make the brutforcing harder

// ca doit dégager viteuf par contre ca
let registerCheck = 1;


registerRoute.get('/', function (req, res) {
    if (req.session.user) {
        res.redirect('/home');
    } else if (registerCheck === 0) {
        res.render('register.ejs', {
            registerFailMsg: "Email or password do not match"
        })
    } else {
        res.render('register.ejs', {
            registerFailMsg: ""
        });
    }
})

registerRoute.post('/', function (req, res) {
    let username = req.body['registerUsername']
    let email = req.body['registerEmail']
    let password = req.body['registerPassword']
    let confirmPassword = req.body['registerConfirmPassword']

    req.checkBody('registerEmail', 'Please enter a valid email').isEmail();

    const testUser = userQuerys.testIfUserInDb(username)
    const testEmail = userQuerys.testIfEmailInDb(email)

    if ((username === null) || (email === null) ||(password === null) || (confirmPassword === null)) {
        res.render('register.ejs',
            {
                registerFailMsg: 'please fill all fields'
            })
    } else if (password !== confirmPassword) {
        res.render('register.ejs',
            {
                registerFailMsg: "password are not the same"
            })
    } else if (testUser !== null && testEmail !== null) {
        res.render('register.ejs',
            {
                registerFailMsg: "username and email already exist"
            })
    } else if (testEmail !== null) {
        res.render("register.ejs",
            {
                registerFailMsg: "email already exists"
            })
    } else if (testUser !== null) {
        res.render("register.ejs",
            {
                registerFailMsg: "username already exists"
            })
    } else {
        userQuerys.register(username, email, bcrypt.hashSync(password, saltRounds))
        res.redirect('/login');
    }
})

module.exports = registerRoute