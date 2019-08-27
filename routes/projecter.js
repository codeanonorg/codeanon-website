/**
 *
 *  "Projecter" route
 *
 */

const { Router } = require('express')
const projecterRoute = Router()

const projectQuery = require('../db/projectQuerys')


projecterRoute.get('/', function (req, res) {
    if (req.session.user) {
        res.render('projecter.ejs', {
            username: req.session.user.username,
            page: 'Projecter',
        })
    } else {
        res.redirect('/')
    }
})

projecterRoute.post('/', function (req, res) {
    if (req.session.user) {
        
        projectQuery
            .submitProject()
            .then( queryResponse => {
                console.log('Project Created : \n' + JSON.stringify(queryResponse.rows[0]))
                res.redirect('/project')
            })
            .catch(e => console.error(e.stack))
    }
    res.redirect('/')
})

module.exports = projecterRoute

