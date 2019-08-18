const router = require('express').Router()

const adminController = require('../controllers/admin')

/* GET admin page */
router.get('/', adminController.get)

module.exports = router