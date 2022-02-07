const { User, Class, Seat } = require('../models')
const { Op } = require("sequelize");
const fetchClass = require('../helpers/fetchClass');
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
                output = await fetchClass(classId)
            } else if (role === 'pengajar') {
                let isSeated = await Class.findOne({ where: { id: classId } })
                if (!isSeated) {
                    throw { name: "CLASS_DOES_NOT_EXIST" }
                }
                let message = ''
                if (isSeated.teacherId) {
                    if (isSeated.teacherId !== req.user.id) {
                        message = `Another teacher is teaching..`
                        output = await fetchClass(classId, message)
                        if (output.name) {
                            throw output
                        }
                    } else {
                        message = `You're already seated`
                        output = await fetchClass(classId, message)
                        if (output.name) {
                            throw output
                        }
                    }
                } else {
                    await Class.update({ teacherId: req.user.id }, { where: { id: classId } })
                    message = `Teacher going in...`
                    output = await fetchClass(classId, message)
                    if (output.name) {
                        throw output
                    }
                }
            } else if (role === 'student') {
                const { rows, columns } = await Class.findOne({ where: { id: classId } })
                const library = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                let isSeated = await Seat.findOne({ where: { classId, studentId: req.user.id } })
                if (isSeated) {
                    message = `You're already seated`
                    output = await fetchClass(classId, message)
                    if (output.name) {
                        throw output
                    }
                }
                for (let i = 1; i <= rows; i++) {
                    let seats = '';
                    let isExist;
                    for (let j = 0; j < columns; j++) {
                        if (!isExist) {
                            seats = `${library[j]}${i}`
                            isExist = await Seat.findOne({
                                where: {
                                    seats, studentId: {
                                        [Op.is]: null
                                    }
                                }
                            })
                        }
                    }
                    if (isExist) {
                        await Seat.update({ studentId: req.user.id }, { where: { seats } })
                        var message = `Hi ${req.user.name}, your seat is ${seats}`
                        i = rows
                    } else {
                        var message = `Hi ${req.user.name}, the class is fully seated`
                        i = rows
                    }
                }

                output = await fetchClass(classId, message)
                if (output.name) {
                    throw output
                }
            }
            res.status(200).json(output)
        } catch (err) {
            next(err)
        }
    }

    static async checkOut(req, res, next) {
        try {
            const { role } = req.user
            const { classId } = req.params
            let output;
            if (role === 'admin') {
                output = await fetchClass(classId)
            } else if (role === 'pengajar') {
                let isSeated = await Class.findOne({ where: { id: classId } })
                let message = ''
                if (!isSeated) {
                    throw { name: "CLASS_DOES_NOT_EXIST" }
                }
                if (isSeated.teacherId) {
                    if (isSeated.teacherId !== req.user.id) {
                        message = `Another teacher is teaching..`
                        output = await fetchClass(classId, message)
                        if (output.name) {
                            throw output
                        }
                    } else {
                        await Class.update({ teacherId: null }, { where: { id: classId } })

                        message = `Teacher getting out...`

                        output = await fetchClass(classId, message)
                        if (output.name) {
                            throw output
                        }
                    }
                } else {
                    message = `Teacher haven't checked-in`

                    output = await fetchClass(classId, message)
                    if (output.name) {
                        throw output
                    }
                }
            } else if (role === 'student') {
                let isSeated = await Seat.findOne({ where: { classId, studentId: req.user.id } })
                let message = ''
                if (!isSeated) {
                    message = `Hi ${req.user.name}, you are not seated yet`
                    output = await fetchClass(classId, message)
                } else {
                    await Seat.update({ studentId: null }, { where: { classId, studentId: req.user.id } })
                    message = `Hi ${req.user.name}, ${isSeated.seats} is now available for other students`
                    output = await fetchClass(classId, message)
                    if (output.name) {
                        throw output
                    }
                }
            }
            res.status(200).json(output)
        } catch (err) {
            next(err)
        }
    }

    static async getClassList(req, res, next) {
        try {
            let output = await Class.findAll({ attributes: [['id', 'class_id'], 'rows', 'columns', ['teacherId', 'teacher']] })
            output.forEach(el => {
                if (el.dataValues.teacher) {
                    el.dataValues.teacher = 'in'
                } else {
                    el.dataValues.teacher = 'out'
                }
            })
            res.status(200).json(output)
        } catch (err) {
            next(err)
        }
    }

    static async getClassDetail(req, res, next) {
        try {
            const { classId } = req.params
            const output = await fetchClass(classId)
            if (output.name) {
                throw output
            }
            res.status(200).json(output)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = classController