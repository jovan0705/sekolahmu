const {User} = require('../models')
const {comparePassword} = require('../helpers/bcrypt')
const {createToken} = require('../helpers/jwt')
class userController {
    static async registerUser(req, res, next) {
        try {
            const {name, email, password, role} = req.body
            if (role !== 'pengajar' && role !== 'student' && role !== 'admin') {
                throw { name: 'ROLE_INVALID' }
            } else {
            await User.create({name, email, password, role})
            const registeredUser = await User.findOne({where: {email}, attributes: {exclude: ['password', 'createdAt', 'updatedAt']}})
                res.status(201).json(registeredUser) 
            }
        } catch (err) {
            next(err)
        }
    }

    static async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const loginUser = await User.findOne({where: {
                email
            }})
            if (!loginUser) throw {name: 'unauthorized'}
            
            const isValid = await comparePassword(password, loginUser.password)
            if (!isValid) throw {name: 'unauthorized'}
    
            let payload = {
                id: loginUser.id,
                email: loginUser.email,
                role: loginUser.role
            }
            let access_token = await createToken(payload)
            res.status(200).json({access_token})
        } catch (err) {
            next(err)
        }
    }
}

module.exports = userController