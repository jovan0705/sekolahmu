const bcrypt = require('bcryptjs')

const makePassword = (password) => {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    return hash
}

const comparePassword = (password, hashPassword) => {
    const isValid = bcrypt.compareSync(password, hashPassword)
    return isValid
}

module.exports = {makePassword, comparePassword}