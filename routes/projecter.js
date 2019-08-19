const router = require('express').Router()

const projecterController = require('../controllers/projecter')


/* GET projecter page */

router.get('/', projecterController.get)

/* POST projecter page */

router.post('/', projecterController.post)

module.exports = router