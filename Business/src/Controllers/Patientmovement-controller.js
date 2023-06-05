const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetPatientmovements(req, res, next) {
    try {
        const patientmovements = await db.patientmovementModel.findAll({ where: { Isactive: true } })
        for (const patientmovement of patientmovements) {
            patientmovement.Patient = await db.patientModel.findOne({ where: { Uuid: patientmovement.PatientID } })
            if (patientmovement.Patient) {
                patientmovement.Patient.Patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patientmovement.Patient.PatientdefineID } })
            }
        }
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
        patientmovement.Patient = await db.patientModel.findOne({ where: { Uuid: patientmovement.PatientID } })
        if (patientmovement.Patient) {
            patientmovement.Patient.Patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patientmovement.Patient.PatientdefineID } })
        }
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
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED, req.language)
    }
    if (!validator.isNumber(Patientmovementtype)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTMOVEMENTTYPE_REQUIRED, req.language)
    }
    if (!validator.isBoolean(IsDeactive)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISDEACTIVE_REQUIRED, req.language)
    }
    if (!validator.isBoolean(IsTodoneed)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISTODONEED_REQUIRED, req.language)
    }
    if (!validator.isBoolean(IsTodocompleted)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISTODOCOMPLETED_REQUIRED, req.language)
    }
    if (!validator.isBoolean(Iswaitingactivation)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISWAITINGACTIVATION_REQUIRED, req.language)
    }
    if (!validator.isBoolean(Movementdate)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTDATE_REQUIRED, req.language)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let patientmovementuuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.patientmovementModel.create({
            ...req.body,
            Uuid: patientmovementuuid,
            OldPatientmovementtype: 0,
            NewPatientmovementtype: Patientmovementtype,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

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
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED, req.language)
    }
    if (!validator.isNumber(Patientmovementtype)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTMOVEMENTTYPE_REQUIRED, req.language)
    }
    if (!validator.isBoolean(IsDeactive)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISDEACTIVE_REQUIRED, req.language)
    }
    if (!validator.isBoolean(IsTodoneed)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISTODONEED_REQUIRED, req.language)
    }
    if (!validator.isBoolean(IsTodocompleted)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISTODOCOMPLETED_REQUIRED, req.language)
    }
    if (!validator.isBoolean(Iswaitingactivation)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISWAITINGACTIVATION_REQUIRED, req.language)
    }
    if (!validator.isBoolean(Movementdate)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTDATE_REQUIRED, req.language)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTMOVEMENTID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PATIENTMOVEMENTID, req.language)
    }

    const t = await db.sequelize.transaction();
    try {
        const patientmovement = db.patientmovementModel.findOne({ where: { Uuid: Uuid } })
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
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPatientdefines(req, res, next)

}

async function DeletePatientmovement(req, res, next) {

    let validationErrors = []
    const {
        Uuid
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTMOVEMENTID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PATIENTMOVEMENTID, req.language)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const patientmovement = db.patientmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!patientmovement) {
            return next(createNotfounderror([messages.ERROR.PATIENTMOVEMENT_NOT_FOUND], req.language))
        }
        if (patientmovement.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PATIENTMOVEMENT_NOT_ACTIVE], req.language))
        }

        await db.patientmovementModel.destroy({ where: { Uuid: Uuid }, transaction: t });
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