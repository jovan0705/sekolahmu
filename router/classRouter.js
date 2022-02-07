const router = require('express').Router()
const classController = require('../controller/classController')
const { authentication } = require('../middlewares/authentication')
const { adminAuthorization } = require('../middlewares/authorization')

router.use(authentication)
router.post('/add', adminAuthorization, classController.addClass)
router.post('/checkIn/:classId', classController.checkIn)
module.exports = router