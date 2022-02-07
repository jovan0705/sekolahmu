const {User} = require('../models')
const { toPayload } = require("../helpers/jwt")

const authentication = async (req, res, next) => {
    try {
        const {access_token} = req.headers
        const payload = await toPayload(access_token)
        const checkUser = await User.findOne({where: {
            id: payload.id
        }})
        if(!checkUser) {
            throw {name: 'USER_UNAUTHORIZED'}
        }
        req.user = {
            id:checkUser.id,
            email:checkUser.email,
            role:checkUser.role
        }
        next()
    } catch (err) {
        next(err)
    }

}

module.exports = {
    authentication
}