const router = require('express').Router()

const loginController = require('../controllers/login')

/* GET login page */

router.get('/', loginController.get)

/* POST login page */

router.post('/', loginController.post)

module.exports = router