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
    let username    = req.body['registerUsername']
    let realName    = req.body['registerRealName']
    let email       = req.body['registerEmail']
    let password    = req.body['registerPassword']
    let confirmPassword = req.body['registerConfirmPassword']

    req.checkBody('registerEmail', 'Please enter a valid email').isEmail();

    userQuerys.testIfUserInDb(username)
        
        // test if USERNAME is availiable
        .then( () => {
            console.log(`user test : ${username}`)
            return userQuerys.testIfEmailInDb(email)
        })
        
        // if email is valid
        .then( () => {
            console.log(`email test : ${email}`)
            
            if ((username === null) || (email === null) ||(password === null) || (confirmPassword === null)) {
                throw 'please fill all fields'
            } else if (password !== confirmPassword) {
                throw 'password are not the same'
            }
        })

        // form is valid
        .then( () => {
            const timestamp = time.newTime()
            const role = 4 //   membre
            const status = 1 // ok

            // registering new user
            return userQuerys.register(username, realName, email, bcrypt.hashSync(password, saltRounds), timestamp, role, status)
        })
        
        // everything went ok
        .then(result => {
            console.log('result from register : ' + result)
            res.redirect('/login')
        })
        
        // error during registration
        .catch( error => {
            res.render("register.ejs", {
                registerFailMsg: error
            })
        })
})

module.exports = registerRoute