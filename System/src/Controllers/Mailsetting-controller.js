const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
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
async function GetActiveMailsetting(req, res, next) {

    try {
        const mailsetting = await db.mailsettingModel.findOne({ where: { Issettingactive: true } });
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
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isString(User)) {
        validationErrors.push(messages.VALIDATION_ERROR.USER_REQUIRED)
    }
    if (!validator.isString(Password)) {
        validationErrors.push(messages.VALIDATION_ERROR.PASSWORD_REQUIRED)
    }
    if (!validator.isString(Smtphost)) {
        validationErrors.push(messages.VALIDATION_ERROR.SMTPHOST_REQUIRED)
    }
    if (!validator.isString(Smtpport)) {
        validationErrors.push(messages.VALIDATION_ERROR.SMTPPORT_REQUIRED)
    }
    if (!validator.isString(Mailaddress)) {
        validationErrors.push(messages.VALIDATION_ERROR.MAILADDRESS_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let mailsettinguuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.mailsettingModel.create({
            ...req.body,
            Uuid: mailsettinguuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: 'Mail Ayarları',
            role: 'mailsettingnotification',
            message: `${Name} mail ayarı ${username} tarafından Oluşturuldu.`,
            pushurl: '/Mailsettings'
        })
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
        Uuid
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isString(User)) {
        validationErrors.push(messages.VALIDATION_ERROR.USER_REQUIRED)
    }
    if (!validator.isString(Password)) {
        validationErrors.push(messages.VALIDATION_ERROR.PASSWORD_REQUIRED)
    }
    if (!validator.isString(Smtphost)) {
        validationErrors.push(messages.VALIDATION_ERROR.SMTPHOST_REQUIRED)
    }
    if (!validator.isString(Smtpport)) {
        validationErrors.push(messages.VALIDATION_ERROR.SMTPPORT_REQUIRED)
    }
    if (!validator.isString(Mailaddress)) {
        validationErrors.push(messages.VALIDATION_ERROR.MAILADDRESS_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.MAILSETTINGID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_MAILSETTINGID)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

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
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Mail Ayarları',
            role: 'mailsettingnotification',
            message: `${Name} mail ayarı ${username} tarafından Güncellendi.`,
            pushurl: '/Mailsettings'
        })
        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetMailsettings(req, res, next)
}

async function DeleteMailsetting(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.mailsettingId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.CASEID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_CASEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const mailsetting = await db.mailsettingModel.findOne({ where: { Uuid: Uuid } })
        if (!mailsetting) {
            return next(createNotfounderror([messages.ERROR.MAILSETTING_NOT_FOUND], req.language))
        }
        if (!mailsetting.Isactive) {
            return next(createAccessDenied([messages.ERROR.MAILSETTING_NOT_ACTIVE], req.language))
        }

        await db.mailsettingModel.destroy({ where: { Uuid: Uuid }, transaction: t });

        await CreateNotification({
            type: types.Delete,
            service: 'Mail Ayarları',
            role: 'mailsettingnotification',
            message: `${mailsetting?.Name} mail ayarı ${username} tarafından Silindi.`,
            pushurl: '/Mailsettings'
        })
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
    GetActiveMailsetting
}