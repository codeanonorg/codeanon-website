const router = require('express').Router()

/* GET admin page */
router.get('/', (req, res) => {
    res.render('test.ejs', {
        //  username: req.session.user.username
        username: "testUser",// to remove
        page: "test"
    })
})

module.exports = router