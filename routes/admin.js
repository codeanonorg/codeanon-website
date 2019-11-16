/**
 *
 *  "Admin" route
 *
 */

const { Router } = require('express')
const adminRoute = Router()

const codakeyQuery = require('../db/codakeyQuerys')
const userQuery = require('../db/userQuerys')
const articleQuery = require('../db/articleQuerys')

const time = require('../public/js/timeHandling')

adminRoute.get('/', function (req, res) {

    if (!req.session.user) {
        console.log('redirect empty')
        res.redirect('/')
    } else {
        userQuery
            .getUserByUsername(req.session.user.username)
            .then(queryResponse => {

                if (queryResponse.role_id !== 1) {
                    res.redirect('/home')
                } else {
                    res.render('admin.ejs', {
                        username: req.session.user.username,
                        page: 'Panel Admin'
                    })
                }
            })
            .catch(e => {
                res.redirect('/home')
                console.log(e)
            })
    }
})

adminRoute.get('/codakey', function (req, res) {

    if (!req.session.user) {
        res.redirect('/')
    } else {
        userQuery
            .getUserByUsername(req.session.user.username)
            .then(queryResponse => {

                if (queryResponse.role_id !== 1) {

                    res.redirect('/home')

                } else {

                    res.render('codakey.ejs', {
                        username: req.session.user.username,
                        page: 'CodaKey',
                        responseMsg: '',
                    })
                }
            })
            .catch(e => {
                res.redirect('/home')
                console.log(e)
            })
    }

})

adminRoute.post('/codakey', function (req, res) {
    if (!req.session.user) res.redirect('/')

    userQuery
        .getUserByUsername(req.session.user.username)
        .then(queryResponse => {
            if (queryResponse.role_id !== 1) {
                res.redirect('/home')
            }

            return codakeyQuery.testIfKeyInDb(req.param.codakey)
        })
        .then(queryResponse => {
            console.log(queryResponse.rows)

            if (!req.body.codakey) {

                res.render('codakey.ejs', {
                    username: req.session.user.username,
                    page: 'CodaKey',
                    responseMsg: 'Veuillez remplir le champ!',
                })

            } else if (queryResponse.rows.length !== 0) {

                console.log(queryResponse.rows)

                res.render('codakey.ejs', {
                    username: req.session.user.username,
                    page: 'CodaKey',
                    responseMsg: 'La Codakey existe déjà',
                })

            } else {
                console.log('ici')
                return codakeyQuery.createCodaKey(req.body.codakey)
            }
        })
        .then(queryResponse => {

            if (req.body.codakey) {
                res.render('codakey.ejs', {
                    username: req.session.user.username,
                    page: 'CodaKey',
                    responseMsg: 'Création de la CodaKey réussite',
                })
            }
        })
        .catch(e => {
            res.redirect('/home')
            console.log(e)
        })
})

adminRoute.get('/unverifiedArticles', function (req, res) {
    if (!req.session.user) res.redirect('/')

    userQuery
        .getUserByUsername(req.session.user.username)
        .then(queryResponse => {

            if (queryResponse.role_id !== 1) {

                res.redirect('/home')

            } else {

                return articleQuery.getArticlesByVerificationStatus('false')
            }
        })
        .then(queryResponse => {

            let dateArray;
            let articleList;

            if (queryResponse.rows[0]) {

                dateArray = time.getDatesForArticleList(queryResponse.rows)
                articleList = queryResponse.rows

            } else {
                dateArray = []
                articleList = []
            }
            res.render('unverifiedArticles.ejs', {
                username: req.session.user.username,
                article_list: articleList,
                article_date_list: dateArray,
                page: 'Unverified Articles',
            })
        })
        .catch(e => {
            res.redirect('/admin')
            console.log(e)
        })
})

adminRoute.get('/user-list', (req, res) => {
    /*
    
    if (!req.session.user) res.redirect('/')

    */
    //check if admin :: get users

    // ///!!!\\\ WRAP ALL QUERYS
    userQuery
        .getUserByUsername(req.session.user.username)
        .then(queryResponse => {
            if (queryResponse.role_id !== 1) {
                res.redirect('/home')
            }

            return userQuery.getAllUsers()
        })
        .then(queryResponse => {
            console.log(queryResponse.rows)
            if (queryResponse.rows[0]) {
                
                dateArray = time.getDatesForArticleList(queryResponse.rows)
                userList = queryResponse.rows

            } else {
                dateArray = []
                articleList = []
            }
            res.render('userList.ejs', {
                username: req.session.user.username,
                user_list: userList,
                user_date_list: dateArray,
                page: 'User List',
            })
        })
        .catch(e => console.error(e))
})

 // for debug use
 /*
adminRoute.get('/fakeUser', (req, res) => {
    console.log("Debug")
    req.session.user = {
        'username': 'fake',
        'email': 'fake.fake@fake',
        'user_id': 99456,
    };
    res.redirect('/home')
})*/


module.exports = adminRoute