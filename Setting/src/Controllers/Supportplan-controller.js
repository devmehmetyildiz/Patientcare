const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
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
        validationErrors.push(req.t('Supportplans.Error.SupportplanIDRequired'))
    }
    if (!validator.isUUID(req.params.supportplanId)) {
        validationErrors.push(req.t('Supportplans.Error.UnsupportedSupportplanID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Supportplans'), req.language))
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
        Type
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Supportplans.Error.NameRequired'))
    }
    if (!validator.isNumber(Type)) {
        validationErrors.push(req.t('Supportplans.Error.TypeRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Supportplans'), req.language))
    }

    let supportplanuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.supportplanModel.create({
            ...req.body,
            Uuid: supportplanuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: req.t('Supportplans'),
            role: 'supportplannotification',
            message: {
                en: `${Name} Supportplan Created By ${username}.`,
                tr: `${Name} Destek planı ${username} tarafından Oluşturuldu.`
            }[req.language],
            pushurl: '/Supportplans'
        })

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
        Type,
        Uuid,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Supportplans.Error.NameRequired'))
    }
    if (!validator.isNumber(Type)) {
        validationErrors.push(req.t('Supportplans.Error.TypeRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Supportplans.Error.SupportplanIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Supportplans.Error.UnsupportedSupportplanID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Supportplans'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const supportplan = await db.supportplanModel.findOne({ where: { Uuid: Uuid } })
        if (!supportplan) {
            return next(createNotFoundError(req.t('Supportplans.Error.NotFound'), req.t('Supportplans'), req.language))
        }
        if (supportplan.Isactive === false) {
            return next(createNotFoundError(req.t('Supportplans.Error.NotActive'), req.t('Supportplans'), req.language))
        }

        await db.supportplanModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Supportplans'),
            role: 'supportplannotification',
            message: {
                en: `${Name} Supportplan Updated By ${username}.`,
                tr: `${Name} Destek Planı ${username} Tarafından Güncellendi.`
            }[req.language],
            pushurl: '/Supportplans'
        })

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
        validationErrors.push(req.t('Supportplans.Error.SupportplanIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Supportplans.Error.UnsupportedSupportplanID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Supportplans'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const supportplan = await db.supportplanModel.findOne({ where: { Uuid: Uuid } })
        if (!supportplan) {
            return next(createNotFoundError(req.t('Supportplans.Error.NotFound'), req.t('Supportplans'), req.language))
        }
        if (supportplan.Isactive === false) {
            return next(createNotFoundError(req.t('Supportplans.Error.NotActive'), req.t('Supportplans'), req.language))
        }

        await db.supportplanModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Supportplans'),
            role: 'supportplannotification',
            message: {
                en: `${supportplan?.Name} Supportplan Deleted By ${username}.`,
                tr: `${supportplan?.Name} Destek planı ${username} Tarafından Güncellendi.`
            }[req.language],
            pushurl: '/Supportplans'
        })

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