const router = require('express').Router()
const classController = require('../controller/classController')
const { authentication } = require('../middlewares/authentication')

router.use(authentication)

module.exports = router