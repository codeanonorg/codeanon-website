const router = require('express').Router()

/* GET logout page */
router.get('/', (req, res) => {
    req.session = null
    res.redirect('/login')
})
module.exports = router