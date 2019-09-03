/**
 *
 *  "Admin" route
 *
 */

const { Router } = require('express')
const adminRoute = Router()

const codakeyQuery = require('../db/codakeyQuerys')

adminRoute.get('/', function (req, res) {

    if (req.session.user) {
        res.render('admin.ejs', {
            username: req.session.user.username,
            page: "Admin"
        })
    } else {
        res.redirect('/')
    }
})

adminRoute.get('/codakey', function (req, res) {
    if (!req.session.user) res.redirect('/')

    res.render('codakey.ejs', {
        username: req.session.user.username,
        page: 'CodaKey',
        responseMsg: '',
    })
})

adminRoute.post('/codakey', function (req, res) {
    if (!req.session.user) res.redirect('/')

    codakeyQuery
        .testIfKeyInDb(req.param.codakey)
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
            console.error(e)
        })
})


module.exports = adminRoute