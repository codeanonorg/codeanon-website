
const path = require('path')
const express = require('express')
const expressValidator = require('express-validator')
const session = require('cookie-session')
const bodyParser = require('body-parser')

let app = express()

app.use(express.static('public'))
app.use(express.static('bower_components'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use(session({
  secret: 'jaimelescookies'
}))

app.use(expressValidator())

const users = require('./users.json').users;

function auth(email, password) {
  let ok = false;
  for (let u of users) {
    if (u.email === email && u.password === password) {
      ok = true
      break;
    }
  }
  return ok
}


app.get('/', (req, res) => {
  //res.redirect('/login')
  //backURL=req.header('Referer') || '/';
  if (req.session.user) {
    res.redirect("/home");
  } else {
    res.redirect('/login');
  }
})
app.get('/login', (req, res) =>{
  //backURL=req.header('Referer') || '/';
  if (req.session.user) {
    res.redirect('/home');
  } else {
    res.render('login.ejs', {errors: req.session.errors});
  }
  //res.redirect(backURL);
});
/*
app.get('/login', (req, res) => {

  //send user back to last page if already loged in
  if (req.session.user) {
    res.redirect('back');
  } else {
    res.render('login.ejs', {errors: req.session.errors});
  }
  //res.render('login.ejs', {errors: req.session.errors})
})*/

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

  let email = req.body['email']
  let password = req.body['password']

  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Please enter a valid email').isEmail();

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

app.use(function(req, res, next) {

  //res.render("404.ejs", {reqUrl: req.url})


  res.status(404).render("404.ejs", {reqUrl: req.url});

})

app.listen(8080, () => {
  console.log('Listening on port 8080')
})
