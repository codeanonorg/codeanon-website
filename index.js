
const path = require('path')
const express = require('express')
const expressValidator = require('express-validator')
const session = require('cookie-session')
const bodyParser = require('body-parser')

const mongo = require('mongodb').MongoClient
const databaseUrl = 'mongodb://localhost:27017'//db' //27017 default port
const MarkdownIt = require('markdown-it')

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
async function testIfUserInDb(usernamePara) {
    const client = await mongo.connect(databaseUrl, { useNewUrlParser: true });
    return await client.db('CodeAnonDatabase').collection('users').findOne({ 'username' : usernamePara});
}

async function testIfEmailInDb(emailPara) {
    const client = await mongo.connect(databaseUrl, { useNewUrlParser: true });
    return await client.db('ConeAnonDatabase').collection('users').findOne({'email': emailPara});
}

async function register(usernamePara, emailPara, passwordPara) {
    const client = await mongo.connect(databaseUrl, { useNewUrlParser: true });
    const userCollection = await client.db('CodeAnonDatabase').collection('users');
    let user = { username: usernamePara, email: emailPara, hashedPassword: passwordPara}
    await userCollection.insertOne(user)
    await client.close()
}

async function submitArticle(req) {
    // if (database not contains article named req.article_title) {
    let md = new MarkdownIt()
    
    let {
        article_content,
        article_title,
        article_tags,
    } = req.body

    let tags = article_tags.split(" ")
    let htmlArticle = md.render(article_content)

    console.log("Title :", article_title)
    console.log("Tags :", tags)
    console.log("Content :")
    console.log(htmlArticle);
    // }

}


app.get('/', (req, res) => {
    if (req.session.user)
    {
        res.redirect('/home')
    } else
    {
        res.render('root.ejs')
    }
})

app.post('/', (req, res) => {
    let cmd = req.body['receivedUserInput'];
    
    if (cmd === 'login'){
        res.redirect('/login')
    } else if (cmd === 'register')
    {
        res.redirect('/register')
    }else {
        res.redirect('/');
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
        res.redirect('/')
    }
})

async function getArticleById(id)
{
    const client = await mongo.connect(databaseUrl, { useNewUrlParser: true });
    const articleCollection = await client.db('CodeAnonDatabase').collection('articles');
    return await articleCollection.find(ObjectId(id));
}

app.get('/article/:ArticleId', async (req, res) => {
    
    let requestedId = req.param.ArticleId
    let articleContent = getArticleById(requestedId)
    if(req.session.user)
    {
        let art_title = articleContent.article_title;
        let art_author = articleContent.article_author;
        let art_date = articleContent.article_date;
        let art_tags = articleContent.article_tags;
        let art_content = articleContent.article_content;

        res.render('article.ejs', {
            username: req.session.user.username,
            article_title: art_title,
            article_author: art_author,
            article_date: art_date,
            article_tags : art_tags,
            article_content : art_content,            
        })
    } else {
        res.redirect('/')
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
        res.redirect('/')
    }
})


app.post('/login', async (req, res) => {

    let username = req.body['loginUsername'];
    let password = req.body['loginPassword'];

    req.checkBody('loginUsername', 'Username is required').notEmpty();
    //req.checkBody('loginEmail', 'Please enter a valid email').isEmail();

    const errors = req.validationErrors();
    const credentials = await login(username)
    // get the user datas if user exist, else return 'null'
    if (errors) {
        checkLogin = 0;
        req.session.errors = errors;
        res.redirect('/login');
    } else if (credentials === null) { // if user not in database
        req.session.errors = [{ errorMsg: 'invalid username or password' }];
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
        req.session.errors = [{ errorMsg: 'invalid username or password' }];
        checkLogin = 0;
        res.redirect('/login');
    }
})

app.post('/register', async (req, res) => {

    let username = req.body['registerUsername']
    let email = req.body['registerEmail']
    let confirmEmail = req.body['registerConfirmEmail']
    let password = req.body['registerPassword']
    let confirmPassword = req.body['registerConfirmPassword']
    
    req.checkBody('registerEmail', 'Please enter a valid email').isEmail();

    const testUser = await testIfUserInDb(username)
    const testEmail = await testIfEmailInDb(email)

    if ((username === null)|| (email === null)|| (confirmEmail === null) || (password === null) || (confirmPassword === null))
    {
        res.render('register.ejs',
        {
            registerFailMsg: 'please fill all fields'
        })
    }else if (email !== confirmEmail)
    {
        res.render('register.ejs', 
        {
            registerFailMsg: "email and confirm email are not the same"
        })
    } else if (password !== confirmPassword)
    {
        res.render('register.ejs', 
        {
            registerFailMsg: "password are not the same"
        })
    } else if (testUser !== null && testEmail !== null)
    {
        res.render('register.ejs',
        {
            registerFailMsg: "username and email already exist"
        })
    } else if (testEmail !== null)
    {
        res.render("register.ejs",
        {
            registerFailMsg: "email already exists"
        })
    }else if (testUser !== null)
    {
        res.render("register.ejs",
        {
            registerFailMsg: "username already exists"
        })
    } else
    {
        await register(username, email, password)
        res.redirect('/login');
    }
})


app.get('/test', (req, res) => {
    if (req.session.user) {
        res.render('test.ejs', { msg: req.session.user.username })
    } else {
        res.redirect('/')
    }
})

// app.use(function(req, res, next) {
//   res.status(404).render("404.ejs", {reqUrl: req.url});
// })

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
        submitArticle(req)
    }
    res.redirect('/')
})

app.get('*', (req, res) => {
    res.status(404).render('404.ejs', { reqUrl: req.url })
})

app.listen(8080, () => {
    console.log('Listening on port 8080')
})
