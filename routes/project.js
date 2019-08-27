/**
 *
 *  "Project" route
 *
 */

const { Router } = require('express')
const projectRoute = Router()

const articleQuery = require('../db/articleQuerys')


projectRoute.get('/', function (req, res) {
    if (req.session.user) {
        res.render('project.ejs', {
            username: req.session.user.username,
            page: 'Project',
        })
    } else {
        res.redirect('/')
    }
})


projectRoute.post('/', function (req, res) {
    if (req.session.user) {
        //  articleQuery.submitArticle(req, req.session.user.username)

        //  projectQuery.submitProject(req, req.session.user.username)
    }
    res.redirect('/')
})

module.exports = projectRoute

