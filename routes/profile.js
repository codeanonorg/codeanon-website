/**
 *
 *  "Profile" route
 *
 */

const { Router } = require('express')
const profileRoute = Router()

const userQuery = require('../db/userQuerys')

const bcrypt = require('bcrypt');

const time = require('../public/js/timeHandling')

profileRoute.get('/', function (req, res) {
    if (req.session.user) {
        res.render('profile.ejs', {
            username: req.session.user.username,
            email: req.session.user.email,
            error: "",
            page: 'Profile',
        })
    } else {
        res.redirect('/')
    }
})

profileRoute.post('/', function (req, res) {

    if (!req.session.user) res.redirect('/');

    let newUsername = req.body['changeUsername'];
    let newEmail = req.body['changeEmail'];
    let newPassword = req.body['changePassword'];
    let confirmPassword = req.body['ConfirmChangePassword'];
    let newRealName = req.body['changeRealName']

    // users
    let checker = 0

    userQuery
        .getUserByUsername(req.session.user.username)
        .then(userResponse => {
            console.log('password: ' + JSON.stringify(userResponse.password))

            if (bcrypt.compareSync(confirmPassword, userResponse.password)) checker += 1;
            console.log('checker pass: ' + checker)

            return userQuery.testIfUserInDb(newUsername)
        })
        .then(queryResponse => {
            console.log('user check ' + JSON.stringify(queryResponse))

            if (queryResponse.rows[0] === undefined) checker += 1;
            console.log('checker user check: ' + checker)

            return userQuery.testIfEmailInDb(newEmail)
        })
        .then(queryResponse => {
            console.log('email check  ' + JSON.stringify(queryResponse.rows[0]))

            if (queryResponse.rows[0] === undefined) checker += 1;
            console.log('checker email check: ' + checker)

        })
        .catch(e => {
            console.log('error')
            console.error(e)
            res.render('profile.ejs', {
                username: req.session.user.username,
                email: req.session.user.email,
                error: "Try again ...",
                page: 'Profile',
            })
        })
        .then(queryResponse => {
            console.log('checker : ' + checker)

            if (checker === 3) {
                const updateTimestamp = time.newTime()
                return userQuery.updateUser(newUsername, newRealName, newEmail, newPassword, updateTimestamp, req.session.user.username)
            }
        })
        .then(queryResponse => {
            console.log('modified correctly : ' + JSON.stringify(queryResponse))

            res.redirect('/logout')
        })
        .catch(e => console.error(e.stack))
})

profileRoute.get('/:userId', (req, res) => {
    res.send('ok profile ' + req.params.userId)
})

profileRoute.get('/:userId/delete', (req, res) => {
    res.send('delete profile ' + req.params.userId + ' page')
})

profileRoute.get('/:userId/kick', (req, res) => {
    res.send('kick profile ' + req.params.userId + ' page')
})

profileRoute.get('/:userId/ban', (req, res) => {
    res.send('ban profile ' + req.params.userId + ' page')
})
module.exports = profileRoute