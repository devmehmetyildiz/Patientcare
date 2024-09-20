const { types } = require("../Constants/Defines")
const messages = require("../Constants/Messages")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetPatientcashregisters(req, res, next) {
    try {
        const patientcashregisters = await db.patientcashregisterModel.findAll({ where: { Isactive: true } })
        res.status(200).json(patientcashregisters)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPatientcashregister(req, res, next) {

    let validationErrors = []
    if (!req.params.cashregisterId) {
        validationErrors.push(messages.VALIDATION_ERROR.CASHREGISTERID_REQUIRED)
    }
    if (!validator.isUUID(req.params.cashregisterId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_CASHREGISTERID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const patientcashregister = await db.patientcashregisterModel.findOne({ where: { Uuid: req.params.cashregisterId } });
        res.status(200).json(patientcashregister)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}


async function AddPatientcashregister(req, res, next) {

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

    let cashregisteruuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.patientcashregisterModel.create({
            ...req.body,
            Uuid: cashregisteruuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: 'Hasta Para Türleri',
            role: 'patientcashregisternotification',
            message: `${Name} hasta para türü ${username} tarafından Oluşturuldu.`,
            pushurl: '/Patientcashregisters'
        })
        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetPatientcashregisters(req, res, next)
}

async function UpdatePatientcashregister(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Uuid
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.CASHREGISTERID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_CASHREGISTERID)
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patientcashregister = await db.patientcashregisterModel.findOne({ where: { Uuid: Uuid } })
        if (!patientcashregister) {
            return next(createNotfounderror([messages.ERROR.CASHREGISTER_NOT_FOUND], req.language))
        }
        if (patientcashregister.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.CASHREGISTER_NOT_ACTIVE], req.language))
        }

        await db.patientcashregisterModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Hasta Para Türleri',
            role: 'patientcashregisternotification',
            message: `${Name} hasta para türü ${username} tarafından Güncellendi.`,
            pushurl: '/Patientcashregisters'
        })
        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPatientcashregisters(req, res, next)

}

async function DeletePatientcashregister(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.cashregisterId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PERSONELID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PERSONELID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patientcashregister = await db.patientcashregisterModel.findOne({ where: { Uuid: Uuid } })
        if (!patientcashregister) {
            return next(createNotfounderror([messages.ERROR.CASHREGISTER_NOT_FOUND], req.language))
        }
        if (patientcashregister.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.CASHREGISTER_NOT_ACTIVE], req.language))
        }

        await db.patientcashregisterModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: 'Hasta Para Türleri',
            role: 'patientcashregisternotification',
            message: `${patientcashregister?.Name} hasta para türü ${username} tarafından Silindi.`,
            pushurl: '/Patientcashregisters'
        })
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetPatientcashregisters(req, res, next)
}

module.exports = {
    GetPatientcashregisters,
    GetPatientcashregister,
    AddPatientcashregister,
    UpdatePatientcashregister,
    DeletePatientcashregister,
}