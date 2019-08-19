const router = require('express').Router()

const logoutController = require('../controllers/logout')

/* GET logout page */

router.get('/', logoutController.get)

module.exports = router