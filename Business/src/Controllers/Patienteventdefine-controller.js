const config = require("../Config")
const { types } = require("../Constants/Defines")
const messages = require("../Constants/PatientevenetdefineMessages")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')

async function GetPatienteventdefines(req, res, next) {
    try {
        const patienteventdefines = await db.patienteventdefineModel.findAll()
        res.status(200).json(patienteventdefines)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPatienteventdefine(req, res, next) {

    let validationErrors = []
    if (!req.params.patienteventdefineId) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTEVENTDEFINEID_REQUIRED)
    }
    if (!validator.isUUID(req.params.patienteventdefineId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PATIENTEVENTDEFINEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const patienteventdefine = await db.patienteventdefineModel.findOne({ where: { Uuid: req.params.patienteventdefineId } });
        res.status(200).json(patienteventdefine)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}


async function AddPatienteventdefine(req, res, next) {

    let validationErrors = []
    const {
        Eventname,
    } = req.body


    if (!validator.isString(Eventname)) {
        validationErrors.push(messages.VALIDATION_ERROR.EVENTNAME_REQUIRED)
    }


    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let patienteventdefineuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.patienteventdefineModel.create({
            ...req.body,
            Uuid: patienteventdefineuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: 'Hasta Vaka Tanımları',
            role: 'patienteventdefinenotification',
            message: `${Eventname} isimli Hasta Vaka Tanımı  ${username} tarafından Oluşturuldu.`,
            pushurl: '/Patienteventdefines'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetPatienteventdefines(req, res, next)
}

async function UpdatePatienteventdefine(req, res, next) {

    let validationErrors = []
    const {
        Eventname,
        Uuid
    } = req.body


    if (!validator.isString(Eventname)) {
        validationErrors.push(messages.VALIDATION_ERROR.EVENTNAME_REQUIRED)
    }

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTEVENTDEFINEID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PATIENTEVENTDEFINEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patienteventdefine = await db.patienteventdefineModel.findOne({ where: { Uuid: Uuid } })
        if (!patienteventdefine) {
            return next(createNotfounderror([messages.ERROR.PATIENTEVENTDEFINE_NOT_FOUND], req.language))
        }
        if (patienteventdefine.Isactive === false) {
            return next(createNotfounderror([messages.ERROR.PATIENTEVENTDEFINE_NOT_ACTIVE], req.language))
        }

        await db.patienteventdefineModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Hasta Vaka Tanımları',
            role: 'patienteventdefinenotification',
            message: `${Eventname} isimli Hasta Vaka Tanımı  ${username} tarafından Güncellendi.`,
            pushurl: '/Patienteventdefines'
        })
        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPatienteventdefines(req, res, next)

}

async function DeletePatienteventdefine(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.patienteventdefineId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTEVENTDEFINEID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PATIENTEVENTDEFINEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patienteventdefine = await db.patienteventdefineModel.findOne({ where: { Uuid: Uuid } })
        if (!patienteventdefine) {
            return next(createNotfounderror([messages.ERROR.PATIENTEVENTDEFINE_NOT_FOUND], req.language))
        }
        if (patienteventdefine.Isactive === false) {
            return next(createNotfounderror([messages.ERROR.PATIENTEVENTDEFINE_NOT_ACTIVE], req.language))
        }

        await db.patienteventdefineModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: 'Hasta Vaka Tanımları',
            role: 'patienteventdefinenotification',
            message: `${patienteventdefine?.Eventname} isimli Hasta Vaka Tanımı  ${username} tarafından Silindi.`,
            pushurl: '/Patienteventdefines'
        })
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetPatienteventdefines(req, res, next)
}

module.exports = {
    GetPatienteventdefines,
    GetPatienteventdefine,
    AddPatienteventdefine,
    UpdatePatienteventdefine,
    DeletePatienteventdefine,
}