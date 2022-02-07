const {Op} = require('sequelize')
const { User, Class, Seat } = require('../models')

const fetchClass = async (classId, message) => {
    try {
        let output = await Class.findOne({
            where: {
                id: classId
            }, attributes: [['id', 'class_id'],'rows', 'columns', ['teacherId','teacher']]
        })
        
        if (!output) {
            throw {name: 'CLASS_DOES_NOT_EXIST'}
        }
    
        let occupied_seats = await Seat.findAll({where: {
            classId,
            studentId: {
                [Op.not]: null
            }
        }, attributes: [['seats', 'seat'], 'studentId']
    })
    await occupied_seats.forEach(async (el, index) => {
        let student = await User.findOne({where: {id: el.studentId}})
        delete occupied_seats[index].dataValues.studentId
        occupied_seats[index].dataValues.student_name = student.name
    })
        let available_seats = await Seat.findAll({where: {
            classId,
            studentId: {
                [Op.is]: null
            }
        }})
        let tempSeat = []
        available_seats.forEach(el => {
            tempSeat.push(el.seats)
        })
        if (output.dataValues.teacher) {
            output.dataValues.teacher = 'in'
        } else {
            output.dataValues.teacher = 'out'
        }
        output.dataValues.available_seats = tempSeat
        output.dataValues.occupied_seats = occupied_seats
        if (message) {
            output.dataValues.message = message
        }
        return output
    } catch (err) {
        return err
    }
}

module.exports = fetchClass