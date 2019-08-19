const router = require('express').Router()

const registerController = require('../controllers/register')


/* GET register page */

router.get('/', registerController.get)

/* POST register page */

router.post('/', registerController.post)

module.exports = router