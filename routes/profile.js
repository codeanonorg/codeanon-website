const router = require('express').Router()

const profileController = require('../controllers/profile')

/* GET profile page */
router.get('/', profileController.get)

/* POST profile page */

router.post('/', profileController.post)

module.exports = router