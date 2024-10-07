const { types } = require("../Constants/Defines")
const messages = require("../Constants/CareplanparameterMessages")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher,} = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetCareplanparameters(req, res, next) {
    try {
        const careplanparameters = await db.careplanparameterModel.findAll({ where: { Isactive: true } })
        res.status(200).json(careplanparameters)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetCareplanparameter(req, res, next) {

    let validationErrors = []
    if (!req.params.careplanparameterId) {
        validationErrors.push(messages.VALIDATION_ERROR.PARAMETERID_REQUIRED)
    }
    if (!validator.isUUID(req.params.careplanparameterId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PARAMETERID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const careplanparameter = await db.careplanparameterModel.findOne({ where: { Uuid: req.params.careplanparameterId } });
        if (!careplanparameter) {
            return createNotfounderror([messages.ERROR.PARAMETER_NOT_FOUND])
        }
        if (!careplanparameter.Isactive) {
            return createNotfounderror([messages.ERROR.PARAMETER_NOT_ACTIVE])
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
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isNumber(Type)) {
        validationErrors.push(messages.VALIDATION_ERROR.TYPE_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
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
            service: 'Bireysel Bakım Planı Parametreleri',
            role: 'careplanparameternotification',
            message: `${Name} parametresi ${username} tarafından Oluşturuldu.`,
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
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isNumber(Type)) {
        validationErrors.push(messages.VALIDATION_ERROR.TYPE_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PARAMETERID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PARAMETERID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        const careplanparameter = await db.careplanparameterModel.findOne({ where: { Uuid: Uuid } })
        if (!careplanparameter) {
            return next(createNotfounderror([messages.ERROR.PARAMETER_NOT_FOUND], req.language))
        }
        if (careplanparameter.Isactive === false) {
            return next(createNotfounderror([messages.ERROR.PARAMETER_NOT_ACTIVE], req.language))
        }

        await db.careplanparameterModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Bireysel Bakım Planı Parametreleri',
            role: 'careplanparameternotification',
            message: `${Name} parametresi ${username} tarafından Güncellendi.`,
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
        validationErrors.push(messages.VALIDATION_ERROR.PARAMETERID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PARAMETERID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        const careplanparameter = await db.careplanparameterModel.findOne({ where: { Uuid: Uuid } })
        if (!careplanparameter) {
            return next(createNotfounderror([messages.ERROR.PARAMETER_NOT_FOUND], req.language))
        }
        if (careplanparameter.Isactive === false) {
            return next(createNotfounderror([messages.ERROR.PARAMETER_NOT_ACTIVE], req.language))
        }

        await db.careplanparameterModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: 'Bireysel Bakım Planı Parametreleri',
            role: 'careplanparameternotification',
            message: `${careplanparameter?.Name} parametresi ${username} tarafından Silindi.`,
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