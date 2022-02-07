
const errorHandler = (err, req, res, next) => {
    switch (err.name) {
        case 'SequelizeValidationError': {
            res.status(400).json({message: err.errors[0].message})
            break;
        }

        case 'SequelizeUniqueConstraintError': {
            res.status(400).json({message: "Email must be Unique"})
            break;
        }

        case 'ROLE_INVALID': {
            res.status(400).json({message: "Role is Invalid"})
            break;
        }
        
        case 'unauthorized': {
            res.status(401).json({message: 'invalid email/password'})
            break;
        }
    
        case 'USER_UNAUTHORIZED': {
            res.status(401).json({message: "Invalid Token"})
            break;
        }

        case 'NOT_ADMIN': {
            res.status(401).json({message: 'Unauthorized'})
            break;
        }

        case 'JsonWebTokenError': {
            res.status(401).json({message: "Invalid Token"})
            break;
        }
        
        default: {
            res.status(500).json(err)
            break;
        }
           
    }
}

module.exports = errorHandler