const router = require('express').Router()

const rootController = require('../controllers/root')


/* GET root page */

router.get('/', rootController.get)

module.exports = router