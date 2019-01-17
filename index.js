
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const SHA256 = require("crypto-js/sha256")

let app = express()

app.use(express.static('public'))
app.use(express.static('bower_components'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

const users = require('./users.json').users

let pendingToken = []

function generateTokenFor(user) {
  const n = SHA256(Date.now()).toString()
  const token = `${SHA256(user).toString()}${n}`
  pendingToken.push(token)
  return token
}

function disableToken(t) {
  for (let i=0; i < pendingToken.length; i++) {
    if (pendingToken[i] === t) {
      pendingToken.splice(i, 1)
      break;
    }
  }
}

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
   res.sendFile(path.join(__dirname + '/public/login.html'));
})

app.get('/profile/:token', (req, res) => {
  if (pendingToken.includes(req.params.token)) {
    disableToken(req.params.token)
    res.render('profile.ejs', {msg: req.params.token})
  } else {
    console.log("error profile")
  }
})

app.post('/', (req, res) => {
  console.log(req.body)

  let email = req.body['email']
  let password = req.body['password']

  if (auth(email, password)) {
    let t = generateTokenFor()
    res.redirect(`/profile/${t}`)
    res.end()
  } else {
    console.log('error pass')
  }
})

app.listen(8080, () => {
  console.log('Listening on port 8080')
})
