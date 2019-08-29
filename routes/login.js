/**
 *
 *  "Login" route
 *
 */


const { Router } = require('express')
const loginRoute = Router()

const userQuery = require('../db/userQuerys')
/* GET login page */

const bcrypt = require('bcrypt');

// aie aie aie 
let checkLogin = 1;
// check if login is successful or not, if not display message about the failed login attempt

loginRoute.get('/', function (req, res) {

    if (!req.session) res.redirect('/home')
    
    res.render('login.ejs', {
        errorMsg: ''
    })
})

/////////////////  ERRORS FROM POST TO GET ////////////////

loginRoute.post('/',function (req, res) {

    let username = req.body.loginUsername;
    let password = req.body.loginPassword;

    const errorResponse = 'invalid username or password'

    req.checkBody('loginUsername', 'Username is required').notEmpty();
    //req.checkBody('loginEmail', 'Please enter a valid email').isEmail();

    const errors = req.validationErrors();

    userQuery.getUserByUsername(username).then(credentials => {


        if (errors) {
            
            res.render('login.ejs', {
                errorMsg: errors
            });

        } else if (!credentials.rows[0]) { // if user not in database

            res.render('login.ejs', {
                errorMsg: errorResponse
            });

        } else if (credentials.rows[0].username === username && bcrypt.compareSync(password, credentials.rows[0].password)) {

            console.log

            // test password
            req.session.user = {
                'username': username,
                'email': credentials.rows[0].email,
                'user_id': credentials.rows[0].user_id
            };

            checkLogin = 1;
            res.redirect('/home');

        } else {    // handle errors that i haven't thougt about

            console.log("here")
            res.render('login.ejs', {
                errorMsg: errorResponse
            });

        }
    }).catch(e => console.error(e.stack))
    
})


module.exports = loginRoute