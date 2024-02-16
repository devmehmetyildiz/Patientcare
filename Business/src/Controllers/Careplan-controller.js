const config = require("../Config")
const messages = require("../Constants/CareplanMessages")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetCareplans(req, res, next) {
    try {
        const careplans = await db.careplanModel.findAll()
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

    let careplanuuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.careplanModel.create({
            ...req.body,
            Uuid: careplanuuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        for (const careplanservice of Careplanservices) {

            let careplanserviceuuid = uuid()

            await db.careplanserviceModel.create({
                ...careplanservice,
                Uuid: careplanserviceuuid,
                CareplanID: careplanserviceuuid,
                Createduser: "System",
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
        }

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
    try {
        const careplan = db.careplanModel.findOne({ where: { Uuid: Uuid } })
        if (!careplan) {
            return next(createNotfounderror([messages.ERROR.MOVEMENT_NOT_FOUND], req.language))
        }
        if (careplan.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.MOVEMENT_NOT_ACTIVE], req.language))
        }

        await db.careplanModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        for (const careplanservice of Careplanservices) {
            await db.careplanModel.update({
                ...careplanservice,
                Updateduser: "System",
                Updatetime: new Date(),
            }, { where: { Uuid: careplanservice?.Uuid } }, { transaction: t })
        }

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
    try {
        const careplan = db.careplanModel.findOne({ where: { Uuid: Uuid } })
        if (!careplan) {
            return next(createNotfounderror([messages.ERROR.CAREPLAN_NOT_FOUND], req.language))
        }
        if (careplan.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.CARE], req.language))
        }

        await db.careplanModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await db.careplanserviceModel.destroy({ where: { CareplanID: Uuid }, transaction: t });
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
    UpdateCareplan,
    DeleteCareplan,
}