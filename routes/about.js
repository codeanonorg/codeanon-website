const router = require('express').Router()

/* GET home page */
router.get('/', (req, res) => {
    let user = 'guest'

    if (req.session !== null) {
        user = req.session.user.username
    }

    res.render('about.ejs', {
    username: user,
    page: "About",
    })
})

module.exports = router