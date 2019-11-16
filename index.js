//  app.js
const express = require('express')
const expressValidator = require('express-validator')
const session = require('cookie-session')
const bodyParser = require('body-parser')
const favicon = require('serve-favicon')
const path = require('path')
const userQuery = require('./db/userQuerys')

const root = require('./routes/root')
const login = require('./routes/login')
const register = require('./routes/register')
const home = require('./routes/home')
const blog = require('./routes/blog')
const article = require('./routes/article')
const submit = require('./routes/submit')
const project = require('./routes/project')
const projecter = require('./routes/projecter')
const profile = require('./routes/profile')
const logout = require('./routes/logout')
const admin = require('./routes/admin')
const about = require('./routes/about')
const resources = require('./routes/resources')
const api = require('./routes/api')

const app = express()

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.use(express.static('public'))
app.use(express.static('bower_components'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.set('trust proxy', 1)
app.use(session({
    name: 'session',
    secret: process.env.SECRET || "jetarabiscottesouventEnandalousie",
    //  keys: new Keygrip(secret, 'SHA256', 'base64'),

    //  Options
    path: '/',
    httpOnly: true,
    secure: true, // need https rev-proxie
    signed: true,
    maxAge: 172800000, // 48 * 60 * 60 * 1000 = 48h
    sameSite: 'strict',
}))

app.use(expressValidator())


let check = (req, res, next) => {
    if (req.session.user) {
        next()

    } else {
        res.redirect('/login')
    }
}

let adminCheck = (req, res, next) => {
    userQuery
        .getUserByUsername(req.session.user.username)
        .then(queryResponse => {

            if (queryResponse.role_id !== 1) {

                res.redirect('/home')

            } else {
                next()
            }
        }).catch(e => console.error(e))
}


//  Routing Start

app.use('/login', login)
app.use('/', root)
app.use('/register', register)
app.use('/home', check, home)
app.use('/blog', check, blog)
app.use('/article', check, article)
app.use('/submit', check, submit)
app.use('/project', check, project)
app.use('/projecter', check, projecter)
app.use('/profile', check, profile)
app.use('/logout', check, logout)
app.use('/admin', check, adminCheck, admin)
app.use('/about', check, about)
app.use('/resources', check, resources)
app.use('/api', api)

app.get('*', (req, res) => {
    res.status(404).render('404.ejs', {
        reqUrl: req.url
    })
})

// Routing End

const port = process.env.PORT || 8080

app.listen(port, () => {
    console.log('Listening on port: ' + port);
})
