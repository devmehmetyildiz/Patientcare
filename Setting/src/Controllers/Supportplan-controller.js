const { types } = require("../Constants/Defines")
const messages = require("../Constants/Messages")
const CreateNotification = require("../Utilities/CreateNotification")
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
        Type
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isNumber(Type)) {
        validationErrors.push(messages.VALIDATION_ERROR.TYPE_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
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
            service: 'Destek Planları',
            role: 'supportplannotification',
            message: `${Name} destek planı ${username} tarafından Oluşturuldu.`,
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
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isNumber(Type)) {
        validationErrors.push(messages.VALIDATION_ERROR.TYPE_REQUIRED)
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
    const username = req?.identity?.user?.Username || 'System'

    try {
        const supportplan = await db.supportplanModel.findOne({ where: { Uuid: Uuid } })
        if (!supportplan) {
            return next(createNotfounderror([messages.ERROR.SUPPORTPLAN_NOT_FOUND], req.language))
        }
        if (supportplan.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.SUPPORTPLAN_NOT_ACTIVE], req.language))
        }

        await db.supportplanModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Destek Planları',
            role: 'supportplannotification',
            message: `${Name} destek planı ${username} tarafından Güncellendi.`,
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
        validationErrors.push(messages.VALIDATION_ERROR.SUPPORTPLANID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_SUPPORTPLANID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const supportplan = await db.supportplanModel.findOne({ where: { Uuid: Uuid } })
        if (!supportplan) {
            return next(createNotfounderror([messages.ERROR.SUPPORTPLAN_NOT_FOUND], req.language))
        }
        if (supportplan.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.SUPPORTPLAN_NOT_ACTIVE], req.language))
        }

        await db.supportplanModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: 'Destek Planları',
            role: 'supportplannotification',
            message: `${supportplan?.Name} destek planı ${username} tarafından Güncellendi.`,
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