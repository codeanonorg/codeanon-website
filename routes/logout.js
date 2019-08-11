const router = require('express').Router()

/* GET logout page */
router.get('/', (req, res) => {
    //  req.session = null
    req.session.user = {username: "testUserLol"}
    res.redirect('/login')
})
module.exports = router