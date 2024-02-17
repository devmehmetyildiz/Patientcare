const messages = require("../Constants/HelpstatuMessages")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetHelpstatus(req, res, next) {
    try {
        const helpstatus = await db.helpstatuModel.findAll({ where: { Isactive: true } })
        res.status(200).json(helpstatus)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetHelpstatu(req, res, next) {

    let validationErrors = []
    if (!req.params.helpstatuId) {
        validationErrors.push(messages.VALIDATION_ERROR.HELPSTATUID_REQUIRED)
    }
    if (!validator.isUUID(req.params.helpstatuId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_HELPSTATUID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const helpstatu = await db.helpstatuModel.findOne({ where: { Uuid: req.params.helpstatuId } });
        if (!helpstatu) {
            return createNotfounderror([messages.ERROR.HELPSTATU_NOT_FOUND])
        }
        if (!helpstatu.Isactive) {
            return createNotfounderror([messages.ERROR.HELPSTATU_NOT_ACTIVE])
        }
        res.status(200).json(helpstatu)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddHelpstatu(req, res, next) {

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

    let helpstatuuuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.helpstatuModel.create({
            ...req.body,
            Uuid: helpstatuuuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetHelpstatus(req, res, next)
}

async function UpdateHelpstatu(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Uuid
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.HELPSTATUID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_HELPSTATUID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const helpstatu = db.helpstatuModel.findOne({ where: { Uuid: Uuid } })
        if (!helpstatu) {
            return next(createNotfounderror([messages.ERROR.HELPSTATU_NOT_FOUND], req.language))
        }
        if (helpstatu.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.HELPSTATU_NOT_ACTIVE], req.language))
        }

        await db.helpstatuModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetHelpstatus(req, res, next)
}

async function DeleteHelpstatu(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.helpstatuId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.HELPSTATUID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_HELPSTATUID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const helpstatu = db.helpstatuModel.findOne({ where: { Uuid: Uuid } })
        if (!helpstatu) {
            return next(createNotfounderror([messages.ERROR.HELPSTATU_NOT_FOUND], req.language))
        }
        if (helpstatu.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.HELPSTATU_NOT_ACTIVE], req.language))
        }
        const t = await db.sequelize.transaction();

        await db.helpstatuModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetHelpstatus(req, res, next)
}

module.exports = {
    GetHelpstatus,
    GetHelpstatu,
    AddHelpstatu,
    UpdateHelpstatu,
    DeleteHelpstatu,
}