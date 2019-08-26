/**
 *
 *  "Register" route
 *
 */

const { Router } = require('express')
const registerRoute = Router()


const userQuerys = require('../db/userQuerys')

const bcrypt = require('bcrypt');
const saltRounds = 10; // increase the number to make the brutforcing harder

const time = require('../public/js/timeHandling')
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
    let realName = req.body['registerRealName']
    let email = req.body['registerEmail']
    let password = req.body['registerPassword']
    let confirmPassword = req.body['registerConfirmPassword']

    req.checkBody('registerEmail', 'Please enter a valid email').isEmail();

    const testUser = userQuerys.testIfUserInDb(username)
    const testEmail = userQuerys.testIfEmailInDb(email)

    console.log('userTest : ' + testUser + ' | emailTest : ' + testEmail)

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
    } else if (testUser !== undefined && testEmail !== undefined) {
        res.render('register.ejs',
            {
                registerFailMsg: "username and email already exist"
            })
    } else if (testEmail !== undefined) {
        res.render("register.ejs",
            {
                registerFailMsg: "email already exists"
            })
    } else if (testUser !== undefined) {
        res.render("register.ejs",
            {
                registerFailMsg: "username already exists"
            })
    } else {
        const timestamp = time.newTime()
        const role = 4 //   membre
        const status = 1 // ok
        userQuerys.register(username, realName, email, bcrypt.hashSync(password, saltRounds), timestamp, role, status)
            .then(result => {
                console.log('result from register : ' + result)
                res.redirect('/login')   
            })
            .catch(e => console.error(e.stack))
    }
})

module.exports = registerRoute