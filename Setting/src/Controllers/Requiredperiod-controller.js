const { types } = require("../Constants/Defines")
const messages = require("../Constants/RequiredperiodMessages")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetRequiredperiods(req, res, next) {
    try {
        const requiredperiods = await db.requiredperiodModel.findAll({ where: { Isactive: true } })
        res.status(200).json(requiredperiods)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetRequiredperiod(req, res, next) {

    let validationErrors = []
    if (!req.params.requiredperiodId) {
        validationErrors.push(messages.VALIDATION_ERROR.REQUIREDPERIODID_REQUIRED)
    }
    if (!validator.isUUID(req.params.requiredperiodId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_REQUIREDPERIODID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const requiredperiod = await db.requiredperiodModel.findOne({ where: { Uuid: req.params.requiredperiodId } });
        if (!requiredperiod) {
            return createNotfounderror([messages.ERROR.REQUIREDPERIOD_NOT_FOUND])
        }
        if (!requiredperiod.Isactive) {
            return createNotfounderror([messages.ERROR.REQUIREDPERIOD_NOT_ACTIVE])
        }
        res.status(200).json(requiredperiod)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddRequiredperiod(req, res, next) {

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

    let requiredperioduuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.requiredperiodModel.create({
            ...req.body,
            Uuid: requiredperioduuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: 'Hizmet Sunulma Sıklıkları',
            role: 'requiredperiodnotification',
            message: `${Name} hizmet sunulma sıklığı ${username} tarafından Oluşturuldu.`,
            pushurl: '/Requiredperiods'
        })
        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetRequiredperiods(req, res, next)
}

async function UpdateRequiredperiod(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Uuid
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.REQUIREDPERIODID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_REQUIREDPERIODID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const requiredperiod = db.requiredperiodModel.findOne({ where: { Uuid: Uuid } })
        if (!requiredperiod) {
            return next(createNotfounderror([messages.ERROR.REQUIREDPERIOD_NOT_FOUND], req.language))
        }
        if (requiredperiod.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.REQUIREDPERIOD_NOT_ACTIVE], req.language))
        }

        await db.requiredperiodModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Hizmet Sunulma Sıklıkları',
            role: 'requiredperiodnotification',
            message: `${Name} hizmet sunulma sıklığı ${username} tarafından Güncellendi.`,
            pushurl: '/Requiredperiods'
        })
        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetRequiredperiods(req, res, next)
}

async function DeleteRequiredperiod(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.requiredperiodId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.REQUIREDPERIODID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_REQUIREDPERIODID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        const requiredperiod = db.requiredperiodModel.findOne({ where: { Uuid: Uuid } })
        if (!requiredperiod) {
            return next(createNotfounderror([messages.ERROR.REQUIREDPERIOD_NOT_FOUND], req.language))
        }
        if (requiredperiod.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.REQUIREDPERIOD_NOT_ACTIVE], req.language))
        }


        await db.requiredperiodModel.destroy({ where: { Uuid: Uuid }, transaction: t });

        await CreateNotification({
            type: types.Update,
            service: 'Hizmet Sunulma Sıklıkları',
            role: 'requiredperiodnotification',
            message: `${requiredperiod?.Name} hizmet sunulma sıklığı ${username} tarafından Silindi.`,
            pushurl: '/Requiredperiods'
        })
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetRequiredperiods(req, res, next)
}

module.exports = {
    GetRequiredperiods,
    GetRequiredperiod,
    AddRequiredperiod,
    UpdateRequiredperiod,
    DeleteRequiredperiod,
}