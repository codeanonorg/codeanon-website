const router = require('express').Router()

const blogController = require('../controllers/blog')


/* GET blog page */
router.get('/', blogController.get)

module.exports = router