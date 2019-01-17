
const express = require('express')
const session = require('cookie-session')
const path = require('path')
const bodyParser = require('body-parser')

let app = express()

app.use(express.static('public'))
app.use(express.static('bower_components'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use(session({
  secret: 'jaimelescookies'
}))

const users = require('./users.json').users

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
  res.redirect('/login')
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/login.html'));
})

app.get('/profile', (req, res) => {
  if (req.session.user && req.session.) {
    res.render('profile.ejs', {msg: req.session.user.email})
  } else {
    res.redirect('/login')
  }
})

app.get('/logout', (req, res) => {
  req.session = null
  res.send('Bye !')
})

app.post('/login', (req, res) => {
  
  console.log(req.body)

  let email = req.body['email']
  let password = req.body['password']

  if (auth(email, password)) {
    
    req.session.user = {
      'email': email
    }

    res.redirect('/profile')
    
  } else {
    res.redirect('/login')
  }
})

app.listen(8080, () => {
  console.log('Listening on port 8080')
})
