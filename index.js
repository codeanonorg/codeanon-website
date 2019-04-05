
const path = require('path')
const express = require('express')
const expressValidator = require('express-validator')
const session = require('cookie-session')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

//mongoose.connect("mongodb://localhost:port/nom_base_donnée")

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

function auth(email, password) { // auth function
  let ok = false;
  for (let u of users) {
    if (u.email === email && u.password === password) {
      ok = true
      break;
    }
  }
  return ok
}

function register(email, password) { // register function
  // wip
}

app.get('/', (req, res) => {
  res.redirect('/login')
})

app.get('/login', (req, res) => {
  //backURL=req.header('Referer') || '/';
  if (req.session.user) {
    res.redirect('/home')
  } else {
    res.render('login.ejs', {errors: req.session.errors});
  }
  //res.redirect(backURL);
});

app.get('/register', (req, res) => {
  // new page to handle register post, should be easier and more readable
  // or we can differentiate names and all on the same page: registreEmail =/= loginMail
  if (req.user.session) {
    res.redirect('/home')
  } else {
    res.render('register.ejs', {errors: req.session.errors})
  }
})

app.get('/home', (req, res) => {
  if (req.session.user) {
    res.render('home.ejs', {msg: req.session.user.email})
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
    res.render('profile.ejs', {msg: req.session.user.email})
  } else {
    res.redirect('/login')
  }
})


app.post('/login', (req, res) => {

  console.log(req.body)

  let email = req.body['loginEmail']
  let password = req.body['loginPassword']

  req.checkBody('loginEmail', 'Email is required').notEmpty();
  req.checkBody('loginEmail', 'Please enter a valid email').isEmail();

  const errors = req.validationErrors()
  const check = auth(email, password)

  if(errors) {
    req.session.errors = errors;
    res.redirect('/login');
  } else if (!check) {
    req.session.errors = [{msg: 'invalid username or password'}]
    res.redirect('/login')
  } else {
    req.session.user = {
      'email': email
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
  // wip
})
same page or different page??
*/

app.get('/test', (req, res) => {
  if (req.session.user) {
    res.render('test.ejs', {msg: req.session.user.email})
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
