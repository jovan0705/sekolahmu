const router = require('express').Router()
const userController = require('../controller/userController')
const { authentication } = require('../middlewares/authentication')

router.post('/login', userController.login)
router.post('/register', userController.registerUser)
router.use(authentication)


module.exports = router