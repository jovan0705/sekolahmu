
const adminAuthorization = async(req, res, next) => {
    const {role} = req.user
    try {
        if (role !== 'admin') {
            throw {name: 'NOT_ADMIN'}
        } else {
            next()
        }
    } catch (err) {
        next(err)
    }
}


module.exports = {adminAuthorization}