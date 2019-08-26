/**
 *
 *  "About" route
 *
 */

const { Router } = require('express')
const aboutRoute = Router()

aboutRoute.get(function (req, res) {
    let user = 'guest'

    if (req.session.user !== null && req.session.user !== undefined) {
        try {
            user = req.session.user.username
        } catch (error) {
            console.error(error)
        }
    }

    res.render('about.ejs', {
        username: user,
        page: "About",
    })
})

module.exports = aboutRoute