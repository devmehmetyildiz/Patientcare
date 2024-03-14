const { types } = require("../Constants/Defines")
const messages = require("../Constants/Messages")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetPatientmovements(req, res, next) {
    try {
        const patientmovements = await db.patientmovementModel.findAll({ where: { Isactive: true } })
        res.status(200).json(patientmovements)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPatientmovement(req, res, next) {

    let validationErrors = []
    if (!req.params.patientmovementId) {
        validationErrors.push(messages.VALIDATION_ERROR.STATIONID_REQUIRED)
    }
    if (!validator.isUUID(req.params.patientmovementId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STATIONID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const patientmovement = await db.patientmovementModel.findOne({ where: { Uuid: req.params.patientmovementId } });
        res.status(200).json(patientmovement)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}


async function AddPatientmovement(req, res, next) {

    let validationErrors = []
    const {
        PatientID,
        Patientmovementtype,
        IsDeactive,
        IsTodoneed,
        IsTodocompleted,
        Iswaitingactivation,
        Movementdate,
    } = req.body

    if (!validator.isString(PatientID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isNumber(Patientmovementtype)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTMOVEMENTTYPE_REQUIRED)
    }
    if (!validator.isBoolean(IsDeactive)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISDEACTIVE_REQUIRED)
    }
    if (!validator.isBoolean(IsTodoneed)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISTODONEED_REQUIRED)
    }
    if (!validator.isBoolean(IsTodocompleted)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISTODOCOMPLETED_REQUIRED)
    }
    if (!validator.isBoolean(Iswaitingactivation)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISWAITINGACTIVATION_REQUIRED)
    }
    if (!validator.isBoolean(Movementdate)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTDATE_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let patientmovementuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.patientmovementModel.create({
            ...req.body,
            Uuid: patientmovementuuid,
            OldPatientmovementtype: 0,
            NewPatientmovementtype: Patientmovementtype,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: PatientID } })

        await CreateNotification({
            type: types.Create,
            service: 'Hasta Hareketleri',
            role: 'patientmovementnotification',
            message: `${patientdefine?.CountryID} TC kimlik numaralı hasta hareketi ${username} tarafından Oluşturuldu.`,
            pushurl: '/Patientmovements'
        })
        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetPatientdefines(req, res, next)
}

async function UpdatePatientmovement(req, res, next) {

    let validationErrors = []
    const {
        PatientID,
        Patientmovementtype,
        IsDeactive,
        IsTodoneed,
        IsTodocompleted,
        Iswaitingactivation,
        Movementdate,
        Uuid
    } = req.body

    if (!validator.isString(PatientID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isNumber(Patientmovementtype)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTMOVEMENTTYPE_REQUIRED)
    }
    if (!validator.isBoolean(IsDeactive)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISDEACTIVE_REQUIRED)
    }
    if (!validator.isBoolean(IsTodoneed)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISTODONEED_REQUIRED)
    }
    if (!validator.isBoolean(IsTodocompleted)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISTODOCOMPLETED_REQUIRED)
    }
    if (!validator.isBoolean(Iswaitingactivation)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISWAITINGACTIVATION_REQUIRED)
    }
    if (!validator.isBoolean(Movementdate)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTDATE_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTMOVEMENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PATIENTMOVEMENTID)
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patientmovement = await db.patientmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!patientmovement) {
            return next(createNotfounderror([messages.ERROR.PATIENTMOVEMENT_NOT_FOUND], req.language))
        }
        if (patientmovement.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PATIENTMOVEMENT_NOT_ACTIVE], req.language))
        }

        await db.patientmovementModel.update({
            ...req.body,
            OldPatientmovementtype: patientmovement.Patientmovementtype,
            NewPatientmovementtype: Patientmovementtype,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: PatientID } })

        await CreateNotification({
            type: types.Update,
            service: 'Hasta Hareketleri',
            role: 'patientmovementnotification',
            message: `${patientdefine?.CountryID} TC kimlik numaralı hasta hareketi ${username} tarafından Güncellendi.`,
            pushurl: '/Patientmovements'
        })
        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPatientdefines(req, res, next)

}

async function DeletePatientmovement(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.patientmovementId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTMOVEMENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PATIENTMOVEMENTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patientmovement = await db.patientmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!patientmovement) {
            return next(createNotfounderror([messages.ERROR.PATIENTMOVEMENT_NOT_FOUND], req.language))
        }
        if (patientmovement.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PATIENTMOVEMENT_NOT_ACTIVE], req.language))
        }

        await db.patientmovementModel.destroy({ where: { Uuid: Uuid }, transaction: t });

        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patientmovement?.PatientID } })

        await CreateNotification({
            type: types.Delete,
            service: 'Hasta Hareketleri',
            role: 'patientmovementnotification',
            message: `${patientdefine?.CountryID} TC kimlik numaralı hasta hareketi ${username} tarafından Silindi.`,
            pushurl: '/Patientmovements'
        })
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetPatientmovements(req, res, next)
}

module.exports = {
    GetPatientmovements,
    GetPatientmovement,
    AddPatientmovement,
    UpdatePatientmovement,
    DeletePatientmovement,
}