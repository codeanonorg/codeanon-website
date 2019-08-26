/**
 *
 *  "Submit" route
 *
 */

const { Router } = require('express')
const submitRoute = Router()


const articleQuery = require('../public/js/articleQuerys')


submitRoute.get(function (req, res) {
    if (req.session.user) {
        res.render('submit.ejs', {
            username: req.session.user.username,
            page: 'submit',
        })
    } else {
        res.redirect('/')
    }
})

submitRoute.post(async function (req, res) {
    if (req.session.user) {
        articleQuery.submitArticle(req, req.session.user.username)
    }
    res.redirect('/')
})

module.exports = submitRoute