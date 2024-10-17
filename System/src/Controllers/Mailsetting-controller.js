const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetMailsettings(req, res, next) {
    try {
        const mailsettings = await db.mailsettingModel.findAll()
        res.status(200).json(mailsettings)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetMailsetting(req, res, next) {

    let validationErrors = []
    if (!req.params.mailsettingId) {
        validationErrors.push(req.t('Mailsettings.Error.MailsettingIDRequired'))
    }
    if (!validator.isUUID(req.params.mailsettingId)) {
        validationErrors.push(req.t('Mailsettings.Error.UnsupportedMailsettingID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Mailsettings'), req.language))
    }

    try {
        const mailsetting = await db.mailsettingModel.findOne({ where: { Uuid: req.params.mailsettingId } });
        if (!mailsetting) {
            return next(createNotFoundError(req.t('Mailsettings.Error.NotFound'), req.t('Mailsettings'), req.language))
        }
        if (!mailsetting.Isactive) {
            return next(createNotFoundError(req.t('Mailsettings.Error.NotActive'), req.t('Mailsettings'), req.language))
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
            return next(createNotFoundError(req.t('Mailsettings.Error.NotFound'), req.t('Mailsettings'), req.language))
        }
        if (!mailsetting.Isactive) {
            return next(createNotFoundError(req.t('Mailsettings.Error.NotActive'), req.t('Mailsettings'), req.language))
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
        validationErrors.push(req.t('Mailsettings.Error.NameRequired'))
    }
    if (!validator.isString(User)) {
        validationErrors.push(req.t('Mailsettings.Error.UserRequired'))
    }
    if (!validator.isString(Password)) {
        validationErrors.push(req.t('Mailsettings.Error.PasswordRequired'))
    }
    if (!validator.isString(Smtphost)) {
        validationErrors.push(req.t('Mailsettings.Error.SmtphostRequired'))
    }
    if (!validator.isString(Smtpport)) {
        validationErrors.push(req.t('Mailsettings.Error.SmtpportRequired'))
    }
    if (!validator.isString(Mailaddress)) {
        validationErrors.push(req.t('Mailsettings.Error.MailaddressRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Mailsettings'), req.language))
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
            service: req.t('Mailsettings'),
            role: 'mailsettingnotification',
            message: {
                tr: `${Name} Mail Ayarı ${username} tarafından Oluşturuldu.`,
                en: `${Name} Mail Setting Created by ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Mailsettings.Error.NameRequired'))
    }
    if (!validator.isString(User)) {
        validationErrors.push(req.t('Mailsettings.Error.UserRequired'))
    }
    if (!validator.isString(Password)) {
        validationErrors.push(req.t('Mailsettings.Error.PasswordRequired'))
    }
    if (!validator.isString(Smtphost)) {
        validationErrors.push(req.t('Mailsettings.Error.SmtphostRequired'))
    }
    if (!validator.isString(Smtpport)) {
        validationErrors.push(req.t('Mailsettings.Error.SmtpportRequired'))
    }
    if (!validator.isString(Mailaddress)) {
        validationErrors.push(req.t('Mailsettings.Error.MailaddressRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Mailsettings.Error.MailsettingIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Mailsettings.Error.UnsupportedMailsettingID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Mailsettings'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const mailsetting = await db.mailsettingModel.findOne({ where: { Uuid: Uuid } })
        if (!mailsetting) {
            return next(createNotFoundError(req.t('Mailsettings.Error.NotFound'), req.t('Mailsettings'), req.language))
        }
        if (!mailsetting.Isactive) {
            return next(createNotFoundError(req.t('Mailsettings.Error.NotActive'), req.t('Mailsettings'), req.language))
        }

        await db.mailsettingModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Mailsettings'),
            role: 'mailsettingnotification',
            message: {
                tr: `${Name} Mail Ayarı ${username} tarafından Güncellendi.`,
                en: `${Name} Mail Setting Updated by ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Mailsettings.Error.MailsettingIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Mailsettings.Error.UnsupportedMailsettingID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Mailsettings'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const mailsetting = await db.mailsettingModel.findOne({ where: { Uuid: Uuid } })
        if (!mailsetting) {
            return next(createNotFoundError(req.t('Mailsettings.Error.NotFound'), req.t('Mailsettings'), req.language))
        }
        if (!mailsetting.Isactive) {
            return next(createNotFoundError(req.t('Mailsettings.Error.NotActive'), req.t('Mailsettings'), req.language))
        }

        await db.mailsettingModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Mailsettings'),
            role: 'mailsettingnotification',
            message: {
                tr: `${mailsetting?.Name} Mail Ayarı ${username} tarafından Silindi.`,
                en: `${mailsetting?.Name} Mail Setting Deleted by ${username}`
            }[req.language],
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