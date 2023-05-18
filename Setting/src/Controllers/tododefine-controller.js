const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetTododefines(req, res, next) {
    try {
        const tododefines = await db.tododefineModel.findAll({ where: { Isactive: true } })
        res.status(200).json(tododefines)
    } catch (error) {
        sequelizeErrorCatcher(error)
        next()
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
        res.status(200).json(tododefine)
    } catch (error) {
        sequelizeErrorCatcher(error)
        next()
    }
}


async function AddTododefine(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Info,
        IsRequired,
        IsNeedactivation
    } = req.body

    if (!Name || !validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
    }
    if (!Info || !validator.isString(Info)) {
        validationErrors.push(messages.VALIDATION_ERROR.INFO_REQUIRED, req.language)
    }
    if (!IsRequired || !validator.isBoolean(IsRequired)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISREQUIRED_REQUIRED, req.language)
    }
    if (!IsNeedactivation || !validator.isBoolean(IsNeedactivation)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISNEEDACTIVATION_REQUIRED, req.language)
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

        await t.commit()
        const createdTododefine = await db.tododefineModel.findOne({ where: { Uuid: tododefineuuid } })
        res.status(200).json(createdTododefine)
    } catch (err) {
        await t.rollback()
        sequelizeErrorCatcher(err)
        next()
    }
}

async function UpdateTododefine(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Uuid,
        Info,
        IsRequired,
        IsNeedactivation
    } = req.body

    if (!Name || !validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
    }
    if (!Info || !validator.isString(Info)) {
        validationErrors.push(messages.VALIDATION_ERROR.INFO_REQUIRED, req.language)
    }
    if (!IsRequired || !validator.isBoolean(IsRequired)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISREQUIRED_REQUIRED, req.language)
    }
    if (!IsNeedactivation || !validator.isBoolean(IsNeedactivation)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISNEEDACTIVATION_REQUIRED, req.language)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.TODODEFINEID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_TODODEFINEID, req.language)
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

        await t.commit()
        const updatedTododefine = await db.tododefineModel.findOne({ where: { Uuid: Uuid } })
        res.status(200).json(updatedTododefine)
    } catch (error) {
        sequelizeErrorCatcher(error)
        next()
    }


}

async function DeleteTododefine(req, res, next) {

    let validationErrors = []
    const {
        Uuid
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.TODODEFINEID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_TODODEFINEID, req.language)
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
        await t.commit();

        res.status(200).json({ messages: "deleted", Uuid: Uuid })
    } catch (error) {
        await t.rollback();
        sequelizeErrorCatcher(error)
        next()
    }

}

module.exports = {
    GetTododefines,
    GetTododefine,
    AddTododefine,
    UpdateTododefine,
    DeleteTododefine,
}