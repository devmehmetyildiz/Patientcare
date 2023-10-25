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
        const patients = await db.patientModel.findAll({ where: { Isactive: true } })
        res.status(200).json(patients)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPreregistrations(req, res, next) {
    try {
        const patients = await db.patientModel.findAll({ where: { Isactive: true } })
        res.status(200).json(patients)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetFullpatients(req, res, next) {
    try {
        const patients = await db.patientModel.findAll({ where: { Isactive: true } })
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
        res.status(200).json(patient)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddPatient(req, res, next) {

    let validationErrors = []
    const {
        Approvaldate,
        Registerdate,
        DepartmentID,
        CaseID,
        Patientdefine,
        PatientdefineID
    } = req.body


    if (!validator.isString(Patientdefine.CountryID) && !validator.isUUID(Patientdefine.Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.COUNTRYID_REQUIRED)
    }
    if (Object.keys(Patientdefine).length <= 0 && !validator.isUUID(PatientdefineID)) {
        validationErrors.push(messages.ERROR.PATIENTDEFINE_NOT_FOUND)
    }
    if (!validator.isUUID(DepartmentID)) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED)
    }
    if (!validator.isUUID(CaseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.CASEID_REQUIRED)
    }
    if (!validator.isISODate(Registerdate)) {
        validationErrors.push(messages.VALIDATION_ERROR.REGISTERDATE_REQUIRED)
    }
    if (!validator.isISODate(Approvaldate)) {
        validationErrors.push(messages.VALIDATION_ERROR.APPROVALDATE_REQUIRED)
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
            IsComplated: true,
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
        PatientdefineID,
        WarehouseID,
        RoomID,
        FloorID,
        BedID,
        Iswilltransfer
    } = req.body

    if (!validator.isUUID(PatientdefineID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTDEFINEID_REQUIRED)
    }
    if (Iswilltransfer && !validator.isUUID(WarehouseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.WAREHOUSEID_REQUIRED)
    }
    if (!validator.isString(RoomID)) {
        validationErrors.push(messages.VALIDATION_ERROR.ROOMNUMBER_REQUIRED)
    }
    if (!validator.isString(FloorID)) {
        validationErrors.push(messages.VALIDATION_ERROR.FLOORNUMBER_REQUIRED)
    }
    if (!validator.isString(BedID)) {
        validationErrors.push(messages.VALIDATION_ERROR.BEDNUMBER_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let patient = req.body

    try {
        if (Iswilltransfer === true) {
            await axios({
                method: 'PUT',
                url: config.services.Warehouse + `Patientstocks/Transferpatientstock`,
                data: patient,
                headers: {
                    session_key: config.session.secret
                }
            })
        }
    } catch (error) {
        return next(requestErrorCatcher(error, 'Warehouse'))
    }

    const t = await db.sequelize.transaction();
    try {
        await db.patientModel.update({
            ...patient,
            Iswaitingactivation: false,
            Updateduser: "System",
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: patient.Uuid } }, { transaction: t })


        const lastpatientmovement = await db.patientmovementModel.findOne({
            order: [['Id', 'DESC']],
            where: {
                PatientID: patient?.Uuid
            }
        });

        let patientmovementuuid = uuid()

        await db.patientmovementModel.create({
            ...req.body,
            Uuid: patientmovementuuid,
            OldPatientmovementtype: lastpatientmovement?.Patientmovementtype || 0,
            Patientmovementtype: 1,
            NewPatientmovementtype: 1,
            Createduser: "System",
            Createtime: new Date(),
            PatientID: patient.Uuid,
            Movementdate: new Date(),
            IsDeactive: false,
            IsTodoneed: false,
            IsTodocompleted: false,
            IsComplated: true,
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

async function Editpatientstocks(req, res, next) {

    try {
        await axios({
            method: 'PUT',
            url: config.services.Warehouse + "Patientstocks/UpdatePatientstocklist",
            data: req.body,
            headers: {
                session_key: config.session.secret
            }
        })
    } catch (error) {
        return next(requestErrorCatcher(error, "Warehouse"))
    }
    GetPreregistrations(req, res, next)
}

async function UpdatePatient(req, res, next) {

    let validationErrors = []
    const {
        Approvaldate,
        Registerdate,
        DepartmentID,
        CaseID,
        PatientdefineID,
        Uuid
    } = req.body

    if (!validator.isUUID(PatientdefineID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTDEFINEID_REQUIRED)
    }
    if (!validator.isUUID(DepartmentID)) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED)
    }
    if (!validator.isUUID(CaseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.CASEID_REQUIRED)
    }
    if (!validator.isISODate(Registerdate)) {
        validationErrors.push(messages.VALIDATION_ERROR.REGISTERDATE_REQUIRED)
    }
    if (!validator.isISODate(Approvaldate)) {
        validationErrors.push(messages.VALIDATION_ERROR.APPROVALDATE_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PATIENTID)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const patient = await db.patientModel.findOne({ where: { Uuid: Uuid } })
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

async function UpdatePatientcase(req, res, next) {

    let validationErrors = []
    const {
        PatientID,
        CaseID,
    } = req.body

    if (!validator.isUUID(PatientID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isUUID(CaseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.CASEID_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const patient = await db.patientModel.findOne({ where: { Uuid: PatientID } })
        if (!patient) {
            return next(createNotfounderror([messages.ERROR.PATIENT_NOT_FOUND], req.language))
        }
        if (patient.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PATIENT_NOT_ACTIVE], req.language))
        }

        await db.patientModel.update({
            ...patient,
            CaseID: CaseID,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: PatientID } }, { transaction: t })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPatients(req, res, next)
}

async function UpdatePatienttodogroupdefine(req, res, next) {

    let validationErrors = []
    const {
        PatientID,
        TodogroupdefineID,
    } = req.body

    if (!validator.isUUID(PatientID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isUUID(TodogroupdefineID)) {
        validationErrors.push(messages.VALIDATION_ERROR.TODOGROUPDEFINEID_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const patient = await db.patientModel.findOne({ where: { Uuid: PatientID } })
        if (!patient) {
            return next(createNotfounderror([messages.ERROR.PATIENT_NOT_FOUND], req.language))
        }
        if (patient.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PATIENT_NOT_ACTIVE], req.language))
        }

        await db.patientModel.update({
            ...patient,
            TodogroupdefineID: TodogroupdefineID,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: PatientID } }, { transaction: t })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPatients(req, res, next)
}

async function DeletePatient(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.patientId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PATIENTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const patient = await db.patientModel.findOne({ where: { Uuid: Uuid } })
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

async function OutPatient(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.patientId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PATIENTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const patient = await db.patientModel.findOne({ where: { Uuid: Uuid } })
        if (!patient) {
            return next(createNotfounderror([messages.ERROR.PATIENT_NOT_FOUND], req.language))
        }
        if (patient.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PATIENT_NOT_ACTIVE], req.language))
        }
        let cases = []
        try {
            const caseresponse = await axios({
                method: 'GET',
                url: config.services.Setting + "Cases",
                headers: {
                    session_key: config.session.secret
                }
            })
            cases = caseresponse.data
        } catch (error) {
            return next(requestErrorCatcher(error, 'Setting'))
        }

        const outCase = cases.find(u => u.Patientstatus === 3)
        if (!outCase) {
            return next(createNotfounderror([messages.ERROR.OUTCASE_NOT_ACTIVE], req.language))
        }


        await db.patientModel.update({
            ...patient,
            CaseID: outCase.Uuid,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        const lastpatientmovement = await db.patientmovementModel.findOne({
            order: [['Id', 'DESC']],
            where: {
                PatientID: patient?.Uuid
            }
        });

        let patientmovementuuid = uuid()

        await db.patientmovementModel.create({
            ...req.body,
            Uuid: patientmovementuuid,
            OldPatientmovementtype: lastpatientmovement?.Patientmovementtype || 0,
            Patientmovementtype: 3,
            NewPatientmovementtype: 3,
            Createduser: "System",
            Createtime: new Date(),
            PatientID: Uuid,
            Movementdate: new Date(),
            IsDeactive: false,
            IsTodoneed: false,
            IsTodocompleted: false,
            IsComplated: true,
            Iswaitingactivation: false,
            Isactive: true
        }, { transaction: t })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetPatient(req, res, next)
}

async function InPatient(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.patientId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PATIENTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const patient = await db.patientModel.findOne({ where: { Uuid: Uuid } })
        if (!patient) {
            return next(createNotfounderror([messages.ERROR.PATIENT_NOT_FOUND], req.language))
        }
        if (patient.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PATIENT_NOT_ACTIVE], req.language))
        }
        let cases = []
        try {
            const caseresponse = await axios({
                method: 'GET',
                url: config.services.Setting + "Cases",
                headers: {
                    session_key: config.session.secret
                }
            })
            cases = caseresponse.data
        } catch (error) {
            return next(requestErrorCatcher(error, 'Setting'))
        }

        const inCase = cases.find(u => u.Patientstatus === 1)
        if (!inCase) {
            return next(createNotfounderror([messages.ERROR.INCASE_NOT_ACTIVE], req.language))
        }


        await db.patientModel.update({
            ...patient,
            CaseID: inCase.Uuid,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        const lastpatientmovement = await db.patientmovementModel.findOne({
            order: [['Id', 'DESC']],
            where: {
                PatientID: patient?.Uuid
            }
        });

        let patientmovementuuid = uuid()

        await db.patientmovementModel.create({
            ...req.body,
            Uuid: patientmovementuuid,
            OldPatientmovementtype: lastpatientmovement?.Patientmovementtype || 0,
            Patientmovementtype: 1,
            NewPatientmovementtype: 1,
            Createduser: "System",
            Createtime: new Date(),
            PatientID: Uuid,
            Movementdate: new Date(),
            IsDeactive: false,
            IsTodoneed: false,
            IsTodocompleted: false,
            IsComplated: true,
            Iswaitingactivation: false,
            Isactive: true
        }, { transaction: t })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetPatient(req, res, next)
}


module.exports = {
    GetPatients,
    Completeprepatient,
    GetFullpatients,
    GetPreregistrations,
    GetPatient,
    AddPatient,
    UpdatePatient,
    UpdatePatientcase,
    UpdatePatienttodogroupdefine,
    DeletePatient,
    Editpatientstocks,
    OutPatient,
    InPatient
}