/**
 *
 *  "Profile" route
 *
 */

const { Router } = require('express')
const profileRoute = Router()



const userQuery = require('../db/userQuerys')

const bcrypt = require('bcrypt');


profileRoute.get('/', function (req, res) {
    if (req.session.user) {
        res.render('profile.ejs', {
            username: req.session.user.username,
            email: req.session.user.email,
            error: "",
            page: 'profile',
        })
    } else {
        res.redirect('/')
    }
})

profileRoute.post('/', function (req, res) {
    if (req.session.user) {
    } else {
        res.redirect('/');
    }
    let newUsername = req.body['changeUsername'];
    let newEmail = req.body['changeEmail'];
    let newPassword = req.body['changePassword'];
    let confirmPassword = req.body['ConfirmChangePassword'];
    // users
    let dbPass = userQuery.login(req.session.user.username);
    // chek if username or email already exists in db
    const testUsername = userQuery.testIfUserInDb(newUsername);
    const testEmail = userQuery.testIfEmailInDb(newEmail);
    if (testUsername !== null) {
        // nope user already used
    } else if (testEmail !== null) {
        // nope email already used
    }
    if (bcrypt.compareSync(confirmPassword, dbPass.hashedPassword)) {
        userQuery.updateUser(req.session.user.username, newUsername, newEmail, newPassword)
        res.redirect('/logout');
    } else {
        res.render('profile.ejs', {
            username: req.session.user.username,
            email: req.session.user.email,
            error: "incorrect password",
            page: 'profile',
        })
    }
})

module.exports = profileRoute