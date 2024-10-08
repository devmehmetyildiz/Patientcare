const config = require("../Config")
const { types } = require("../Constants/Defines")
const messages = require("../Constants/Messages")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetPatientcashmovements(req, res, next) {
    try {
        const patientcashmovements = await db.patientcashmovementModel.findAll({ where: { Isactive: true } })
        res.status(200).json(patientcashmovements)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPatientcashmovement(req, res, next) {

    let validationErrors = []
    if (!req.params.movementId) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTID_REQUIRED)
    }
    if (!validator.isUUID(req.params.movementId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_MOVEMENTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const patientcashmovement = await db.patientcashmovementModel.findOne({ where: { Uuid: req.params.movementId } });
        res.status(200).json(patientcashmovement)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}


async function AddPatientcashmovement(req, res, next) {

    let validationErrors = []
    const {
        PatientID,
        RegisterID,
        Movementtype,
        Movementvalue,
    } = req.body


    if (!validator.isUUID(PatientID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isUUID(RegisterID)) {
        validationErrors.push(messages.VALIDATION_ERROR.REGISTERID_REQUIRED)
    }
    if (!validator.isNumber(Movementtype)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTTYPE_REQUIRED)
    }
    if (!validator.isNumber(Movementvalue)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTVALUE_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let movementuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {

        const registertype = await db.patientcashregisterModel.findAll({ where: { Isactive: true, Uuid: RegisterID } })
        if (!registertype) {
            return next(createNotfounderror([messages.ERROR.CASHREGISTER_NOT_FOUND], req.language))
        }
        if (registertype.Isactive === false) {
            return next(createNotfounderror([messages.ERROR.CASHREGISTER_NOT_ACTIVE], req.language))
        }

        if (registertype.Iseffectcompany) {
            let companyuuid = uuid()
            await db.companycashmovementModel.create({
                Movementtype: (Movementtype * -1),
                Movementvalue: Movementvalue,
                Info: '',
                Uuid: companyuuid,
                Createduser: "System",
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
        }

        await db.patientcashmovementModel.create({
            ...req.body,
            Uuid: movementuuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        const patient = await db.patientModel.findOne({ where: { Uuid: PatientID } });
        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } });

        await CreateNotification({
            type: types.Create,
            service: 'Hasta Cüzdanları',
            role: 'patientcashmovementnotification',
            message: `${patientdefine?.Firstname} ${patientdefine?.Lastname} hastasına ${Movementvalue || 0} TL ${username} tarafından Eklendi.`,
            pushurl: '/Patientcashmovements'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetPatientcashmovements(req, res, next)
}

async function UpdatePatientcashmovement(req, res, next) {

    let validationErrors = []
    const {
        PatientID,
        RegisterID,
        Movementtype,
        Movementvalue,
        Uuid
    } = req.body

    if (!validator.isUUID(PatientID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isUUID(RegisterID)) {
        validationErrors.push(messages.VALIDATION_ERROR.REGISTERID_REQUIRED)
    }
    if (!validator.isNumber(Movementtype)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTTYPE_REQUIRED)
    }
    if (!validator.isNumber(Movementvalue)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTVALUE_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_MOVEMENTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patientcashmovement = await db.patientcashmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!patientcashmovement) {
            return next(createNotfounderror([messages.ERROR.MOVEMENT_NOT_FOUND], req.language))
        }
        if (patientcashmovement.Isactive === false) {
            return next(createNotfounderror([messages.ERROR.MOVEMENT_NOT_ACTIVE], req.language))
        }

        await db.patientcashmovementModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        const patient = await db.patientModel.findOne({ where: { Uuid: PatientID } });
        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } });

        await CreateNotification({
            type: types.Update,
            service: 'Hasta Cüzdanları',
            role: 'patientcashmovementnotification',
            message: `${patientdefine?.Firstname} ${patientdefine?.Lastname} hastasının ${patientcashmovement?.Movementvalue} TL ücreti ,  ${Movementvalue || 0} TL olarak ${username} tarafından Güncellendi.`,
            pushurl: '/Patientcashmovements'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPatientcashmovements(req, res, next)

}

async function DeletePatientcashmovement(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.movementId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_MOVEMENTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patientcashmovement = await db.patientcashmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!patientcashmovement) {
            return next(createNotfounderror([messages.ERROR.MOVEMENT_NOT_FOUND], req.language))
        }
        if (patientcashmovement.Isactive === false) {
            return next(createNotfounderror([messages.ERROR.MOVEMENT_NOT_ACTIVE], req.language))
        }

        await db.patientcashmovementModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })


        const patient = await db.patientModel.findOne({ where: { Uuid: patientcashmovement?.PatientID } });
        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } });

        await CreateNotification({
            type: types.Delete,
            service: 'Hasta Cüzdanları',
            role: 'patientcashmovementnotification',
            message: `${patientdefine?.Firstname} ${patientdefine?.Lastname} hastasının ${patientcashmovement?.Movementvalue} TL ücreti ${username} tarafından Silindi.`,
            pushurl: '/Patientcashmovements'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetPatientcashmovements(req, res, next)
}

module.exports = {
    GetPatientcashmovements,
    GetPatientcashmovement,
    AddPatientcashmovement,
    UpdatePatientcashmovement,
    DeletePatientcashmovement,
}