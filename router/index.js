const router = require('express').Router()
const errorHandler = require('../middlewares/errorHandler')
const classRouter = require('./classRouter')
const userRouter = require('./userRouter')

router.use('/user', userRouter)
router.use('/class', classRouter)
router.use(errorHandler)

module.exports = router