const router = require('express').Router()
const articleQuery = require('../public/js/articleQuerys')

/* GET projecter page */
router.get('/', (req, res) => {
    if (req.session.user) {
        res.render('projecter.ejs', {
            username: req.session.user.username,
            page: 'Projecter',
        })
    } else {
        res.redirect('/')
    }
})

/* POST projecter page */

router.post('/', async (req, res) => {
    if (req.session.user) {
        //  articleQuery.submitArticle(req, req.session.user.username)
        
        //  projectQuery.submitProject(req, req.session.user.username)
    }
    res.redirect('/')
})

module.exports = router