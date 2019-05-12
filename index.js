
const path = require('path')
const express = require('express')
const expressValidator = require('express-validator')
const session = require('cookie-session')
const bodyParser = require('body-parser')
const mongo = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'//db' //27017 default port

let app = express()

app.use(express.static('public'))
app.use(express.static('bower_components'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
  secret: 'jaimelescookies'
}))

app.use(expressValidator())

const users = require('./users.json').users;

let checkLogin = 1; // check if login is successful or not, if not display message about the failed login attempt
let registerCheck = 1;
///////////////////////////
//  a changer
///////////////////////////
function auth(username, password) { // auth function
  let ok = false;
  for (let u of users) {
    // CHANGE WITH USERNAME
    if (u.username === username && u.password === password) {  // simplifie to remove let ok = ...
      ok = true
      break;
    }
  }
  return ok
}

function register(email, password) { // register function
  // wip
}
////////////////////
////////////////////
app.get('/', (req, res) => {
  res.redirect('/login')
})

app.get('/login', (req, res) => {
  //backURL=req.header('Referer') || '/';
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
  //res.redirect(backURL);
});

app.get('/register', (req, res) => {
  // new page to handle register post, should be easier and more readable
  // or we can differentiate names and all on the same page: registreEmail =/= loginMail
  if (req.session.user)
  {
    res.redirect('/home');
  } else if (registerCheck === 0)
  {
    res.render('register.ejs', {
      registerFailMsg: "Email or password do not match"
    })
  } else {
    res.render('register.ejs', {
      registerFailMsg: ""
    });
  }
})

app.get('/home', (req, res) => {
  if (req.session.user) {
    res.render('home.ejs', {msg: req.session.user.username})
  } else {
    res.redirect('/login')
  }
})

app.get('/logout', (req, res) => {
  req.session = null
  res.redirect('/login')
})

app.get("/profile", (req, res) => {
  if (req.session.user) {
    res.render('profile.ejs', {msg: req.session.user.username})
  } else {
    res.redirect('/login')
  }
})


app.post('/login', (req, res) => {

  console.log(req.body)

  let username = req.body['loginUsername']
  let password = req.body['loginPassword']

  req.checkBody('loginUsername', 'Username is required').notEmpty();
  //req.checkBody('loginEmail', 'Please enter a valid email').isEmail();

  const errors = req.validationErrors()
  const check = auth(username, password) // ##

  console.log(errors)

  if(errors) 
  {
    checkLogin = 0;
    req.session.errors = errors;
    res.redirect('/login');
  } else if (!check) 
  {
    req.session.errors = [{msg: 'invalid username or password'}]
    checkLogin = 0;
    res.redirect('/login')
  } else
  {
    req.session.user = {
      'username': username
  }

    res.redirect('/home')
  }

})
/*
app.post('/register', (req, res) => {
  console.log(req.body)
  let username = req.body['registerUsername']
  let email = req.body['registerEmail']
  let confirmEmail = req.body['registerConfirmEmail']
  let password = req.body['registerPassword']
  let confirmPassword = req.body['registerConfirmPassword']
  let hashedPassword =
  let hashedConfirmPassword =

  if((email !== confirmEmail) or (hashedPassword !== hashedConfirmPassword))
  {
    registerCheck += 1;
    res.redirect('/register');
  } else
  {
    // make a ajavscript object Json.parse
    // send email, username, pass to db
  }
  
  // wip
})
same page or different page??
*/

app.get('/test', (req, res) => {
  if (req.session.user) {
    res.render('test.ejs', {msg: req.session.user.username})
  } else {
    res.redirect('/login')
  }
})

// app.use(function(req, res, next) {
//   res.status(404).render("404.ejs", {reqUrl: req.url});
// })

app.get('*', (req, res) => {
  res.status(404).render('404.ejs', {reqUrl: req.url})
})

app.listen(8080, () => {
  console.log('Listening on port 8080')
})
