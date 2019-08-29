/**
 *
 *  "Resources" route
 *
 */

const { Router } = require('express')
const resourcesRoute = Router()

resourcesRoute.get('/', function (req, res) {
    let user = 'guest'

    if (!req.session.user) {
        try {
            user = req.session.user.username
        } catch (error) {
            console.error(error)
        }
    }

    res.render('resources.ejs', {
        username: user,
        page: "About",
    })
})

module.exports = resourcesRoute