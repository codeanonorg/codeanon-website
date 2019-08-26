/**
 *
 *  "Home" route
 *
 */

const { Router } = require('express')
const homeRoute = Router()


homeRoute.get(function (req, res) {
    if (req.session.user) {
        res.render('home.ejs', {
            username: req.session.user.username,
            page: "Home",
        })
    } else {
        res.redirect('/')
    }
})

module.exports = homeRoute

