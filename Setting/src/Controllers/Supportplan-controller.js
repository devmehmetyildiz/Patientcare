const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetSupportplans(req, res, next) {
    try {
        const supportplans = await db.supportplanModel.findAll()
        res.status(200).json(supportplans)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetSupportplan(req, res, next) {

    let validationErrors = []
    if (!req.params.supportplanId) {
        validationErrors.push(messages.VALIDATION_ERROR.SUPPORTPLANID_REQUIRED)
    }
    if (!validator.isUUID(req.params.supportplanId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_SUPPORTPLANID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const supportplan = await db.supportplanModel.findOne({ where: { Uuid: req.params.supportplanId } });
        res.status(200).json(supportplan)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddSupportplan(req, res, next) {

    let validationErrors = []
    const {
        Name,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let supportplanuuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.supportplanModel.create({
            ...req.body,
            Uuid: supportplanuuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetSupportplans(req, res, next)
}

async function UpdateSupportplan(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Uuid,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.SUPPORTPLANID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_SUPPORTPLANID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const supportplan = db.supportplanModel.findOne({ where: { Uuid: Uuid } })
        if (!supportplan) {
            return next(createNotfounderror([messages.ERROR.SUPPORTPLAN_NOT_FOUND], req.language))
        }
        if (supportplan.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.SUPPORTPLAN_NOT_ACTIVE], req.language))
        }

        await db.supportplanModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetSupportplans(req, res, next)
}

async function DeleteSupportplan(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.supportplanId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.SUPPORTPLANID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_SUPPORTPLANID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const supportplan = db.supportplanModel.findOne({ where: { Uuid: Uuid } })
        if (!supportplan) {
            return next(createNotfounderror([messages.ERROR.SUPPORTPLAN_NOT_FOUND], req.language))
        }
        if (supportplan.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.SUPPORTPLAN_NOT_ACTIVE], req.language))
        }

        await db.supportplanModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetSupportplans(req, res, next)
}

module.exports = {
    GetSupportplans,
    GetSupportplan,
    AddSupportplan,
    UpdateSupportplan,
    DeleteSupportplan,
}