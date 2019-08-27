/**
 *
 *  "Submit" route
 *
 */

const { Router } = require('express')
const submitRoute = Router()


const articleQuery = require('../db/articleQuerys')


submitRoute.get('/', function (req, res) {
    if (req.session.user) {
        res.render('submit.ejs', {
            username: req.session.user.username,
            page: 'submit',
        })
    } else {
        res.redirect('/')
    }
})

submitRoute.post('/', function (req, res) {

    if (req.session.user) {

        articleQuery
            .submitArticle(req)
            .then(queryResponse => {
                console.log('Article Created : \n' + JSON.stringify(queryResponse.rows[0]))
                res.redirect('/blog')
            })
            .catch(e => console.error(e.stack))

    } else {
        res.redirect('/')
    }
})

module.exports = submitRoute



/**
 * Submit: 
 * titre, contenu, desc, time
 * username id
 */