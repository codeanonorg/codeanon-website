const router = require('express').Router()
const articleQuery = require('../public/js/articleQuerys')

/* GET submit page */
router.get('/', (req, res) => {
    if (req.session.user) {
        res.render('submit.ejs', {
            username: req.session.user.username,
            page: 'submit',
        })
    } else {
        res.redirect('/')
    }
})

/* POST submit page */

router.post('/', async (req, res) => {
    if (req.session.user) {
        articleQuery.submitArticle(req, req.session.user.username)
    }
    res.redirect('/')
})

module.exports = router