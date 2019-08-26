//const router = require('express').Router()
const Router = require('express-promise-router')

const loginController = require('../controllers/login')

const router = new Router()
/* GET login page */

router.get('/', loginController.get)

/* POST login page */

router.post('/', loginController.post)

module.exports = router