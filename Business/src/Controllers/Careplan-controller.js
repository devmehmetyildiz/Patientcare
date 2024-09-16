const config = require("../Config")
const messages = require("../Constants/CareplanMessages")
const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetCareplans(req, res, next) {
    try {
        const careplans = await db.careplanModel.findAll()
        for (const careplan of careplans) {
            careplan.Careplanservices = await db.careplanserviceModel.findAll({ where: { CareplanID: careplan?.Uuid, Isactive: true } })
        }
        res.status(200).json(careplans)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetCareplan(req, res, next) {

    let validationErrors = []
    if (!req.params.careplanId) {
        validationErrors.push(messages.VALIDATION_ERROR.CAREPLANID_REQUIRED)
    }
    if (!validator.isUUID(req.params.careplanId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_CAREPLANID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const careplan = await db.careplanModel.findOne({ where: { Uuid: req.params.careplanId } });
        careplan.Careplanservices = await db.careplanserviceModel.findAll({ where: { CareplanID: careplan?.Uuid, Isactive: true } })
        res.status(200).json(careplan)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}


async function AddCareplan(req, res, next) {

    let validationErrors = []
    const {
        Startdate,
        Enddate,
        PatientID,
        Createdate,
        Careplanservices
    } = req.body

    if (!validator.isISODate(Startdate)) {
        validationErrors.push(messages.VALIDATION_ERROR.STARTDATE_REQUIRED)
    }
    if (!validator.isISODate(Enddate)) {
        validationErrors.push(messages.VALIDATION_ERROR.ENDDATE_REQUIRED)
    }
    if (!validator.isString(PatientID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isISODate(Createdate)) {
        validationErrors.push(messages.VALIDATION_ERROR.CREATEDATE_REQUIRED)
    }
    if (!validator.isArray(Careplanservices)) {
        validationErrors.push(messages.VALIDATION_ERROR.CAREPLANSERVICES_REQUIRED)
    } else {
        for (const careplanservice of Careplanservices) {

            if (!validator.isUUID(careplanservice?.SupportplanID)) {
                validationErrors.push(messages.VALIDATION_ERROR.SUPPORTPLANID_REQUIRED)
            }
            if (!validator.isUUID(careplanservice?.Helpstatus)) {
                validationErrors.push(messages.VALIDATION_ERROR.HELPSTATUS_REQUIRED)
            }
            if (!validator.isUUID(careplanservice?.Requiredperiod)) {
                validationErrors.push(messages.VALIDATION_ERROR.REQUIREDPERIOD_REQUIRED)
            }
            if (!validator.isUUID(careplanservice?.Makingtype)) {
                validationErrors.push(messages.VALIDATION_ERROR.MAKINGTYPE_REQUIRED)
            }
            if (!validator.isUUID(careplanservice?.Rating)) {
                validationErrors.push(messages.VALIDATION_ERROR.RATING_REQUIRED)
            }
        }
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let careplanuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.careplanModel.create({
            ...req.body,
            Uuid: careplanuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        for (const careplanservice of Careplanservices) {

            let careplanserviceuuid = uuid()

            await db.careplanserviceModel.create({
                ...careplanservice,
                Uuid: careplanserviceuuid,
                CareplanID: careplanuuid,
                Createduser: username,
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
        }

        const patient = await db.patientModel.findOne({ where: { Uuid: PatientID } });
        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } });

        await CreateNotification({
            type: types.Create,
            service: 'Bireysel Bakım Planları',
            role: 'careplannotification',
            message: `${patientdefine?.Firstname} ${patientdefine?.Lastname} hastasına ait bireysel bakım planı ${username} tarafından Eklendi.`,
            pushurl: '/Careplans'
        })
        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetCareplans(req, res, next)
}

async function UpdateCareplan(req, res, next) {

    let validationErrors = []
    const {
        Startdate,
        Enddate,
        PatientID,
        Createdate,
        Careplanservices,
        Uuid
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.CAREPLANID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_CAREPLANID)
    }
    if (!validator.isISODate(Startdate)) {
        validationErrors.push(messages.VALIDATION_ERROR.STARTDATE_REQUIRED)
    }
    if (!validator.isISODate(Enddate)) {
        validationErrors.push(messages.VALIDATION_ERROR.ENDDATE_REQUIRED)
    }
    if (!validator.isString(PatientID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isISODate(Createdate)) {
        validationErrors.push(messages.VALIDATION_ERROR.CREATEDATE_REQUIRED)
    }
    if (!validator.isArray(Careplanservices)) {
        validationErrors.push(messages.VALIDATION_ERROR.CAREPLANSERVICES_REQUIRED)
    } else {
        for (const careplanservice of Careplanservices) {
            if (!careplanservice?.Uuid) {
                validationErrors.push(messages.VALIDATION_ERROR.CAREPLANSERVICEID_REQUIRED)
            }
            if (!validator.isUUID(careplanservice?.Uuid)) {
                validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_CAREPLANSERVICEID)
            }
            if (!validator.isUUID(careplanservice?.SupportplanID)) {
                validationErrors.push(messages.VALIDATION_ERROR.SUPPORTPLANID_REQUIRED)
            }
            if (!validator.isString(careplanservice?.Helpstatus)) {
                validationErrors.push(messages.VALIDATION_ERROR.HELPSTATUS_REQUIRED)
            }
            if (!validator.isString(careplanservice?.Requiredperiod)) {
                validationErrors.push(messages.VALIDATION_ERROR.REQUIREDPERIOD_REQUIRED)
            }
            if (!validator.isString(careplanservice?.Makingtype)) {
                validationErrors.push(messages.VALIDATION_ERROR.MAKINGTYPE_REQUIRED)
            }
            if (!validator.isString(careplanservice?.Rating)) {
                validationErrors.push(messages.VALIDATION_ERROR.RATING_REQUIRED)
            }
        }
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const careplan = await db.careplanModel.findOne({ where: { Uuid: Uuid } })
        if (!careplan) {
            return next(createNotfounderror([messages.ERROR.MOVEMENT_NOT_FOUND], req.language))
        }
        if (careplan.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.MOVEMENT_NOT_ACTIVE], req.language))
        }

        await db.careplanModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        for (const careplanservice of Careplanservices) {
            await db.careplanserviceModel.update({
                ...careplanservice,
                Updateduser: username,
                Updatetime: new Date(),
            }, { where: { Uuid: careplanservice?.Uuid } }, { transaction: t })
        }

        const patient = await db.patientModel.findOne({ where: { Uuid: PatientID } });
        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } });

        await CreateNotification({
            type: types.Update,
            service: 'Bireysel Bakım Planları',
            role: 'careplannotification',
            message: `${patientdefine?.Firstname} ${patientdefine?.Lastname} hastasına ait bireysel bakım planı ${username} tarafından Güncellendi.`,
            pushurl: '/Careplans'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetCareplans(req, res, next)

}

async function ApproveCareplan(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.careplanId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.CAREPLANID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_CAREPLANID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const careplan = await db.careplanModel.findOne({ where: { Uuid: Uuid } })
        if (!careplan) {
            return next(createNotfounderror([messages.ERROR.CAREPLAN_NOT_FOUND], req.language))
        }
        if (careplan.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.CAREPLAN_NOT_ACTIVE], req.language))
        }
        if (careplan.Needapprove === false) {
            return next(createAccessDenied([messages.ERROR.CAREPLAN_DONTNEEDAPPROVE], req.language))
        }

        await db.careplanModel.update({
            ...careplan,
            Isapproved: true,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        const patient = await db.patientModel.findOne({ where: { Uuid: careplan?.PatientID } });
        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } });

        await CreateNotification({
            type: types.Update,
            service: 'Bireysel Bakım Planları',
            role: 'careplannotification',
            message: `${patientdefine?.Firstname} ${patientdefine?.Lastname} hastasına ait bireysel bakım planı ${username} tarafından Onaylandı.`,
            pushurl: '/Careplans'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetCareplans(req, res, next)
}


async function DeleteCareplan(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.careplanId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.CAREPLANID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_CAREPLANID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const careplan = await db.careplanModel.findOne({ where: { Uuid: Uuid } })
        if (!careplan) {
            return next(createNotfounderror([messages.ERROR.CAREPLAN_NOT_FOUND], req.language))
        }
        if (careplan.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.CARE], req.language))
        }

        await db.careplanModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid } }, { transaction: t })
       
        await db.careplanserviceModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { CareplanID: Uuid } }, { transaction: t })

        const patient = await db.patientModel.findOne({ where: { Uuid: careplan?.PatientID } });
        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } });

        await CreateNotification({
            type: types.Delete,
            service: 'Bireysel Bakım Planları',
            role: 'careplannotification',
            message: `${patientdefine?.Firstname} ${patientdefine?.Lastname} hastasına ait bireysel bakım planı ${username} tarafından Silindi.`,
            pushurl: '/Careplans'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetCareplans(req, res, next)
}

module.exports = {
    GetCareplans,
    GetCareplan,
    AddCareplan,
    ApproveCareplan,
    UpdateCareplan,
    DeleteCareplan,
}