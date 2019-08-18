const router = require('express').Router()

/* GET admin page */
router.get('/', (req, res) => {
    if (req.session.user) {
        res.render('admin.ejs', {
            username: req.session.user.username,
            page: "admin"
        })
    } else {
        res.redirect('/')
    }

})

module.exports = router