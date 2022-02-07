const { User, Class, Seat } = require('../models')
const { Op } = require("sequelize");
class classController {
    static async addClass(req, res, next) {
        try {
            const library = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            const { rows, columns } = req.body
            const createdClass = await Class.create({ rows: Number(rows), columns: Number(columns) })
            for (let i = 1; i <= Number(rows); i++) {
                for (let j = 0; j < Number(columns); j++) {
                    let seats = `${library[j]}${i}`
                    console.log(seats)
                    await Seat.create({ classId: createdClass.id, seats })
                }
            }
            res.status(201).json({ message: 'Success create Class' })
        } catch (err) {
            next(err)
        }
    }

    static async checkIn(req, res, next) {
        try {
            const { role } = req.user
            const { classId } = req.params
            let output;
            if (role === 'admin') {
                output = await Class.findOne({
                    where: {
                        id: classId
                    }, attributes: [['id', 'class_id'],'rows', 'columns', ['teacherId','teacher']]
                })
                let occupied_seats = await Seat.findAll({where: {
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
            } else if (role === 'pengajar') {
                let isSeated = await Class.findOne({where: {id: classId, teacherId: req.user.id}})
                if (isSeated) throw {name: 'PENGAJAR_ALREADY_SEATED'}
                await Class.update({teacherId: req.user.id},{where: {id: classId}})
                output = await Class.findOne({
                    where: {
                        id: classId
                    }, attributes: [['id', 'class_id'],'rows', 'columns', ['teacherId','teacher']]
                })
                // console.log(output)
                let occupied_seats = await Seat.findAll({where: {
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
            } else if (role === 'student') {
                const {rows, columns} = await Class.findOne({where: {id: classId}})
                const library = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                let isSeated = await Seat.findOne({where: {classId, studentId: req.user.id}})
                if (isSeated) throw {name: 'STUDENT_ALREADY_SEATED'}
                for (let i = 1; i <= rows; i++) {
                    let seats = '';
                    let isExist;
                    for (let j = 0; j < columns; j++) {
                        if (!isExist) {
                            seats = `${library[j]}${i}`
                            isExist = await Seat.findOne({where: {seats, studentId: {
                                [Op.is]: null
                            }}})
                        }
                    }
                    if (isExist) {
                        await Seat.update({studentId: req.user.id}, {where: {seats}})
                        var message = {message: `Hi ${req.user.name}, your seat is ${seats}`}
                        i = rows
                    }
                }

                output = await Class.findOne({
                    where: {
                        id: classId
                    }, attributes: [['id', 'class_id'],'rows', 'columns', ['teacherId','teacher']]
                })

                let occupied_seats = await Seat.findAll({where: {
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
                output.dataValues.message = message
            }
            res.status(200).json(output)
        } catch (err) {
            next(err)
        }
    }

    static checkOut(req, res, next) {
        
    }
}

module.exports = classController