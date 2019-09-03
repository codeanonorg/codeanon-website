//  app.js
const express = require('express')
const expressValidator = require('express-validator')
const session = require('cookie-session')
const bodyParser = require('body-parser')
const favicon = require('serve-favicon')
const path = require('path')

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

const app = express()

// Set up sql connexion

const { Client } = require('pg')

const client = new Client(
    {
        user: 'postgres',
        host: 'localhost',
        database: 'catest',
        password: 'dev',
        port: 5432,
        /*
        connectionString: process.env.DATABASE_URL,
        ssl: true,
        */
    }
)

client.connect()

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.use(express.static('public'))
app.use(express.static('bower_components'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

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
app.use('/project', project)
app.use('/projecter', projecter)
app.use('/profile', profile)
app.use('/logout', logout)
app.use('/admin', admin)
app.use('/about', about)
app.use('/resources', resources)

app.get('*', (req, res) => {
    res.status(404).render('404.ejs', {
        reqUrl: req.url
    })
})

// Routing End

const port = 8080//process.env.PORT;

app.listen(port, () => {
    console.log('Listening on port: ' + port);
})
