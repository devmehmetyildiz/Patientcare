const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetMailsettings(req, res, next) {
    try {
        const mailsettings = await db.mailsettingModel.findAll({ where: { Isactive: true } })
        res.status(200).json(mailsettings)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetMailsetting(req, res, next) {

    let validationErrors = []
    if (!req.params.mailsettingId) {
        validationErrors.push(messages.VALIDATION_ERROR.MAILSETTINGID_REQUIRED)
    }
    if (!validator.isUUID(req.params.mailsettingId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_MAILSETTINGID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const mailsetting = await db.mailsettingModel.findOne({ where: { Uuid: req.params.mailsettingId } });
        if (!mailsetting) {
            return next(createNotfounderror([messages.ERROR.MAILSETTING_NOT_FOUND], req.language))
        }
        if (!mailsetting.Isactive) {
            return next(createNotfounderror([messages.ERROR.MAILSETTING_NOT_ACTIVE], req.language))
        }
        res.status(200).json(mailsetting)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddMailsetting(req, res, next) {

    let validationErrors = []
    const {
        Name,
        User,
        Password,
        Smtphost,
        Smtpport,
        Mailaddress,
        Isbodyhtml,
        Issettingactive,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
    }
    if (!validator.isString(User)) {
        validationErrors.push(messages.VALIDATION_ERROR.USER_REQUIRED, req.language)
    }
    if (!validator.isString(Password)) {
        validationErrors.push(messages.VALIDATION_ERROR.PASSWORD_REQUIRED, req.language)
    }
    if (!validator.isString(Smtphost)) {
        validationErrors.push(messages.VALIDATION_ERROR.SMTPHOST_REQUIRED, req.language)
    }
    if (!validator.isString(Smtpport)) {
        validationErrors.push(messages.VALIDATION_ERROR.SMTPPORT_REQUIRED, req.language)
    }
    if (!validator.isString(Mailaddress)) {
        validationErrors.push(messages.VALIDATION_ERROR.MAILADDRESS_REQUIRED, req.language)
    }
    if (!validator.isBoolean(Isbodyhtml)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISBODYHTML_REQUIRED, req.language)
    }
    if (!validator.isBoolean(Issettingactive)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISSETTINGACTIVE_REQUIRED, req.language)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let mailsettinguuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.mailsettingModel.create({
            ...req.body,
            Uuid: mailsettinguuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetMailsettings(req, res, next)
}

async function UpdateMailsetting(req, res, next) {

    let validationErrors = []
    const {
        Name,
        User,
        Password,
        Smtphost,
        Smtpport,
        Mailaddress,
        Isbodyhtml,
        Issettingactive,
        Uuid
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
    }
    if (!validator.isString(User)) {
        validationErrors.push(messages.VALIDATION_ERROR.USER_REQUIRED, req.language)
    }
    if (!validator.isString(Password)) {
        validationErrors.push(messages.VALIDATION_ERROR.PASSWORD_REQUIRED, req.language)
    }
    if (!validator.isString(Smtphost)) {
        validationErrors.push(messages.VALIDATION_ERROR.SMTPHOST_REQUIRED, req.language)
    }
    if (!validator.isString(Smtpport)) {
        validationErrors.push(messages.VALIDATION_ERROR.SMTPPORT_REQUIRED, req.language)
    }
    if (!validator.isString(Mailaddress)) {
        validationErrors.push(messages.VALIDATION_ERROR.MAILADDRESS_REQUIRED, req.language)
    }
    if (!validator.isBoolean(Isbodyhtml)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISBODYHTML_REQUIRED, req.language)
    }
    if (!validator.isBoolean(Issettingactive)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISSETTINGACTIVE_REQUIRED, req.language)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.MAILSETTINGID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_MAILSETTINGID, req.language)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const mailsetting = await db.mailsettingModel.findOne({ where: { Uuid: Uuid } })
        if (!mailsetting) {
            return next(createNotfounderror([messages.ERROR.MAILSETTING_NOT_FOUND], req.language))
        }
        if (!mailsetting.Isactive) {
            return next(createAccessDenied([messages.ERROR.MAILSETTING_NOT_ACTIVE], req.language))
        }

        await db.mailsettingModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetMailsettings(req, res, next)
}

async function DeleteMailsetting(req, res, next) {

    let validationErrors = []
    const {
        Uuid
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.CASEID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_CASEID, req.language)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const mailsetting = await db.mailsettingModel.findOne({ where: { Uuid: Uuid } })
        if (!mailsetting) {
            return next(createNotfounderror([messages.ERROR.MAILSETTING_NOT_FOUND], req.language))
        }
        if (!mailsetting.Isactive) {
            return next(createAccessDenied([messages.ERROR.MAILSETTING_NOT_ACTIVE], req.language))
        }

        await db.mailsettingModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetMailsettings(req, res, next)
}

module.exports = {
    GetMailsettings,
    GetMailsetting,
    AddMailsetting,
    UpdateMailsetting,
    DeleteMailsetting,
}