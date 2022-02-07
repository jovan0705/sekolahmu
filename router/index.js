const router = require('express').Router()
const classRouter = require('./classRouter')
const userRouter = require('./userRouter')

router.use('/user', userRouter)
router.use('/class', classRouter)

module.exports = router