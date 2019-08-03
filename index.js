const express = require('express')
const expressValidator = require('express-validator')
const session = require('cookie-session')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const saltRounds = 10; // increase the number to make the brutforcing harder

const userQuery = require('./public/js/userQuerys')
const articleQuery = require('./public/js/articleQuerys')
const formatDate = require('./public/js/dateHandling').formatDate

let app = express()

app.use(express.static('public'))
app.use(express.static('bower_components'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
    secret: 'jaimelescookies'
}))

app.use(expressValidator())


let checkLogin = 1; // check if login is successful or not, if not display message about the failed login attempt
let registerCheck = 1;

//  Routing Start

app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/home')
    } else {
        res.render('root.ejs')
    }
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
})

app.post('/login', async (req, res) => {

    let username = req.body['loginUsername'];
    let password = req.body['loginPassword'];
    //const hashedPass = await hashIt(password)

    req.checkBody('loginUsername', 'Username is required').notEmpty();
    //req.checkBody('loginEmail', 'Please enter a valid email').isEmail();

    const errors = req.validationErrors();
    const credentials = await userQuery.login(username)
    // get the user datas if user exist, else return 'null'
    if (errors) {
        checkLogin = 0;
        req.session.errors = errors;
        res.redirect('/login');
    } else if (credentials === null) { // if user not in database
        req.session.errors = [{ errorMsg: 'invalid username or password' }];
        checkLogin = 0;
        res.redirect('/login');
    } else if (credentials.username === username && bcrypt.compareSync(password, credentials.hashedPassword)) // test password
    {
        req.session.user = {
            'username': username,
            'email': credentials.email,
        };
        checkLogin = 1;
        res.redirect('/home');
    } else {    // handle errors that i haven't thougt about
        req.session.errors = [{ errorMsg: 'invalid username or password' }];
        checkLogin = 0;
        res.redirect('/login');
    }
})

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

app.post('/register', async (req, res) => {

    let username = req.body['registerUsername']
    let email = req.body['registerEmail']
    let confirmEmail = req.body['registerConfirmEmail']
    let password = req.body['registerPassword']
    let confirmPassword = req.body['registerConfirmPassword']

    req.checkBody('registerEmail', 'Please enter a valid email').isEmail();

    const testUser = await userQuery.testIfUserInDb(username)
    const testEmail = await userQuery.testIfEmailInDb(email)

    if ((username === null) || (email === null) || (confirmEmail === null) || (password === null) || (confirmPassword === null)) {
        res.render('register.ejs',
            {
                registerFailMsg: 'please fill all fields'
            })
    } else if (email !== confirmEmail) {
        res.render('register.ejs',
            {
                registerFailMsg: "email and confirm email are not the same"
            })
    } else if (password !== confirmPassword) {
        res.render('register.ejs',
            {
                registerFailMsg: "password are not the same"
            })
    } else if (testUser !== null && testEmail !== null) {
        res.render('register.ejs',
            {
                registerFailMsg: "username and email already exist"
            })
    } else if (testEmail !== null) {
        res.render("register.ejs",
            {
                registerFailMsg: "email already exists"
            })
    } else if (testUser !== null) {
        res.render("register.ejs",
            {
                registerFailMsg: "username already exists"
            })
    } else {
        await register(username, email, bcrypt.hashSync(password, saltRounds))
        res.redirect('/login');
    }
})

app.get('/home', (req, res) => {
    if (req.session.user) {
        res.render('home.ejs', { msg: req.session.user.username })
    } else {
        res.redirect('/')
    }
})


app.get('/blog', async (req, res) => {

    if (req.session.user) {
        const user = req.session.user.username;

        if (typeof req.query['tag'] !== 'undefined') {
            const art_by_tag = await articleQuery.getArticlByTag(req.query['tag']);

            let date_array = formatDate(art_by_tag)

            res.render('blog.ejs', {
                username: user,
                article_list: art_by_tag,
                article_date_list: date_array,
            })
        } else if (typeof req.query['allArt'] !== 'undefined') {
            const all_art = await articleQuery.getAllArticles();

            let date_array = formatDate(all_art)

            res.render('blog.ejs', {
                username: user,
                article_list: all_art,
                article_date_list: date_array,
            })
        } else {
            let art_list = await articleQuery.getTenMostRecentArticles();
            // get 9 last submited articles
            let date_array = formatDate(art_list)

            res.render('blog.ejs', {
                username: user,
                article_list: art_list,
                article_date_list: date_array,
            })
        }

    } else {
        res.redirect('/')
    }
})

app.get('/article/:ArticleId', async (req, res) => {

    let requestedId = req.params.ArticleId
    let articleContent = await articleQuery.getArticleById(requestedId)

    if (req.session.user) {

        let art_title = articleContent.article_title;
        let art_author = articleContent.article_author;

        // please do not modify this or you break the /blog page
        let art_date_msec = articleContent.article_date;
        // get the date in milliseconds

        let art_tags = articleContent.article_tags;
        let art_description = articleContent.article_description;
        let art_content = articleContent.article_content;

        // convert the date in readable format
        let date = new Date(art_date_msec);
        let art_date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

        res.render('article.ejs', {
            username: req.session.user.username,
            article_title: art_title,
            article_author: art_author,
            article_date: art_date,
            article_tags: [art_tags],
            article_description: art_description,
            article_content: art_content,
        })
    } else {
        res.redirect('/')
    }
})

app.get('/submit', (req, res) => {
    if (req.session.user) {
        res.render('submit.ejs', {
            username: req.session.user.username
        })
    } else {
        res.redirect('/')
    }
})

app.post('/submit', async (req, res) => {
    if (req.session.user) {
        articleQuery.submitArticle(req, req.session.user.username)
    }
    res.redirect('/')
})
app.get("/profile", (req, res) => {
    if (req.session.user) {
        res.render('profile.ejs', {
            username: req.session.user.username,
            email: req.session.user.email,
            error: "",
        })
    } else {
        res.redirect('/')
    }
})

app.post('/profile', async (req, res) => {
    if (req.session.user) {
    } else {
        res.redirect('/');
    }
    let newUsername = req.body['changeUsername'];
    let newEmail = req.body['changeEmail'];
    let newPassword = req.body['changePassword'];
    let confirmPassword = req.body['ConfirmChangePassword'];
    // users
    let dbPass = await userQuery.login(req.session.user.username);
    // chek if username or email already exists in db
    const testUsername = await userQuery.testIfUserInDb(newUsername);
    const testEmail = await userQuery.testIfEmailInDb(newEmail);
    if (testUsername !== null) {
        // nope user already used
    } else if (testEmail !== null) {
        // nope email already used
    }
    if (bcrypt.compareSync(confirmPassword, dbPass.hashedPassword)) {
        await userQuery.updateUser(req.session.user.username, newUsername, newEmail, newPassword)
        res.redirect('/logout');
    } else {
        res.render('profile.ejs', {
            username: req.session.user.username,
            email: req.session.user.email,
            error: "incorrect password",
        })
    }
    // check empty fields
})

app.get('/admin', (req, res) => {
    res.render('admin.ejs', {

    })
})

app.get('/logout', (req, res) => {
    req.session = null
    res.redirect('/login')
})

app.get('/test', (req, res) => {
    if (req.session.user) {
        res.render('test.ejs', { msg: req.session.user.username })
    } else {
        res.redirect('/')
    }
})

app.get('*', (req, res) => {
    res.status(404).render('404.ejs', { reqUrl: req.url })
})

app.listen(8080, () => {
    console.log('Listening on port 8080')
})
