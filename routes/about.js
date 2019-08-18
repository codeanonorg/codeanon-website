const router = require('express').Router()

const aboutController = require('../controllers/about')

/* GET home page */
router.get('/', aboutController.get)

module.exports = router