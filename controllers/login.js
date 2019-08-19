const userQuery = require('../public/js/userQuerys')

const bcrypt = require('bcrypt');
const saltRounds = 10; // increase the number to make the brutforcing harder

// aie aie aie 
let checkLogin = 1;
// check if login is successful or not, if not display message about the failed login attempt

exports.get = async function (req, res) {
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
}

/////////////////  ERORS FROM POST TO GET ////////////////
exports.post = async function (req, res) {
    let username = req.body['loginUsername'];
    let password = req.body['loginPassword'];
    //const hashedPass = await hashIt(password)

    req.checkBody('loginUsername', 'Username is required').notEmpty();
    //req.checkBody('loginEmail', 'Please enter a valid email').isEmail();

    const errors = req.validationErrors();
    const credentials = await userQuery.login(username)
    // get the user datas if user exist, else return 'null'
    if (errors) {
        checkLogin = 0;
        req.session.errors = errors;
        res.redirect('/login');
    } else if (credentials === null) { // if user not in database
        req.session.errors = [{ errorMsg: 'invalid username or password' }];
        checkLogin = 0;
        res.redirect('/login');
    } else if (credentials.username === username && bcrypt.compareSync(password, credentials.hashedPassword)) // test password
    {
        req.session.user = {
            'username': username,
            'email': credentials.email,
        };
        checkLogin = 1;
        res.redirect('/home');
    } else {    // handle errors that i haven't thougt about
        req.session.errors = [{ errorMsg: 'invalid username or password' }];
        checkLogin = 0;
        res.redirect('/login');
    }
}