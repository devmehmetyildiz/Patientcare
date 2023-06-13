const config = require("../Config")
const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')

async function GetPatientdefines(req, res, next) {
    try {
        const patientdefines = await db.patientdefineModel.findAll({ where: { Isactive: true } })
        if (patientdefines && patientdefines.length > 0) {
            let patienttypes = []
            let costumertypes = []
            try {
                const patienttypesresponse = await axios({
                    method: 'GET',
                    url: config.services.Setting + `Patienttypes`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                const costumertypesresponse = await axios({
                    method: 'GET',
                    url: config.services.Setting + `Costumertypes`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                patienttypes = patienttypesresponse.data
                costumertypes = costumertypesresponse.data
                for (const patientdefine of patientdefines) {
                    patientdefine.Patienttype = patienttypes.find(u => u.Uuid === patientdefine.PatienttypeID)
                    patientdefine.Costumertype = costumertypes.find(u => u.Uuid === patientdefine.CostumertypeID)
                }
            } catch (error) {
                return next(requestErrorCatcher(error, 'Setting'))
            }
        }
        res.status(200).json(patientdefines)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPatientdefine(req, res, next) {

    let validationErrors = []
    console.log('req.params: ', req.params);
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
        try {
            const patienttypesresponse = await axios({
                method: 'GET',
                url: config.services.Setting + `Patienttypes/${patientdefine.PatienttypeID}`,
                headers: {
                    session_key: config.session.secret
                }
            })
            const costumertypesresponse = await axios({
                method: 'GET',
                url: config.services.Setting + `Costumertypes/${patientdefine.CostumertypeID}`,
                headers: {
                    session_key: config.session.secret
                }
            })
            patientdefine.Patienttype = patienttypesresponse.data
            patientdefine.Costumertype = costumertypesresponse.data
        } catch (error) {
            return next(requestErrorCatcher(error, 'Setting'))
        }
        res.status(200).json(patientdefine)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}


async function AddPatientdefine(req, res, next) {

    let validationErrors = []
    const {
        Firstname,
        Lastname,
        CountryID,
        CostumertypeID,
        PatienttypeID
    } = req.body

    if (!validator.isString(Firstname)) {
        validationErrors.push(messages.VALIDATION_ERROR.FIRSTNAME_REQUIRED)
    }
    if (!validator.isString(Lastname)) {
        validationErrors.push(messages.VALIDATION_ERROR.LASTNAME_REQUIRED)
    }
    if (!validator.isString(CountryID)) {
        validationErrors.push(messages.VALIDATION_ERROR.COUNTRYID_REQUIRED)
    }
    if (!validator.isString(CostumertypeID)) {
        validationErrors.push(messages.VALIDATION_ERROR.COSTUMERTYPEID_REQUIRED)
    }
    if (!validator.isString(PatienttypeID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTDEFINEID_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let patientdefineuuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.patientdefineModel.create({
            ...req.body,
            Uuid: patientdefineuuid,
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

async function UpdatePatientdefine(req, res, next) {

    let validationErrors = []
    const {
        Firstname,
        Lastname,
        CountryID,
        CostumertypeID,
        PatienttypeID,
        Uuid
    } = req.body

    if (!validator.isString(Firstname)) {
        validationErrors.push(messages.VALIDATION_ERROR.FIRSTNAME_REQUIRED)
    }
    if (!validator.isString(Lastname)) {
        validationErrors.push(messages.VALIDATION_ERROR.LASTNAME_REQUIRED)
    }
    if (!validator.isString(CountryID)) {
        validationErrors.push(messages.VALIDATION_ERROR.COUNTRYID_REQUIRED)
    }
    if (!validator.isString(CostumertypeID)) {
        validationErrors.push(messages.VALIDATION_ERROR.COSTUMERTYPEID_REQUIRED)
    }
    if (!validator.isString(PatienttypeID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTDEFINEID_REQUIRED)
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
    try {
        const patientdefine = db.patientdefineModel.findOne({ where: { Uuid: Uuid } })
        if (!patientdefine) {
            return next(createNotfounderror([messages.ERROR.PATIENTDEFINE_NOT_FOUND], req.language))
        }
        if (patientdefine.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PATIENTDEFINE_NOT_ACTIVE], req.language))
        }

        await db.patientdefineModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

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
    try {
        const patientdefine = db.patientdefineModel.findOne({ where: { Uuid: Uuid } })
        if (!patientdefine) {
            return next(createNotfounderror([messages.ERROR.PATIENTDEFINE_NOT_FOUND], req.language))
        }
        if (patientdefine.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PATIENTDEFINE_NOT_ACTIVE], req.language))
        }

        await db.patientdefineModel.destroy({ where: { Uuid: Uuid }, transaction: t });
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