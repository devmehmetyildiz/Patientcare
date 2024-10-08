const config = require("../Config")
const { types } = require("../Constants/Defines")
const messages = require("../Constants/Messages")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')

async function GetPatientdefines(req, res, next) {
    try {
        const patientdefines = await db.patientdefineModel.findAll({ where: { Isactive: true } })
        res.status(200).json(patientdefines)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPatientdefine(req, res, next) {

    let validationErrors = []
    if (!req.params.patientdefineId) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTDEFINEID_REQUIRED)
    }
    if (!validator.isUUID(req.params.patientdefineId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PATIENTDEFINEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
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
        validationErrors.push(messages.VALIDATION_ERROR.COUNTRYID_REQUIRED)
    }


    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
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
            service: 'Hasta Tanımları',
            role: 'patientdefinenotification',
            message: `${CountryID} TC kimlik numaralı hasta  ${username} tarafından Oluşturuldu.`,
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
        validationErrors.push(messages.VALIDATION_ERROR.COUNTRYID_REQUIRED)
    }

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTDEFINEID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PATIENTDEFINEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: Uuid } })
        if (!patientdefine) {
            return next(createNotfounderror([messages.ERROR.PATIENTDEFINE_NOT_FOUND], req.language))
        }
        if (patientdefine.Isactive === false) {
            return next(createNotfounderror([messages.ERROR.PATIENTDEFINE_NOT_ACTIVE], req.language))
        }

        await db.patientdefineModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Hasta Tanımları',
            role: 'patientdefinenotification',
            message: `${CountryID} TC kimlik numaralı hasta  ${username} tarafından Güncellendi.`,
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
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTDEFINEID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PATIENTDEFINEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: Uuid } })
        if (!patientdefine) {
            return next(createNotfounderror([messages.ERROR.PATIENTDEFINE_NOT_FOUND], req.language))
        }
        if (patientdefine.Isactive === false) {
            return next(createNotfounderror([messages.ERROR.PATIENTDEFINE_NOT_ACTIVE], req.language))
        }

        await db.patientdefineModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: 'Hasta Tanımları',
            role: 'patientdefinenotification',
            message: `${patientdefine?.CountryID} TC kimlik numaralı hasta  ${username} tarafından Silindi.`,
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