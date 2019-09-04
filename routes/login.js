/**
 *
 *  "Login" route
 *
 */


const { Router } = require('express')
const loginRoute = Router()

const userQuery = require('../db/userQuerys')
const bcrypt    = require('bcrypt')
const passport  = require('passport')


loginRoute.get('/', (req, res) => {
    if (req.session) {
        res.redirect('/home')
    } else {
        res.render('login.ejs', { errorMsg: ''})
    }
})

/////////////////  ERRORS FROM POST TO GET ////////////////

loginRoute.post('/', (req, res) => {

    let username = req.body.loginUsername;
    let password = req.body.loginPassword;

    const errorResponse = 'invalid username or password'

    req.checkBody('loginUsername', 'Username is required').notEmpty();
    // req.checkBody('loginEmail', 'Please enter a valid email').isEmail();

    const errors = req.validationErrors()

    userQuery.getUserByUsername(username)
    .then(credentials => {
        if (error) {
            res.render(login, {errorMsg : errorResponse })
        } else {
            passport.authenticate('local', {
                'failureRedirect' : '/login'
            })(req, res)
        }
    })
    .catch(e => {
        console.error(e.stack)
        res.render(login, {errorMsg : "server side error"})
    })
    
})


module.exports = loginRoute