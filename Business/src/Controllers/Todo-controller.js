const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const { Op } = require('sequelize');

async function GetTodos(req, res, next) {
    try {
        const todos = await db.todoModel.findAll({ where: { Isactive: true } })
        res.status(200).json(todos)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetTodosbyPatientID(req, res, next) {

    let validationErrors = []
    if (!req.params.patientId) {
        validationErrors.push(messages.VALIDATION_ERROR.TODOID_REQUIRED)
    }
    if (!validator.isUUID(req.params.patientId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_TODOID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const movements = await db.patientmovementModel.findAll({ where: { Isactive: true, PatientID: req.params.patientId } })
        const todos = await db.todoModel.findAll({
            where: {
                Isactive: true,
                MovementID: {
                    [Op.in]: (movements || []).map(u => { return u.Uuid })
                }
            }
        })
        res.status(200).json(todos)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}


async function GetTodo(req, res, next) {

    let validationErrors = []
    if (!req.params.todoId) {
        validationErrors.push(messages.VALIDATION_ERROR.TODOID_REQUIRED)
    }
    if (!validator.isUUID(req.params.todoId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_TODOID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const todo = await db.todoModel.findOne({ where: { Uuid: req.params.caseId } });
        if (!todo) {
            return createNotfounderror([messages.ERROR.TODO_NOT_FOUND])
        }
        if (!todo.Isactive) {
            return createNotfounderror([messages.ERROR.TODO_NOT_ACTIVE])
        }
        res.status(200).json(todo)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddTodo(req, res, next) {

    let validationErrors = []
    const {
        MovementID,
        TododefineID,
        Checktime,
    } = req.body

    if (!validator.isUUID(MovementID)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTID_REQUIRED)
    }
    if (!validator.isUUID(TododefineID)) {
        validationErrors.push(messages.VALIDATION_ERROR.TODODEFINEID_REQUIRED)
    }
    if (!validator.isString(Checktime)) {
        validationErrors.push(messages.VALIDATION_ERROR.CHECKTIME_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let todouuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.todoModel.create({
            ...req.body,
            Uuid: todouuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetTodos(req, res, next)
}

async function AddPatienttodolist(req, res, next) {
    const body = req.body

    try {
        let validationErrors = []

        if (!validator.isUUID(body.PatientID)) {
            validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
        }

        for (const data of body.Todos) {
            const {
                TododefineID,
                Checktime,
            } = data

            if (!validator.isUUID(TododefineID)) {
                validationErrors.push(messages.VALIDATION_ERROR.TODODEFINEID_REQUIRED)
            }

            if (!validator.isString(Checktime)) {
                validationErrors.push(messages.VALIDATION_ERROR.CHECKTIME_REQUIRED)
            }
        }
        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.language))
        }
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }



    let movementuuid = uuid()

    const t = await db.sequelize.transaction();
    try {
        const PatientID = body.PatientID
        const lastpatientmovement = await db.patientmovementModel.findOne({
            order: [['Id', 'DESC']],
            where: {
                PatientID: PatientID
            }
        });

        await db.patientmovementModel.create({
            Uuid: movementuuid,
            OldPatientmovementtype: lastpatientmovement?.Patientmovementtype || 0,
            Patientmovementtype: 5,
            NewPatientmovementtype: 5,
            Createduser: "System",
            Createtime: new Date(),
            PatientID: PatientID,
            Movementdate: new Date(),
            IsDeactive: false,
            IsTodoneed: true,
            IsTodocompleted: false,
            IsComplated: false,
            Iswaitingactivation: false,
            Isactive: true
        }, { transaction: t })


        for (const data of body.Todos) {

            let todouuid = uuid()
            await db.todoModel.create({
                ...data,
                PatientID: body.PatientID,
                MovementID: movementuuid,
                Uuid: todouuid,
                Createduser: "System",
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
        }


        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }

    GetTodos(req, res, next)
}

async function UpdateTodo(req, res, next) {

    let validationErrors = []
    const {
        MovementID,
        TododefineID,
        Checktime,
        Uuid
    } = req.body

    if (!validator.isUUID(MovementID)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTID_REQUIRED)
    }
    if (!validator.isUUID(TododefineID)) {
        validationErrors.push(messages.VALIDATION_ERROR.TODODEFINEID_REQUIRED)
    }
    if (!validator.isString(Checktime)) {
        validationErrors.push(messages.VALIDATION_ERROR.CHECKTIME_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.TODOID_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const todo = db.todoModel.findOne({ where: { Uuid: Uuid } })
        if (!todo) {
            return next(createNotfounderror([messages.ERROR.TODO_NOT_FOUND], req.language))
        }
        if (todo.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.TODO_NOT_ACTIVE], req.language))
        }

        await db.todoModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetTodos(req, res, next)
}

async function ApproveTodo(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.todoId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.TODOID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_TODOID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const todo = await db.todoModel.findOne({ where: { Uuid: Uuid } })
        if (!todo) {
            return next(createNotfounderror([messages.ERROR.TODO_NOT_FOUND], req.language))
        }
        if (todo.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.TODO_NOT_ACTIVE], req.language))
        }

        await db.todoModel.update({
            ...todo,
            Isapproved: true,
            IsCompleted: true,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })
        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetTodos(req, res, next)
}

async function ApproveTodos(req, res, next) {

    let validationErrors = []
    const body = req.body

    const t = await db.sequelize.transaction();
    try {
        for (const data of body) {
            if (!data) {
                validationErrors.push(messages.VALIDATION_ERROR.TODOID_REQUIRED)
            }
            if (!validator.isUUID(data)) {
                validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_TODOID)
            }
            if (validationErrors.length > 0) {
                return next(createValidationError(validationErrors, req.language))
            }

            const todo = await db.todoModel.findOne({ where: { Uuid: data } })
            if (!todo) {
                return next(createNotfounderror([messages.ERROR.TODO_NOT_FOUND], req.language))
            }
            if (todo.Isactive === false) {
                return next(createAccessDenied([messages.ERROR.TODO_NOT_ACTIVE], req.language))
            }

            await db.todoModel.update({
                ...todo,
                Isapproved: true,
                IsCompleted: true,
                Updateduser: "System",
                Updatetime: new Date(),
            }, { where: { Uuid: data } }, { transaction: t })
        }
        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetTodos(req, res, next)
}

async function DeleteTodo(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.todoId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.TODOID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_TODOID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const todo = db.todoModel.findOne({ where: { Uuid: Uuid } })
        if (!todo) {
            return next(createNotfounderror([messages.ERROR.TODO_NOT_FOUND], req.language))
        }
        if (todo.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.TODO_NOT_ACTIVE], req.language))
        }

        await db.todoModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetTodos(req, res, next)
}

module.exports = {
    GetTodos,
    GetTodo,
    AddTodo,
    UpdateTodo,
    DeleteTodo,
    AddPatienttodolist,
    GetTodosbyPatientID,
    ApproveTodo,
    ApproveTodos
}