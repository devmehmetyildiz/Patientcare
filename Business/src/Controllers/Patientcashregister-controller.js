const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
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
        validationErrors.push(req.t('Patientcashregisters.Error.PatientcashregisterIDRequired'))
    }
    if (!validator.isUUID(req.params.cashregisterId)) {
        validationErrors.push(req.t('Patientcashregisters.Error.UnsupportedPatientcashregisterID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patientcashregisters'), req.language))
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
        validationErrors.push(req.t('Patientcashregisters.Error.NameRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patientcashregisters'), req.language))
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
            service: req.t('Patientcashregisters'),
            role: 'patientcashregisternotification',
            message: {
                tr: `${Name} İsimli Hasta Para Türü ${username} tarafından Oluşturuldu.`,
                en: `${Name} Patient Cash Register Created By ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Patientcashregisters.Error.NameRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Patientcashregisters.Error.PatientcashregisterIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patientcashregisters.Error.UnsupportedPatientcashregisterID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patientcashregisters'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patientcashregister = await db.patientcashregisterModel.findOne({ where: { Uuid: Uuid } })
        if (!patientcashregister) {
            return next(createNotFoundError(req.t('Patientcashmovements.Error.NotFound'), req.t('Patientcashregisters'), req.language))
        }
        if (patientcashregister.Isactive === false) {
            return next(createNotFoundError(req.t('Patientcashmovements.Error.NotActive'), req.t('Patientcashregisters'), req.language))
        }

        await db.patientcashregisterModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Patientcashregisters'),
            role: 'patientcashregisternotification',
            message: {
                tr: `${Name} İsimli Hasta Para Türü ${username} tarafından Güncellendi.`,
                en: `${Name} Patient Cash Register Updated By ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Patientcashregisters.Error.PatientcashregisterIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patientcashregisters.Error.UnsupportedPatientcashregisterID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patientcashregisters'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patientcashregister = await db.patientcashregisterModel.findOne({ where: { Uuid: Uuid } })
        if (!patientcashregister) {
            return next(createNotFoundError(req.t('Patientcashmovements.Error.NotFound'), req.t('Patientcashregisters'), req.language))
        }
        if (patientcashregister.Isactive === false) {
            return next(createNotFoundError(req.t('Patientcashmovements.Error.NotActive'), req.t('Patientcashregisters'), req.language))
        }

        await db.patientcashregisterModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Patientcashregisters'),
            role: 'patientcashregisternotification',
            message: {
                tr: `${patientcashregister?.Name} İsimli Hasta Para Türü ${username} tarafından Silindi.`,
                en: `${patientcashregister?.Name} Patient Cash Register Deleted By ${username}`
            }[req.language],
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