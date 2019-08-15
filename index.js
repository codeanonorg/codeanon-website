const express = require('express')
const expressValidator = require('express-validator')
const session = require('cookie-session')
const bodyParser = require('body-parser')

let root = require('./routes/root')
let login = require('./routes/login')
let register = require('./routes/register')
let home = require('./routes/home')
let blog = require('./routes/blog')
let article = require('./routes/article')
let submit = require('./routes/submit')
let profile = require('./routes/profile')
let logout = require('./routes/logout')
let admin = require('./routes/admin')

let app = express()

app.use(express.static('public'))
app.use(express.static('bower_components'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
    name: 'session',
    secret: 'jaimelescookies',
    //  keys: new Keygrip(secret, 'SHA256', 'base64'),

    //  Options
    path: '/',
    httpOnly: true,
    //  secure: true, // need https rev-proxie
    signed: true,
    maxAge: 172800000, // 48 * 60 * 60 * 1000 = 48h
    sameSite: 'strict',
}))

app.use(expressValidator())


//  Routing Start

app.use('/', root)
app.use('/login', login)
app.use('/register', register)
app.use('/home', home)
app.use('/blog', blog)
app.use('/article', article)
app.use('/submit', submit)
app.use('/profile', profile)
app.use('/logout', logout)
app.use('/admin', admin)

app.get('*', (req, res) => {
    res.status(404).render('404.ejs', {
        reqUrl: req.url
    })
})

// Routing End

app.listen(8080, () => {
    console.log('Listening on port 8080')
})
