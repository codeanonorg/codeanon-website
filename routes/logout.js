/**
 *
 *  "Logout" route
 *
 */

const { Router } = require('express')
const logoutRoute = Router()


logoutRoute.get('/', function (req, res) {
    req.session = null
    res.redirect('/login')
})

module.exports = logoutRoute