
const path = require('path')
const express = require('express')
const expressValidator = require('express-validator')
const session = require('cookie-session')
const bodyParser = require('body-parser')

const mongo = require('mongodb').MongoClient
const databaseUrl = 'mongodb://localhost:27017'//db' //27017 default port

let app = express()

app.use(express.static('public'))
app.use(express.static('bower_components'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
    secret: 'jaimelescookies'
}))

app.use(expressValidator())
/* a supprimer
mongo.connect(databaseUrl, {useNewUrlParser: true}, (err, client) => {
  const db = client.db('CodeAnonDatabase')
  const userCol = db.collection('users')
  userCol.insertOne({username: "admin", email: "admin@admin.admin", hashedPassword: "admin"})
  client.close()
  console.log("admin created");
})
*/
const users = require('./users.json').users;

let checkLogin = 1; // check if login is successful or not, if not display message about the failed login attempt
let registerCheck = 1;
///////////////////////////
//  a changer
///////////////////////////

async function login(usernamePara) {
    const client = await mongo.connect(databaseUrl, { useNewUrlParser : true });
    const user = await client.db('CodeAnonDatabase').collection('users').findOne({ 'username' : usernamePara})
    return user
}

function register(usernamePara, emailPara, passwordPara) {
    mongo.connect(url, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            console.log(err)
            return
        }

        const db = client.db('db')
        const userCol = db.collection('users')

        let alreadyExist = 0 // test if username or email already exist

        userCol.findOne({ username: usernamePara }, (err, item) => {
            if (err) {
                console.log(err)
                return
            }
            if (item !== null) {
                alreadyExist = 1
            }
        })

        userCol.findOne({ email: emailPara }, (err, item) => {
            if (err) {
                console.log(err)
                return
            }
            if (item !== null) {
                alreadyExist = 2
            }
        })
        console.log(alreadyExist)
        console.log(` already exists ${alreadyExist}`)
        if (alreadyExist === 0) {
            userCol.insertOne({ username: usernamePara, email: emailPara, hashedPassword: passwordPara })
        }
        client.close()
        return alreadyExist
    })
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
    if (req.session.user) {
        res.redirect('/home');
    } else if (registerCheck === 0) {
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
        res.render('home.ejs', { msg: req.session.user.username })
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
        res.render('profile.ejs', { msg: req.session.user.username })
    } else {
        res.redirect('/login')
    }
})


app.post('/login', async (req, res) => {
    console.log("req.body");
    console.log(req.body);

    let username = req.body['loginUsername'];
    let password = req.body['loginPassword'];

    req.checkBody('loginUsername', 'Username is required').notEmpty();
    //req.checkBody('loginEmail', 'Please enter a valid email').isEmail();

    const errors = req.validationErrors();
    const credentials = await login(username)
    // get the user datas if user exist, else return 'null'
    if (errors) {
        console.log("err"); // del
        checkLogin = 0;
        req.session.errors = errors;
        res.redirect('/login');
    } else if (credentials === null) { // if user not in database
        console.log("err 2"); // del
        req.session.errors = [{ msg: 'invalid username or password' }];
        checkLogin = 0;
        res.redirect('/login');
    } else if (credentials.username === username && credentials.hashedPassword === password) // test password
    {
        req.session.user = {
            'username': username
        };
        checkLogin = 1;
        res.redirect('/home');
    } else {    // handle errors that i haven't thougt about
        req.session.errors = [{ msg: 'invalid username or password' }];
        checkLogin = 0;
        res.redirect('/login');
    }
})

app.post('/register', (req, res) => {
    console.log(req.body);
    let username = req.body['registerUsername']
    let email = req.body['registerEmail']
    let confirmEmail = req.body['registerConfirmEmail']
    let password = req.body['registerPassword']
    let confirmPassword = req.body['registerConfirmPassword']
    //let hashedPassword =
    //let hashedConfirmPassword =
    // !!!!!!!!!!!!!!!!!!!   TEST PASSWORD AND CONFIRMPASS, EMAIL AND CONFIRM EMAIl
    let registerStatus = register(username, email, password)

    if (registerStatus === 0) {
        res.redirect('/register'); // with objetc saying register ok
    } else {
        res.redirect('/register') // with object saying register not ok enter good credentials
    }


    /*
    if((email !== confirmEmail) or (hashedPassword !== hashedConfirmPassword))
    {
      registerCheck += 1;
      res.redirect('/register');
    } else
    {
      // make a ajavscript object Json.parse
      // send email, username, pass to db
    }
    */

    // wip
})


app.get('/test', (req, res) => {
    if (req.session.user) {
        res.render('test.ejs', { msg: req.session.user.username })
    } else {
        res.redirect('/login')
    }
})

// app.use(function(req, res, next) {
//   res.status(404).render("404.ejs", {reqUrl: req.url});
// })

app.get('*', (req, res) => {
    res.status(404).render('404.ejs', { reqUrl: req.url })
})

app.listen(8080, () => {
    console.log('Listening on port 8080')
})
