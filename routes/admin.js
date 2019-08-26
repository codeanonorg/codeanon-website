/**
 *
 *  "Admin" route
 *
 */

const { Router } = require('express')
const adminRoute = Router()

adminRoute.get(function (req, res) {
    if (req.session.user) {
        res.render('admin.ejs', {
            username: req.session.user.username,
            page: "Admin"
        })
    } else {
        res.redirect('/')
    }
})

module.exports = adminRoute