//  app.js
const express           = require('express')
const expressValidator  = require('express-validator')
const session           = require('cookie-session')
const bodyParser        = require('body-parser')
const favicon           = require('serve-favicon')
const path              = require('path')
const Users             = require('../db/userQuerys')

const passport  = require('passport')
const Strategy  = require('passport-local').Strategy
const bcrypt    = require('bcrypt')

const root      = require('./routes/root')
const login     = require('./routes/login')
const register  = require('./routes/register')
const home      = require('./routes/home')
const blog      = require('./routes/blog')
const article   = require('./routes/article')
const submit    = require('./routes/submit')
const project   = require('./routes/project')
const projecter = require('./routes/projecter')
const profile   = require('./routes/profile')
const logout    = require('./routes/logout')
const admin     = require('./routes/admin')
const about     = require('./routes/about')
const resources = require('./routes/resources')

const app = express()

// Set up sql connexion

const { Client } = require('pg')

const client = new Client(
    {
        /*
        user: 'postgres',
        host: 'localhost',
        database: 'catest',
        password: 'dev',
        port: 5432,
        */
        
        connectionString: process.env.DATABASE_URL,
        ssl: true,
        
    }
)

client.connect()


// ===================================
// Setting passport up
passport.use(new Strategy((username, password, done) => {
    Users.getByUsername(username)
    .then( user => {
        if (bcrypt.compareSync(password, user.password))
            done(null, user)
    })
    .catch( err => {
        console.error(`unable to authenticate user "${username}"`)
        done(null, false)
    })
}))


passport.serializeUser(function(user, done) {
  done(null, user.user_id)
})


passport.deserializeUser(function(id, done) {
  Users.getUserById(id)
  .then( user => done(user))
})
// ===================================

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
    name: 'session',
    secret: process.env.SECRET,
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
app.use(passport.initialize())
app.use(passport.session())

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

const port = process.env.PORT;

app.listen(port, () => {
    console.log('Listening on port: ' + port);
})
