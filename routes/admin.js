/**
 *
 *  "Admin" route
 *
 */

const { Router } = require('express')
const adminRoute = Router()

const codakeyQuery = require('../db/codakeyQuerys')
const userQuery = require('../db/userQuerys')


adminRoute.get('/', function (req, res) {
    if (!req.session.user) res.redirect('/')

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
})

adminRoute.get('/codakey', function (req, res) {
    if (!req.session.user) res.redirect('/')

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

            if (!req.body.codakey) {

                res.render('codakey.ejs', {
                    username: req.session.user.username,
                    page: 'CodaKey',
                    responseMsg: 'Veuillez à remplir le champ!',
                })

            } else if (queryResponse.rows[0]) {

                res.render('codakey.ejs', {
                    username: req.session.user.username,
                    page: 'CodaKey',
                    responseMsg: 'La Codakey existe déjà',
                })

            } else {

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


module.exports = adminRoute