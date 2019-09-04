/**
 *
 *  "Login" route
 *
 */


const { Router } = require('express')
const loginRoute = Router()

const userQuery = require('../db/userQuerys')
const bcrypt = require('bcrypt');

loginRoute.get('/', function (req, res) {

    if (req.session.user) {
        res.redirect('/home')
    } else {
        res.render('login.ejs', { errorMsg: '' })
    }
    
})

/////////////////  ERRORS FROM POST TO GET ////////////////

loginRoute.post('/', function (req, res) {

    let username = req.body.loginUsername;
    let password = req.body.loginPassword;

    const errorResponse = 'invalid username or password'

    userQuery.getUserByUsername(username)

        .then(credentials => {

            if (bcrypt.compareSync(password, credentials.password)) {

                req.session.user = {
                    'username': username,
                    'email': credentials.email,
                    'user_id': credentials.user_id
                };
                res.redirect('/home')

            } else {
                // handle errors that i haven't thougt about
                throw errorResponse
            }
        })
        .catch(e => {
            console.error(e)
            res.render('login.ejs', { errorMsg : errorResponse })
        })
})


module.exports = loginRoute