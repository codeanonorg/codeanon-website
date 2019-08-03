const router = require('express').Router()

/* GET root page */
router.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/home')
    } else {
        res.render('root.ejs')
    }
})

module.exports = router