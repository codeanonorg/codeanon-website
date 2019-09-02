/**
 *
 *  "Root" route
 *
 */

const { Router } = require('express')
const rootRoute = Router()

rootRoute.get('/', function (req, res) {
    if (req.session.user) {
        res.redirect('/home')
    } else {
        res.render('root.ejs')
    }
})

module.exports = rootRoute