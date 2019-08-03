const router = require('express').Router()

/* GET logout page */
router.get('/submit', (req, res) => {
    req.session = null
    res.redirect('/login')
})
module.exports = router