const router = require('express').Router()

const articleController = require('../controllers/article')

/* GET article/:articleId page */

router.get('/:ArticleId', articleController.get)

module.exports = router