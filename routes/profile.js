const router = require('express').Router()
const userQuery = require('../public/js/userQuerys')
const bcrypt = require('bcrypt');

/* GET profile page */
router.get('/', (req, res) => {
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

/* POST profile page */

router.post('/', async (req, res) => {
    if (req.session.user) {
    } else {
        res.redirect('/');
    }
    let newUsername = req.body['changeUsername'];
    let newEmail = req.body['changeEmail'];
    let newPassword = req.body['changePassword'];
    let confirmPassword = req.body['ConfirmChangePassword'];
    // users
    let dbPass = await userQuery.login(req.session.user.username);
    // chek if username or email already exists in db
    const testUsername = await userQuery.testIfUserInDb(newUsername);
    const testEmail = await userQuery.testIfEmailInDb(newEmail);
    if (testUsername !== null) {
        // nope user already used
    } else if (testEmail !== null) {
        // nope email already used
    }
    if (bcrypt.compareSync(confirmPassword, dbPass.hashedPassword)) {
        await userQuery.updateUser(req.session.user.username, newUsername, newEmail, newPassword)
        res.redirect('/logout');
    } else {
        res.render('profile.ejs', {
            username: req.session.user.username,
            email: req.session.user.email,
            error: "incorrect password",
            page: 'profile',
        })
    }
    // check empty fields
})

module.exports = router