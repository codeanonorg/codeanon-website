const router = require('express').Router()

const submitController = require('../controllers/submit')


/* GET submit page */

router.get('/', submitController.get)

/* POST submit page */

router.post('/', submitController.post)

module.exports = router