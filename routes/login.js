/**
 *
 *  "Login" route
 *
 */


const { Router } = require('express')
const loginRoute = Router()

const userQuery = require('../public/js/userQuerys')
/* GET login page */

const bcrypt = require('bcrypt');

// aie aie aie 
let checkLogin = 1;
// check if login is successful or not, if not display message about the failed login attempt

loginRoute.get(async function (req, res) {
    if (req.session.user) {
        res.redirect('/home')
    } else {
        if (checkLogin === 0) {
            res.render('login.ejs', {
                errorMsg: "invalid username or password",
                errors: req.session.errors
            })
        } else {
            res.render('login.ejs', {
                errors: req.session.errors,
                errorMsg: ""
            });
        }
    }
})

/////////////////  ERRORS FROM POST TO GET ////////////////

loginRoute.post(function (req, res) {

    let username = req.body['loginUsername'];
    let password = req.body['loginPassword'];

    req.checkBody('loginUsername', 'Username is required').notEmpty();
    //req.checkBody('loginEmail', 'Please enter a valid email').isEmail();

    const errors = req.validationErrors();
    //promise

    userQuery.login(username).then(credentials => {

        console.log(`*** TEST *** ${0}`, credentials.rows[0].real_name)

        if (errors) {
            checkLogin = 0;
            req.session.errors = errors;
            res.redirect('/login');
        } else if (credentials === null) { // if user not in database
            req.session.errors = [{ errorMsg: 'invalid username or password' }];
            checkLogin = 0;
            res.redirect('/login');
        } else if (credentials.rows[0].username === username && bcrypt.compareSync(password, credentials.rows[0].password)) // test password
        {
            req.session.user = {
                'username': username,
                'email': credentials.rows[0].email,
            };
            checkLogin = 1;
            res.redirect('/home');
        } else {    // handle errors that i haven't thougt about
            req.session.errors = [{ errorMsg: 'invalid username or password' }];
            checkLogin = 0;
            res.redirect('/login');
        }
    }).catch(e => console.error(e.stack))
    
})



module.exports = loginRoute

