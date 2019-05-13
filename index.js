
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

const users = require('./users.json').users;

let checkLogin = 1; // check if login is successful or not, if not display message about the failed login attempt
let registerCheck = 1;

async function login(usernamePara) {
    const client = await mongo.connect(databaseUrl, { useNewUrlParser : true });
    const user = await client.db('CodeAnonDatabase').collection('users').findOne({ 'username' : usernamePara})
    await client.close()
    return user
}

/*   Si MongoDB n'est pas installer, décommenter ce paragraphe et commenter
     la fonction asynchrone du dessus
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
*/

async function register(usernamePara, emailPara, passwordPara) {
    const client = await mongo.connect(databaseUrl, { useNewUrlParser: true });
    const userCollection = await client.db('CodeAnonDatabase').collection('users');

    const findWithUsername = await userCollection.findOne({ 'username' : usernamePara});
    const findWithEmail = await userCollection.findOne({ 'email' : emailPara});

    if (findWithUsername === null && findWithEmail === null)
    {
        await userCollection.insertOne({ 
            'username': usernamePara,
            'email': emailPara,
            'hashedPassword': passwordPara
        })
        await client.close()
        return true
    } else
    {
        await client.close()
        return false
    }
}


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
// register POST not working properlyn, adds a empty document in the database
app.post('/register', async (req, res) => {
    console.log(req.body);
    let username = req.body['registerUsername']
    let email = req.body['registerEmail']
    let confirmEmail = req.body['registerConfirmEmail']
    let password = req.body['registerPassword']
    let confirmPassword = req.body['registerConfirmPassword']
    //let hashedPassword =
    //let hashedConfirmPassword =
    // !!!!!!!!!!!!!!!!!!!   TEST PASSWORD AND CONFIRMPASS, EMAIL AND CONFIRM EMAIl
    let registerStatus = await register(username, email, password)

    if (registerStatus) {
        res.redirect('/register'); // with objetc saying register ok
    } else {
        res.redirect('/register') // with object saying register not ok enter good credentials
    }

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
