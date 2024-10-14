const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetCareplanparameters(req, res, next) {
    try {
        const careplanparameters = await db.careplanparameterModel.findAll()
        res.status(200).json(careplanparameters)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetCareplanparameter(req, res, next) {

    let validationErrors = []
    if (!req.params.careplanparameterId) {
        validationErrors.push(req.t('Careplanparameters.Error.CareplanparameterIDRequired'))
    }
    if (!validator.isUUID(req.params.careplanparameterId)) {
        validationErrors.push(req.t('Careplanparameters.Error.UnsupportedCareplanparameterID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Careplanparameters'), req.language))
    }

    try {
        const careplanparameter = await db.careplanparameterModel.findOne({ where: { Uuid: req.params.careplanparameterId } });
        if (!careplanparameter) {
            return next(createNotFoundError(req.t('Careplanparameters.Error.NotFound'), req.t('Careplanparameters'), req.language))
        }
        if (!careplanparameter.Isactive) {
            return next(createNotFoundError(req.t('Careplanparameters.Error.NotActive'), req.t('Careplanparameters'), req.language))
        }
        res.status(200).json(careplanparameter)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddCareplanparameter(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Type
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Careplanparameters.Error.NameRequired'))
    }
    if (!validator.isNumber(Type)) {
        validationErrors.push(req.t('Careplanparameters.Error.TypeRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Careplanparameters'), req.language))
    }

    let careplanparameteruuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        await db.careplanparameterModel.create({
            ...req.body,
            Uuid: careplanparameteruuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: req.t('Careplanparameters'),
            role: 'careplanparameternotification',
            message: {
                tr: `${Name} parametresi ${username} tarafından Oluşturuldu.`,
                en: `${Name} parameter created by ${username}`
            }[req.language],
            pushurl: '/Careplanparameters'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetCareplanparameters(req, res, next)
}

async function UpdateCareplanparameter(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Type,
        Uuid
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Careplanparameters.Error.NameRequired'))
    }
    if (!validator.isNumber(Type)) {
        validationErrors.push(req.t('Careplanparameters.Error.TypeRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Careplanparameters.Error.CareplanparameterIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Careplanparameters.Error.UnsupportedCareplanparameterID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Careplanparameters'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        const careplanparameter = await db.careplanparameterModel.findOne({ where: { Uuid: Uuid } })
        if (!careplanparameter) {
            return next(createNotFoundError(req.t('Careplanparameters.Error.NotFound'), req.t('Careplanparameters'), req.language))
        }
        if (careplanparameter.Isactive === false) {
            return next(createNotFoundError(req.t('Careplanparameters.Error.NotActive'), req.t('Careplanparameters'), req.language))
        }

        await db.careplanparameterModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Careplanparameters'),
            role: 'careplanparameternotification',
            message: {
                tr: `${Name} parametresi ${username} tarafından Oluşturuldu.`,
                en: `${Name} parameter created by ${username}`
            }[req.language],
            pushurl: '/Careplanparameters'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetCareplanparameters(req, res, next)
}

async function DeleteCareplanparameter(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.careplanparameterId

    if (!Uuid) {
        validationErrors.push(req.t('Careplanparameters.Error.CareplanparameterIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Careplanparameters.Error.UnsupportedCareplanparameterID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Careplanparameters'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        const careplanparameter = await db.careplanparameterModel.findOne({ where: { Uuid: Uuid } })
        if (!careplanparameter) {
            return next(createNotFoundError(req.t('Careplanparameters.Error.NotFound'), req.t('Careplanparameters'), req.language))
        }
        if (careplanparameter.Isactive === false) {
            return next(createNotFoundError(req.t('Careplanparameters.Error.NotActive'), req.t('Careplanparameters'), req.language))
        }

        await db.careplanparameterModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Careplanparameters'),
            role: 'careplanparameternotification',
            message: {
                tr: `${careplanparameter?.Name} parametresi ${username} tarafından Silindi.`,
                en: `${careplanparameter?.Name} parameter deleted by ${username}`
            }[req.language],
            pushurl: '/Careplanparameters'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetCareplanparameters(req, res, next)
}

module.exports = {
    GetCareplanparameters,
    GetCareplanparameter,
    AddCareplanparameter,
    UpdateCareplanparameter,
    DeleteCareplanparameter,
}