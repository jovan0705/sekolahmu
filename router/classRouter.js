const router = require('express').Router()
const classController = require('../controller/classController')
const { authentication } = require('../middlewares/authentication')
const { adminAuthorization } = require('../middlewares/authorization')

router.use(authentication)
router.get('/', classController.getClassList)
router.post('/add', adminAuthorization, classController.addClass)
router.get('/detail/:classId', classController.getClassDetail)
router.put('/checkIn/:classId', classController.checkIn)
router.put('/checkout/:classId', classController.checkOut)
module.exports = router