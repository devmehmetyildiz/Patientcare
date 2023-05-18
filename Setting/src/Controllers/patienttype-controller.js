const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetPatienttypes(req, res, next) {
    try {
        const patienttypes = await db.patienttypeModel.findAll({ where: { Isactive: true } })
        res.status(200).json(patienttypes)
    } catch (error) {
        sequelizeErrorCatcher(error)
        next()
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
        sequelizeErrorCatcher(error)
        next()
    }
}


async function AddPatienttype(req, res, next) {

    let validationErrors = []
    const {
        Name
    } = req.body

    if (!Name || !validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
    }
   
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let patienttypeuuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.patienttypeModel.create({
            ...req.body,
            Uuid: patienttypeuuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await t.commit()
        const createdPatienttype = await db.patienttypeModel.findOne({ where: { Uuid: patienttypeuuid } })
        res.status(200).json(createdPatienttype)
    } catch (err) {
        await t.rollback()
        sequelizeErrorCatcher(err)
        next()
    }
}

async function UpdatePatienttype(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Uuid
    } = req.body

    if (!Name || !validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTTYPEID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PATIENTTYPEID, req.language)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const patienttype = db.patienttypeModel.findOne({ where: { Uuid: Uuid } })
        if (!patienttype) {
            return next(createNotfounderror([messages.ERROR.PATIENTTYPE_NOT_FOUND], req.language))
        }
        if (patienttype.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PATIENTTYPE_NOT_ACTIVE], req.language))
        }

        const t = await db.sequelize.transaction();

        await db.patienttypeModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await t.commit()
        const updatedPatienttype = await db.patienttypeModel.findOne({ where: { Uuid: Uuid } })
        res.status(200).json(updatedPatienttype)
    } catch (error) {
        sequelizeErrorCatcher(error)
        next()
    }


}

async function DeletePatienttype(req, res, next) {

    let validationErrors = []
    const {
        Uuid
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTTYPEID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PATIENTTYPEID, req.language)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const patienttype = db.patienttypeModel.findOne({ where: { Uuid: Uuid } })
        if (!patienttype) {
            return next(createNotfounderror([messages.ERROR.PATIENTTYPE_NOT_FOUND], req.language))
        }
        if (patienttype.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PATIENTTYPE_NOT_ACTIVE], req.language))
        }
        const t = await db.sequelize.transaction();

        await db.patienttypeModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();

        res.status(200).json({ messages: "deleted", Uuid: Uuid })
    } catch (error) {
        await t.rollback();
        sequelizeErrorCatcher(error)
        next()
    }

}

module.exports = {
    GetPatienttypes,
    GetPatienttype,
    AddPatienttype,
    UpdatePatienttype,
    DeletePatienttype,
}