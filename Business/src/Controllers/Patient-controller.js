const config = require("../Config")
const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')

async function GetPatients(req, res, next) {
    try {
        const patients = await db.patientModel.findAll({ where: { Isactive: true , Iswaitingactivation: false } })
        if (patients && patients.length > 0) {
            let cases = []
            let departments = []
            let files = []
            let stocks = []
            let patienttypes = []
            let costumertypes = []
            try {
                const casesresponse = axios({
                    method: 'GET',
                    url: config.services.Setting + `Cases`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                const departmentsresponse = axios({
                    method: 'GET',
                    url: config.services.Setting + `Departments`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                const patienttypesresponse = axios({
                    method: 'GET',
                    url: config.services.Setting + `Patienttypes`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                const costumertypesresponse = axios({
                    method: 'GET',
                    url: config.services.Setting + `Costumertypes`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                const filesresponse = axios({
                    method: 'GET',
                    url: config.services.File + `Files`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                const stocksresponse = axios({
                    method: 'GET',
                    url: config.services.Warehouse + `Patientstocks`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                await Promise.all([casesresponse, departmentsresponse, patienttypesresponse
                    , costumertypesresponse, filesresponse, stocksresponse])
                cases = casesresponse.data
                departments = departmentsresponse.data
                files = filesresponse.data
                stocks = stocksresponse.data
                patienttypes = patienttypesresponse.data
                costumertypes = costumertypesresponse.data
                for (const patient of patients) {
                    patient.Case = cases.find(u => u.Uuid === patient.CaseID)
                    patient.Department = departments.find(u => u.Uuid === patient.DeparmentID)
                    patient.Stocks = stocks.filter(u => u.PatientID === patient.Uuid)
                    patient.Patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient.PatientdefineID } })
                    if (patient.Patientdefine) {
                        patient.Patientdefine.Patienttype = patienttypes.find(u => u.Uuid === patient.Patientdefine.PatienttypeID)
                        patient.Patientdefine.Costumertype = costumertypes.find(u => u.Uuid === patient.Patientdefine.CostumertypeID)
                    }
                }
            } catch (error) {
                return next(requestErrorCatcher(error, 'Setting'))
            }
        }
        res.status(200).json(patients)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPreregistrations(req, res, next) {
    try {
        const patients = await db.patientModel.findAll({ where: { Isactive: true, Iswaitingactivation: true } })
        if (patients && patients.length > 0) {
            let cases = []
            let departments = []
            let files = []
            let stocks = []
            let patienttypes = []
            let costumertypes = []
            try {
                const casesresponse = axios({
                    method: 'GET',
                    url: config.services.Setting + `Cases`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                const departmentsresponse = axios({
                    method: 'GET',
                    url: config.services.Setting + `Departments`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                const patienttypesresponse = axios({
                    method: 'GET',
                    url: config.services.Setting + `Patienttypes`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                const costumertypesresponse = axios({
                    method: 'GET',
                    url: config.services.Setting + `Costumertypes`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                const filesresponse = axios({
                    method: 'GET',
                    url: config.services.File + `Files`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                const stocksresponse = axios({
                    method: 'GET',
                    url: config.services.Warehouse + `Patientstocks`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                await Promise.all([casesresponse, departmentsresponse, patienttypesresponse
                    , costumertypesresponse, filesresponse, stocksresponse])
                cases = casesresponse.data
                departments = departmentsresponse.data
                files = filesresponse.data
                stocks = stocksresponse.data
                patienttypes = patienttypesresponse.data
                costumertypes = costumertypesresponse.data
                for (const patient of patients) {
                    patient.Case = cases.find(u => u.Uuid === patient.CaseID)
                    patient.Department = departments.find(u => u.Uuid === patient.DeparmentID)
                    patient.Stocks = stocks.filter(u => u.PatientID === patient.Uuid)
                    patient.Patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient.PatientdefineID } })
                    if (patient.Patientdefine) {
                        patient.Patientdefine.Patienttype = patienttypes.find(u => u.Uuid === patient.Patientdefine.PatienttypeID)
                        patient.Patientdefine.Costumertype = costumertypes.find(u => u.Uuid === patient.Patientdefine.CostumertypeID)
                    }
                }
            } catch (error) {
                return next(requestErrorCatcher(error, 'Setting'))
            }
        }
        res.status(200).json(patients)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPatient(req, res, next) {

    let validationErrors = []
    if (!req.params.patientId) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isUUID(req.params.patientId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PATIENTDEFINEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const patient = await db.patientModel.findOne({ where: { Uuid: req.params.patientId } });
        patient.Patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient.PatientdefineID } })
        if (patient.Patientdefine) {
            const patienttypesresponse = await axios({
                method: 'GET',
                url: config.services.Setting + `Patienttypes/${patient.Patientdefine.PatienttypeID}`,
                headers: {
                    session_key: config.session.secret
                }
            })
            const costumertypesresponse = await axios({
                method: 'GET',
                url: config.services.Setting + `Costumertypes/${patient.Patientdefine.CostumertypeID}`,
                headers: {
                    session_key: config.session.secret
                }
            })
            patient.Patientdefine.Patienttype = patienttypesresponse.data
            patient.Patientdefine.Costumertype = costumertypesresponse.data
        }
        const casesresponse = await axios({
            method: 'GET',
            url: config.services.Setting + `Cases/${patient.CaseID}`,
            headers: {
                session_key: config.session.secret
            }
        })
        const departmentsresponse = await axios({
            method: 'GET',
            url: config.services.Setting + `Departments/${patient.DepartmentID}`,
            headers: {
                session_key: config.session.secret
            }
        })
        const filesresponse = await axios({
            method: 'GET',
            url: config.services.File + `Files`,
            headers: {
                session_key: config.session.secret
            }
        })
        const stocksresponse = await axios({
            method: 'GET',
            url: config.services.Warehouse + `Patientstocks`,
            headers: {
                session_key: config.session.secret
            }
        })
        patient.Case = casesresponse.data
        patient.Department = departmentsresponse.data
        patient.Files = filesresponse.data.filter(u => u.ParentID === patient.Uuid)
        patient.Stocks = stocksresponse.filter(u => u.PatientID === patient.Uuid)
        res.status(200).json(patient)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddPatient(req, res, next) {

    let validationErrors = []
    const {
        Firstname,
        Lastname,
        CountryID,
        CostumertypeID,
        PatienttypeID,
        Patientdefine
    } = req.body

    if (!validator.isString(Firstname)) {
        validationErrors.push(messages.VALIDATION_ERROR.FIRSTNAME_REQUIRED, req.language)
    }
    if (!validator.isString(Lastname)) {
        validationErrors.push(messages.VALIDATION_ERROR.LASTNAME_REQUIRED, req.language)
    }
    if (!validator.isString(CountryID)) {
        validationErrors.push(messages.VALIDATION_ERROR.COUNTRYID_REQUIRED, req.language)
    }
    if (!validator.isString(CostumertypeID)) {
        validationErrors.push(messages.VALIDATION_ERROR.COSTUMERTYPEID_REQUIRED, req.language)
    }
    if (!validator.isString(PatienttypeID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTDEFINEID_REQUIRED, req.language)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();

    try {
        if (!validator.isUUID(Patientdefine.Uuid)) {
            let patientdefineuuid = uuid()
            await db.patientdefineModel.create({
                ...Patientdefine,
                Uuid: patientdefineuuid,
                Createduser: "System",
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
            req.body.PatientdefineID = patientdefineuuid
        }
        let patientuuid = uuid()
        await db.patientModel.create({
            ...req.body,
            Uuid: patientuuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        let patientmovementuuid = uuid()

        await db.patientmovementModel.create({
            Uuid: patientmovementuuid,
            OldPatientmovementtype: 0,
            Patientmovementtype: 2,
            NewPatientmovementtype: 2,
            Createduser: "System",
            Createtime: new Date(),
            PatientID: patientuuid,
            Movementdate: new Date(),
            IsDeactive: false,
            IsTodoneed: false,
            IsTodocompleted: false,
            IsComplated: false,
            Iswaitingactivation: false,
            Isactive: true
        }, { transaction: t })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetPatients(req, res, next)
}

async function Completeprepatient(req, res, next) {

    let validationErrors = []
    const {
        Firstname,
        Lastname,
        CountryID,
        CostumertypeID,
        PatienttypeID,
        Patientdefine
    } = req.body

    if (!validator.isString(Firstname)) {
        validationErrors.push(messages.VALIDATION_ERROR.FIRSTNAME_REQUIRED, req.language)
    }
    if (!validator.isString(Lastname)) {
        validationErrors.push(messages.VALIDATION_ERROR.LASTNAME_REQUIRED, req.language)
    }
    if (!validator.isString(CountryID)) {
        validationErrors.push(messages.VALIDATION_ERROR.COUNTRYID_REQUIRED, req.language)
    }
    if (!validator.isString(CostumertypeID)) {
        validationErrors.push(messages.VALIDATION_ERROR.COSTUMERTYPEID_REQUIRED, req.language)
    }
    if (!validator.isString(PatienttypeID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTDEFINEID_REQUIRED, req.language)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let patient = req.body

    const t = await db.sequelize.transaction();

    try {
        await db.patientModel.update({
            ...patient,
            Updateduser: "System",
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: patient.Uuid } }, { transaction: t })

        try {
            await axios({
                method: 'PUT',
                url: config.services.Warehouse + `Patientstocks/Transferpatientstock`,
                data: patient,
                headers: {
                    session_key: config.session.secret
                }
            })
        } catch (error) {
            return next(requestErrorCatcher(error, 'Warehouse'))
        }

        let patientmovementuuid = uuid()

        await db.patientmovementModel.create({
            ...req.body,
            Uuid: patientmovementuuid,
            OldPatientmovementtype: 0,
            Patientmovementtype: 1,
            NewPatientmovementtype: 1,
            Createduser: "System",
            Createtime: new Date(),
            PatientID: patient.Uuid,
            Movementdate: new Date(),
            IsDeactive: false,
            IsTodoneed: false,
            IsTodocompleted: false,
            IsComplated: false,
            Iswaitingactivation: false,
            Isactive: true
        }, { transaction: t })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetPatients(req, res, next)
}

async function UpdatePatient(req, res, next) {

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
        validationErrors.push(messages.VALIDATION_ERROR.FIRSTNAME_REQUIRED, req.language)
    }
    if (!validator.isString(Lastname)) {
        validationErrors.push(messages.VALIDATION_ERROR.LASTNAME_REQUIRED, req.language)
    }
    if (!validator.isString(CountryID)) {
        validationErrors.push(messages.VALIDATION_ERROR.COUNTRYID_REQUIRED, req.language)
    }
    if (!validator.isString(CostumertypeID)) {
        validationErrors.push(messages.VALIDATION_ERROR.COSTUMERTYPEID_REQUIRED, req.language)
    }
    if (!validator.isString(PatienttypeID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTDEFINEID_REQUIRED, req.language)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTDEFINEID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PATIENTDEFINEID, req.language)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const patient = db.patientModel.findOne({ where: { Uuid: Uuid } })
        if (!patient) {
            return next(createNotfounderror([messages.ERROR.PATIENTDEFINE_NOT_FOUND], req.language))
        }
        if (patient.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PATIENTDEFINE_NOT_ACTIVE], req.language))
        }

        await db.patientModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPatients(req, res, next)
}

async function DeletePatient(req, res, next) {

    let validationErrors = []
    const {
        Uuid
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTDEFINEID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PATIENTDEFINEID, req.language)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const patient = db.patientModel.findOne({ where: { Uuid: Uuid } })
        if (!patient) {
            return next(createNotfounderror([messages.ERROR.PATIENT_NOT_FOUND], req.language))
        }
        if (patient.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PATIENT_NOT_ACTIVE], req.language))
        }

        await db.patientModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetPatients(req, res, next)
}

module.exports = {
    GetPatients,
    Completeprepatient,
    GetPreregistrations,
    GetPatient,
    AddPatient,
    UpdatePatient,
    DeletePatient,
}