/**
 *
 *  "Projecter" route
 *
 */

const { Router } = require('express')
const projecterRoute = Router()

const articleQuery = require('../public/js/articleQuerys')


projecterRoute.get = function (req, res) {
    if (req.session.user) {
        res.render('projecter.ejs', {
            username: req.session.user.username,
            page: 'Projecter',
        })
    } else {
        res.redirect('/')
    }
}

exports.post = async function (req, res) {
    if (req.session.user) {
        //  articleQuery.submitArticle(req, req.session.user.username)

        //  projectQuery.submitProject(req, req.session.user.username)
    }
    res.redirect('/')
}

module.exports = projecterRoute

