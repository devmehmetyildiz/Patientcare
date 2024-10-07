const { types } = require("../Constants/Defines")
const messages = require("../Constants/Messages")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetPatienttypes(req, res, next) {
    try {
        const patienttypes = await db.patienttypeModel.findAll({ where: { Isactive: true } })
        res.status(200).json(patienttypes)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function GetPatienttype(req, res, next) {

    let validationErrors = []
    if (!req.params.patienttypeId) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTTYPEID_REQUIRED)
    }
    if (!validator.isUUID(req.params.patienttypeId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PATIENTTYPEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const patienttype = await db.patienttypeModel.findOne({ where: { Uuid: req.params.patienttypeId } });
        res.status(200).json(patienttype)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}


async function AddPatienttype(req, res, next) {

    let validationErrors = []
    const {
        Name
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let patienttypeuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.patienttypeModel.create({
            ...req.body,
            Uuid: patienttypeuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: 'Hasta Türleri',
            role: 'patienttypenotification',
            message: `${Name} hasta türü ${username} tarafından Oluşturuldu.`,
            pushurl: '/Patienttypes'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetPatienttypes(req, res, next)
}

async function UpdatePatienttype(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Uuid
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTTYPEID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PATIENTTYPEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patienttype = await db.patienttypeModel.findOne({ where: { Uuid: Uuid } })
        if (!patienttype) {
            return next(createNotfounderror([messages.ERROR.PATIENTTYPE_NOT_FOUND], req.language))
        }
        if (patienttype.Isactive === false) {
            return next(createNotfounderror([messages.ERROR.PATIENTTYPE_NOT_ACTIVE], req.language))
        }

        await db.patienttypeModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Hasta Türleri',
            role: 'patienttypenotification',
            message: `${Name} hasta türü ${username} tarafından Güncellendi.`,
            pushurl: '/Patienttypes'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPatienttypes(req, res, next)
}

async function DeletePatienttype(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.patienttypeId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTTYPEID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PATIENTTYPEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patienttype = await db.patienttypeModel.findOne({ where: { Uuid: Uuid } })
        if (!patienttype) {
            return next(createNotfounderror([messages.ERROR.PATIENTTYPE_NOT_FOUND], req.language))
        }
        if (patienttype.Isactive === false) {
            return next(createNotfounderror([messages.ERROR.PATIENTTYPE_NOT_ACTIVE], req.language))
        }

        await db.patienttypeModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: 'Hasta Türleri',
            role: 'patienttypenotification',
            message: `${patienttype?.Name} hasta türü ${username} tarafından Silindi.`,
            pushurl: '/Patienttypes'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetPatienttypes(req, res, next)
}

module.exports = {
    GetPatienttypes,
    GetPatienttype,
    AddPatienttype,
    UpdatePatienttype,
    DeletePatienttype,
}