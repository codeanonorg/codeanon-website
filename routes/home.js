const router = require('express').Router()

const homeController = require('../controllers/home')

/* GET home page */

router.get('/', homeController.get)

module.exports = router