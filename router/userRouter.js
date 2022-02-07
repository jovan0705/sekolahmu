const router = require('express').Router()
const userController = require('../controller/userController')

router.post('/login', userController.login)
router.post('/register', userController.registerUser)


module.exports = router