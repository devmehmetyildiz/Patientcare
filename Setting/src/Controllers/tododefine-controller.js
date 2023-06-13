const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetTododefines(req, res, next) {
    try {
        const tododefines = await db.tododefineModel.findAll({ where: { Isactive: true } })
        for (const tododefine of tododefines) {
            let perioduuids = await db.tododefineperiodModel.findAll({
                where: {
                    TododefineID: tododefine.Uuid,
                }
            });
            tododefine.Periods = await db.periodModel.findAll({
                where: {
                    Uuid: perioduuids.map(u => { return u.PeriodID })
                }
            })
        }
        res.status(200).json(tododefines)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function GetTododefine(req, res, next) {

    let validationErrors = []
    if (!req.params.tododefineId) {
        validationErrors.push(messages.VALIDATION_ERROR.TODODEFINEID_REQUIRED)
    }
    if (!validator.isUUID(req.params.tododefineId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_TODODEFINEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const tododefine = await db.tododefineModel.findOne({ where: { Uuid: req.params.tododefineId } });
        let perioduuids = await db.tododefineperiodModel.findAll({
            where: {
                TododefineID: tododefine.Uuid,
            }
        });
        tododefine.Periods = await db.periodModel.findAll({
            where: {
                Uuid: perioduuids.map(u => { return u.PeriodID })
            }
        })
        res.status(200).json(tododefine)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function AddTododefine(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Info,
        IsRequired,
        IsNeedactivation,
        Periods
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isString(Info)) {
        validationErrors.push(messages.VALIDATION_ERROR.INFO_REQUIRED)
    }
    if (!validator.isBoolean(IsRequired)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISREQUIRED_REQUIRED)
    }
    if (!validator.isBoolean(IsNeedactivation)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISNEEDACTIVATION_REQUIRED)
    }
    if (!validator.isArray(Periods)) {
        validationErrors.push(messages.VALIDATION_ERROR.PERIODS_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let tododefineuuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.tododefineModel.create({
            ...req.body,
            Uuid: tododefineuuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        for (const period of Periods) {
            if (!period.Uuid || !validator.isUUID(period.Uuid)) {
                return next(createValidationError(messages.VALIDATION_ERROR.UNSUPPORTED_PERIODID, req.language))
            }
            await db.tododefineperiodModel.create({
                TododefineID: tododefineuuid,
                PeriodID: period.Uuid
            }, { transaction: t });
        }

        await t.commit()
        const tododefines = await db.tododefineModel.findAll({ where: { Isactive: true } })
        for (const tododefine of tododefines) {
            let perioduuids = await db.tododefineperiodModel.findAll({
                where: {
                    TododefineID: tododefine.Uuid,
                }
            });
            tododefine.Periods = await db.periodModel.findAll({
                where: {
                    Uuid: perioduuids.map(u => { return u.PeriodID })
                }
            })
        }
        res.status(200).json(tododefines)
    } catch (err) {
        await t.rollback()
        next(sequelizeErrorCatcher(err))
    }
}

async function UpdateTododefine(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Uuid,
        Info,
        IsRequired,
        IsNeedactivation,
        Periods
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isString(Info)) {
        validationErrors.push(messages.VALIDATION_ERROR.INFO_REQUIRED)
    }
    if (!validator.isBoolean(IsRequired)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISREQUIRED_REQUIRED)
    }
    if (!validator.isBoolean(IsNeedactivation)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISNEEDACTIVATION_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.TODODEFINEID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_TODODEFINEID)
    }
    if (!validator.isArray(Periods)) {
        validationErrors.push(messages.VALIDATION_ERROR.PERIODS_REQUIRED)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const tododefine = db.tododefineModel.findOne({ where: { Uuid: Uuid } })
        if (!tododefine) {
            return next(createNotfounderror([messages.ERROR.TODODEFINE_NOT_FOUND], req.language))
        }
        if (tododefine.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.TODODEFINE_NOT_ACTIVE], req.language))
        }

        const t = await db.sequelize.transaction();

        await db.tododefineModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await db.tododefineperiodModel.destroy({ where: { TododefineID: Uuid }, transaction: t });
        for (const period of Periods) {
            if (!period.Uuid || !validator.isUUID(period.Uuid)) {
                return next(createValidationError(messages.VALIDATION_ERROR.UNSUPPORTED_PERIODID, req.language))
            }
            await db.tododefineperiodModel.create({
                TododefineID: Uuid,
                PeriodID: period.Uuid
            }, { transaction: t });
        }
        await t.commit()
        const tododefines = await db.tododefineModel.findAll({ where: { Isactive: true } })
        for (const tododefine of tododefines) {
            let perioduuids = await db.tododefineperiodModel.findAll({
                where: {
                    TododefineID: tododefine.Uuid,
                }
            });
            tododefine.Periods = await db.periodModel.findAll({
                where: {
                    Uuid: perioduuids.map(u => { return u.PeriodID })
                }
            })
        }
        res.status(200).json(tododefines)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }


}

async function DeleteTododefine(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.tododefineId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.TODODEFINEID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_TODODEFINEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const tododefine = db.tododefineModel.findOne({ where: { Uuid: Uuid } })
        if (!tododefine) {
            return next(createNotfounderror([messages.ERROR.TODODEFINE_NOT_FOUND], req.language))
        }
        if (tododefine.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.TODODEFINE_NOT_ACTIVE], req.language))
        }
        const t = await db.sequelize.transaction();

        await db.tododefineModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await db.tododefineperiodModel.destroy({ where: { TododefineID: Uuid }, transaction: t });
        await t.commit();
        const tododefines = await db.tododefineModel.findAll({ where: { Isactive: true } })
        for (const tododefine of tododefines) {
            let perioduuids = await db.tododefineperiodModel.findAll({
                where: {
                    TododefineID: tododefine.Uuid,
                }
            });
            tododefine.Periods = await db.periodModel.findAll({
                where: {
                    Uuid: perioduuids.map(u => { return u.PeriodID })
                }
            })
        }
        res.status(200).json(tododefines)
    } catch (error) {
        await t.rollback();
        next(sequelizeErrorCatcher(error))
    }

}

module.exports = {
    GetTododefines,
    GetTododefine,
    AddTododefine,
    UpdateTododefine,
    DeleteTododefine,
}