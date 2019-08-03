const router = require('express').Router()

/* GET admin page */
router.get('/', (req, res) => {
    res.render('admin.ejs')
})

module.exports = router