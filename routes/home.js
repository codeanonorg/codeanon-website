const router = require('express').Router()

/* GET home page */
router.get('/', (req, res) => {
    if (req.session.user) {
        res.render('home.ejs', {
            username: req.session.user.username
        })
    } else {
        res.redirect('/')
    }
})

module.exports = router