const router = require('express').Router()
const userQuery = require('../public/js/userQuerys')
const bcrypt = require('bcrypt');
const saltRounds = 10; // increase the number to make the brutforcing harder



let registerCheck = 1;

/* GET login page */

router.get('/', (req, res) => {
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

/* POST login page */

router.post('/', async (req, res) => {
    
    let username = req.body['registerUsername']
    let email = req.body['registerEmail']
    let confirmEmail = req.body['registerConfirmEmail']
    let password = req.body['registerPassword']
    let confirmPassword = req.body['registerConfirmPassword']

    req.checkBody('registerEmail', 'Please enter a valid email').isEmail();

    const testUser = await userQuery.testIfUserInDb(username)
    const testEmail = await userQuery.testIfEmailInDb(email)

    if ((username === null) || (email === null) || (confirmEmail === null) || (password === null) || (confirmPassword === null)) {
        res.render('register.ejs',
            {
                registerFailMsg: 'please fill all fields'
            })
    } else if (email !== confirmEmail) {
        res.render('register.ejs',
            {
                registerFailMsg: "email and confirm email are not the same"
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
        await userQuery.register(username, email, bcrypt.hashSync(password, saltRounds))
        res.redirect('/login');
    }
})

module.exports = router