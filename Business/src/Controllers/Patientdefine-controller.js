const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetPatientdefines(req, res, next) {
    try {
        const patientdefines = await db.patientdefineModel.findAll()
        res.status(200).json(patientdefines)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPatientdefine(req, res, next) {

    let validationErrors = []
    if (!req.params.patientdefineId) {
        validationErrors.push(req.t('Patientdefines.Error.PatientdefineIDRequired'))
    }
    if (!validator.isUUID(req.params.patientdefineId)) {
        validationErrors.push(req.t('Patientdefines.Error.UnsupportedPatientdefineID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patientdefines'), req.language))
    }

    try {
        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: req.params.patientdefineId } });
        res.status(200).json(patientdefine)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}


async function AddPatientdefine(req, res, next) {

    let validationErrors = []
    const {
        CountryID,
    } = req.body


    if (!validator.isString(CountryID)) {
        validationErrors.push(req.t('Patientdefines.Error.CountryIDRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patientdefines'), req.language))
    }

    let patientdefineuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.patientdefineModel.create({
            ...req.body,
            Uuid: patientdefineuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: req.t('Patientdefines'),
            role: 'patientdefinenotification',
            message: {
                tr: `${CountryID} TC kimlik Numaralı Hasta  ${username} tarafından Oluşturuldu.`,
                en: `${CountryID} Country ID Patient Created By ${username}`
            }[req.language],
            pushurl: '/Patientdefines'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetPatientdefines(req, res, next)
}

async function UpdatePatientdefine(req, res, next) {

    let validationErrors = []
    const {
        CountryID,
        Uuid
    } = req.body


    if (!validator.isString(CountryID)) {
        validationErrors.push(req.t('Patientdefines.Error.CountryIDRequired'))
    }

    if (!Uuid) {
        validationErrors.push(req.t('Patientdefines.Error.PatientdefineIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patientdefines.Error.UnsupportedPatientdefineID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patientdefines'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: Uuid } })
        if (!patientdefine) {
            return next(createNotFoundError(req.t('Patientdefines.Error.NotFound'), req.t('Patientdefines'), req.language))
        }
        if (patientdefine.Isactive === false) {
            return next(createNotFoundError(req.t('Patientdefines.Error.NotActive'), req.t('Patientdefines'), req.language))
        }

        await db.patientdefineModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Patientdefines'),
            role: 'patientdefinenotification',
            message: {
                tr: `${CountryID} TC kimlik Numaralı Hasta  ${username} tarafından Güncellendi.`,
                en: `${CountryID} Country ID Patient Updated By ${username}`
            }[req.language],
            pushurl: '/Patientdefines'
        })
        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPatientdefines(req, res, next)

}

async function DeletePatientdefine(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.patientdefineId

    if (!Uuid) {
        validationErrors.push(req.t('Patientdefines.Error.PatientdefineIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patientdefines.Error.UnsupportedPatientdefineID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patientdefines'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: Uuid } })
        if (!patientdefine) {
            return next(createNotFoundError(req.t('Patientdefines.Error.NotFound'), req.t('Patientdefines'), req.language))
        }
        if (patientdefine.Isactive === false) {
            return next(createNotFoundError(req.t('Patientdefines.Error.NotActive'), req.t('Patientdefines'), req.language))
        }

        await db.patientdefineModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Patientdefines'),
            role: 'patientdefinenotification',
            message: {
                tr: `${patientdefine?.CountryID} TC kimlik Numaralı Hasta  ${username} tarafından Silindi.`,
                en: `${patientdefine?.CountryID} Country ID Patient Deleted By ${username}`
            }[req.language],
            pushurl: '/Patientdefines'
        })
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetPatientdefines(req, res, next)
}

module.exports = {
    GetPatientdefines,
    GetPatientdefine,
    AddPatientdefine,
    UpdatePatientdefine,
    DeletePatientdefine,
}