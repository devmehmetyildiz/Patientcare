const config = require("../Config")
const { types } = require("../Constants/Defines")
const messages = require("../Constants/Messages")
const CreateNotification = require("../Utilities/CreateNotification")
const DoGet = require("../Utilities/DoGet")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')

async function GetPatients(req, res, next) {
    try {
        const patients = await db.patientModel.findAll({ where: { Isactive: true } })
        for (const patient of patients) {
            patient.Tododefineuuids = await db.patienttododefineModel.findAll({
                where: {
                    PatientID: patient.Uuid,
                },
                attributes: ['TododefineID']
            });
            patient.Supportplanuuids = await db.patientsupportplanModel.findAll({
                where: {
                    PatientID: patient.Uuid,
                },
                attributes: ['PlanID']
            });
        }
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
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PATIENTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const patient = await db.patientModel.findOne({ where: { Uuid: req.params.patientId } });
        patient.Tododefineuuids = await db.patienttododefineModel.findAll({
            where: {
                PatientID: patient.Uuid,
            },
            attributes: ['TododefineID']
        });
        patient.Supportplanuuids = await db.patientsupportplanModel.findAll({
            where: {
                PatientID: patient.Uuid,
            },
            attributes: ['PlanID']
        });
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
    const username = req?.identity?.user?.Username || 'System'

    try {
        if (!validator.isUUID(Patientdefine.Uuid)) {
            let patientdefineuuid = uuid()
            await db.patientdefineModel.create({
                ...Patientdefine,
                Uuid: patientdefineuuid,
                Createduser: username,
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
            req.body.PatientdefineID = patientdefineuuid
        }
        let patientuuid = uuid()
        await db.patientModel.create({
            ...req.body,
            Uuid: patientuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        let patientmovementuuid = uuid()

        await db.patientmovementModel.create({
            Uuid: patientmovementuuid,
            OldPatientmovementtype: 0,
            Patientmovementtype: 2,
            NewPatientmovementtype: 2,
            Createduser: username,
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

        const patientdefine = validator.isUUID(PatientdefineID) ? await db.patientdefineModel.findOne({ where: { Uuid: PatientdefineID } }) : null;

        await CreateNotification({
            type: types.Create,
            service: 'Hastalar',
            role: 'patientnotification',
            message: `${patientdefine ? `${patientdefine?.Firstname} ${patientdefine?.Lastname} hastası` : ` ${Patientdefine?.CountryID} TC kimlik numaralı hasta`} ${username} tarafından Oluşturuldu.`,
            pushurl: '/Preregistrations'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetPatients(req, res, next)
}

async function AddPatientReturnPatient(req, res, next) {

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

    let casedata = null

    try {
        const caseresponse = await axios({
            method: 'GET',
            url: config.services.Setting + `Cases / ` + CaseID,
            headers: {
                session_key: config.session.secret
            }
        })
        casedata = caseresponse.data
    } catch (error) {
        return next(requestErrorCatcher(error, 'Setting'))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        if (!validator.isUUID(Patientdefine.Uuid)) {
            let patientdefineuuid = uuid()
            await db.patientdefineModel.create({
                ...Patientdefine,
                Uuid: patientdefineuuid,
                Createduser: username,
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
            req.body.PatientdefineID = patientdefineuuid
        }
        let patientuuid = uuid()
        await db.patientModel.create({
            ...req.body,
            Uuid: patientuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        let patientmovementuuid = uuid()

        await db.patientmovementModel.create({
            Uuid: patientmovementuuid,
            OldPatientmovementtype: 0,
            Patientmovementtype: casedata?.Patientstatus || 2,
            NewPatientmovementtype: casedata?.Patientstatus || 2,
            Createduser: username,
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

        const patientdefine = validator.isUUID(PatientdefineID) ? await db.patientdefineModel.findOne({ where: { Uuid: PatientdefineID } }) : null;

        await CreateNotification({
            type: types.Create,
            service: 'Hastalar',
            role: 'patientnotification',
            message: `${patientdefine ? `${patientdefine?.Firstname} ${patientdefine?.Lastname} hastası` : ` ${Patientdefine?.CountryID} TC kimlik numaralı hasta`} ${username} tarafından Oluşturuldu.`,
            pushurl: '/Patients'
        })

        await t.commit()
        req.params.patientId = patientuuid
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetPatient(req, res, next)
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
                url: config.services.Warehouse + `Patientstocks / Transferpatientstock`,
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
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.patientModel.update({
            ...patient,
            Iswaitingactivation: false,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: patient.Uuid } }, { transaction: t })

        try {
            await axios({
                method: 'PUT',
                url: config.services.Setting + "Beds/ChangeBedstatus",
                headers: {
                    session_key: config.session.secret
                },
                data: {
                    OldUuid: null,
                    NewUuid: BedID
                }
            })
        } catch (error) {
            return next(requestErrorCatcher(error, 'Setting'))
        }

        const lastpatientmovement = await db.patientmovementModel.findOne({
            order: [['Id', 'DESC']],
            where: {
                PatientID: patient?.Uuid
            }
        });

        let patientmovementuuid = uuid()

        await db.patientmovementModel.create({
            Uuid: patientmovementuuid,
            OldPatientmovementtype: lastpatientmovement?.Patientmovementtype || 0,
            Patientmovementtype: 1,
            NewPatientmovementtype: 1,
            Createduser: username,
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

        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: PatientdefineID } })

        await CreateNotification({
            type: types.Update,
            service: 'Hastalar',
            role: 'patientnotification',
            message: `${patientdefine?.Firstname} ${patientdefine?.Lastname} hastası ${username} tarafından Kuruma alındı.`,
            pushurl: '/Patients'
        })

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
    const username = req?.identity?.user?.Username || 'System'

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
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: PatientdefineID } })

        await CreateNotification({
            type: types.Update,
            service: 'Hastalar',
            role: 'patientnotification',
            message: `${patientdefine?.Firstname} ${patientdefine?.Lastname} hastası ${username} tarafından güncellendi.`,
            pushurl: '/Patients'
        })

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
    const username = req?.identity?.user?.Username || 'System'

    try {

        const patient = await db.patientModel.findOne({ where: { Uuid: PatientID } })
        if (!patient) {
            return next(createNotfounderror([messages.ERROR.PATIENT_NOT_FOUND], req.language))
        }
        if (patient.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PATIENT_NOT_ACTIVE], req.language))
        }

        const selectedCase = await DoGet(config.services.Setting, `Cases/${CaseID}`)

        if (selectedCase?.Patientstatus === 4) { //Ölüm
            const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } });
            if (!validator.isISODate(patientdefine?.Dateofdeath)) {
                return next(createValidationError([messages.VALIDATION_ERROR.DATEOFDEATH_REQUIRED_CASE], req.language))
            }
        }

        if (selectedCase?.Patientstatus === 6) { //Ayrılmış
            if (!validator.isISODate(patient?.Leavedate)) {
                return next(createValidationError([messages.VALIDATION_ERROR.LEAVEDATE_REQUIRED], req.language))
            }
        }

        await db.patientModel.update({
            ...patient,
            CaseID: CaseID,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: PatientID } }, { transaction: t })

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
            Patientmovementtype: selectedCase.Patientstatus,
            NewPatientmovementtype: selectedCase.Patientstatus,
            Createduser: username,
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

        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } })

        await CreateNotification({
            type: types.Update,
            service: 'Hastalar',
            role: 'patientnotification',
            message: `${patientdefine?.Firstname} ${patientdefine?.Lastname} hastasının durumu ${username} tarafından güncellendi.`,
            pushurl: '/Patients'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPatients(req, res, next)
}

async function UpdatePatientscase(req, res, next) {

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        for (const data of req.body) {
            let validationErrors = []

            const {
                PatientID,
                CaseID,
            } = data

            if (!validator.isUUID(PatientID)) {
                validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
            }
            if (!validator.isUUID(CaseID)) {
                validationErrors.push(messages.VALIDATION_ERROR.CASEID_REQUIRED)
            }

            if (validationErrors.length > 0) {
                return next(createValidationError(validationErrors, req.language))
            }

            const patient = await db.patientModel.findOne({ where: { Uuid: PatientID } })
            if (!patient) {
                return next(createNotfounderror([messages.ERROR.PATIENT_NOT_FOUND], req.language))
            }
            if (patient.Isactive === false) {
                return next(createAccessDenied([messages.ERROR.PATIENT_NOT_ACTIVE], req.language))
            }

            if (patient?.CaseID !== CaseID) {
                let casedata = null
                try {
                    const caseresponse = await axios({
                        method: 'GET',
                        url: config.services.Setting + "Cases/" + CaseID,
                        headers: {
                            session_key: config.session.secret
                        }
                    })
                    casedata = caseresponse?.data
                } catch (error) {
                    return next(requestErrorCatcher(error, 'Setting'))
                }


                await db.patientModel.update({
                    ...patient,
                    CaseID: CaseID,
                    Updateduser: username,
                    Updatetime: new Date(),
                }, { where: { Uuid: PatientID } }, { transaction: t })

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
                    Patientmovementtype: casedata.Patientstatus,
                    NewPatientmovementtype: casedata.Patientstatus,
                    Createduser: username,
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
            }
        }

        await CreateNotification({
            type: types.Update,
            service: 'Hastalar',
            role: 'patientnotification',
            message: `Hasta durumları ${username} tarafından güncellendi.`,
            pushurl: '/Patients'
        })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }

    GetPatients(req, res, next)
}

async function UpdatePatientplace(req, res, next) {

    let validationErrors = []
    const {
        PatientID,
        FloorID,
        RoomID,
        BedID
    } = req.body

    if (!validator.isUUID(PatientID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isUUID(FloorID)) {
        validationErrors.push(messages.VALIDATION_ERROR.FLOORNUMBER_REQUIRED)
    }
    if (!validator.isUUID(RoomID)) {
        validationErrors.push(messages.VALIDATION_ERROR.ROOMNUMBER_REQUIRED)
    }
    if (!validator.isUUID(BedID)) {
        validationErrors.push(messages.VALIDATION_ERROR.BEDNUMBER_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patient = await db.patientModel.findOne({ where: { Uuid: PatientID } })
        if (!patient) {
            return next(createNotfounderror([messages.ERROR.PATIENT_NOT_FOUND], req.language))
        }
        if (patient.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PATIENT_NOT_ACTIVE], req.language))
        }

        try {
            await axios({
                method: 'PUT',
                url: config.services.Setting + "Beds/ChangeBedstatus",
                headers: {
                    session_key: config.session.secret
                },
                data: {
                    OldUuid: patient.BedID,
                    NewUuid: BedID
                }
            })
        } catch (error) {
            return next(requestErrorCatcher(error, 'Setting'))
        }

        await db.patientModel.update({
            ...patient,
            FloorID: FloorID,
            BedID: BedID,
            RoomID: RoomID,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: PatientID } }, { transaction: t })

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
            Patientmovementtype: 7,
            NewPatientmovementtype: 7,
            Createduser: username,
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

        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } })

        await CreateNotification({
            type: types.Update,
            service: 'Hastalar',
            role: 'patientnotification',
            message: `${patientdefine?.Firstname} ${patientdefine?.Lastname} hastasının konumu ${username} tarafından güncellendi.`,
            pushurl: '/Patients'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    req.params.patientId = PatientID
    GetPatient(req, res, next)
}

async function TransferPatientplace(req, res, next) {

    let validationErrors = []
    const {
        PatientID,
        FloorID,
        RoomID,
        BedID,
        OtherPatientID,
        OtherFloorID,
        OtherRoomID,
        OtherBedID,
    } = req.body

    if (!validator.isUUID(PatientID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patient = await db.patientModel.findOne({ where: { Uuid: PatientID } })
        if (!patient) {
            return next(createNotfounderror([messages.ERROR.PATIENT_NOT_FOUND], req.language))
        }
        if (patient.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PATIENT_NOT_ACTIVE], req.language))
        }

        const otherpatient = await db.patientModel.findOne({ where: { Uuid: OtherPatientID || '' } })

        try {
            if (!validator.isUUID(otherpatient?.Uuid) && validator.isUUID(patient?.BedID)) {
                await axios({
                    method: 'PUT',
                    url: config.services.Setting + "Beds/ChangeBedstatus",
                    headers: {
                        session_key: config.session.secret
                    },
                    data: {
                        NewUuid: patient.BedID,
                        Status: false
                    }
                })
            }
            if (!validator.isUUID(otherpatient?.Uuid) && validator.isUUID(BedID)) {
                await axios({
                    method: 'PUT',
                    url: config.services.Setting + "Beds/ChangeBedstatus",
                    headers: {
                        session_key: config.session.secret
                    },
                    data: {
                        NewUuid: BedID,
                        Status: true
                    }
                })
            }
        } catch (error) {
            return next(requestErrorCatcher(error, 'Setting'))
        }

        await db.patientModel.update({
            ...patient,
            FloorID: FloorID || '',
            BedID: BedID || '',
            RoomID: RoomID || '',
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: PatientID } }, { transaction: t })


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
            Patientmovementtype: 7,
            NewPatientmovementtype: 7,
            Createduser: username,
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


        if (validator.isUUID(OtherPatientID)) {
            await db.patientModel.update({
                ...otherpatient,
                FloorID: OtherFloorID,
                BedID: OtherBedID,
                RoomID: OtherRoomID,
                Updateduser: username,
                Updatetime: new Date(),
            }, { where: { Uuid: OtherPatientID } }, { transaction: t })

            const Otherlastpatientmovement = await db.patientmovementModel.findOne({
                order: [['Id', 'DESC']],
                where: {
                    PatientID: patient?.Uuid
                }
            });

            let otherpatientmovementuuid = uuid()

            await db.patientmovementModel.create({
                ...req.body,
                Uuid: otherpatientmovementuuid,
                OldPatientmovementtype: Otherlastpatientmovement?.Patientmovementtype || 0,
                Patientmovementtype: 7,
                NewPatientmovementtype: 7,
                Createduser: username,
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
        }

        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } })

        await CreateNotification({
            type: types.Update,
            service: 'Hastalar',
            role: 'patientnotification',
            message: `${patientdefine?.Firstname} ${patientdefine?.Lastname} hastasının konumu ${username} tarafından güncellendi.`,
            pushurl: '/Patients'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    req.params.patientId = PatientID
    GetPatient(req, res, next)
}

async function UpdatePatienttododefines(req, res, next) {

    let validationErrors = []
    const {
        PatientID,
        Tododefines,
    } = req.body

    if (!validator.isUUID(PatientID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isArray(Tododefines)) {
        validationErrors.push(messages.VALIDATION_ERROR.TODODEFINEID_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patient = await db.patientModel.findOne({ where: { Uuid: PatientID } })
        if (!patient) {
            return next(createNotfounderror([messages.ERROR.PATIENT_NOT_FOUND], req.language))
        }
        if (patient.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PATIENT_NOT_ACTIVE], req.language))
        }

        await db.patienttododefineModel.destroy({ where: { PatientID: PatientID }, transaction: t });
        for (const tododefine of Tododefines) {
            if (!tododefine.Uuid || !validator.isUUID(tododefine.Uuid)) {
                return next(createValidationError(messages.VALIDATION_ERROR.TODODEFINEID_REQUIRED, req.language))
            }
            await db.patienttododefineModel.create({
                PatientID: PatientID,
                TododefineID: tododefine.Uuid
            }, { transaction: t });
        }

        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } })

        await CreateNotification({
            type: types.Update,
            service: 'Hastalar',
            role: 'patientnotification',
            message: `${patientdefine?.Firstname} ${patientdefine?.Lastname} hastasının rutinleri ${username} tarafından güncellendi.`,
            pushurl: '/Patients'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPatients(req, res, next)
}

async function UpdatePatientsupportplans(req, res, next) {

    let validationErrors = []
    const {
        PatientID,
        Supportplans,
    } = req.body

    if (!validator.isUUID(PatientID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isArray(Supportplans)) {
        validationErrors.push(messages.VALIDATION_ERROR.SUPPORTPLANS_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patient = await db.patientModel.findOne({ where: { Uuid: PatientID } })
        if (!patient) {
            return next(createNotfounderror([messages.ERROR.PATIENT_NOT_FOUND], req.language))
        }
        if (patient.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PATIENT_NOT_ACTIVE], req.language))
        }

        await db.patientsupportplanModel.destroy({ where: { PatientID: PatientID }, transaction: t });
        for (const supportplan of Supportplans) {
            if (!supportplan.Uuid || !validator.isUUID(supportplan.Uuid)) {
                return next(createValidationError(messages.VALIDATION_ERROR.SUPPORTPLANID_REQUIRED, req.language))
            }
            await db.patientsupportplanModel.create({
                PatientID: PatientID,
                PlanID: supportplan.Uuid
            }, { transaction: t });
        }

        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } })

        await CreateNotification({
            type: types.Update,
            service: 'Hastalar',
            role: 'patientnotification',
            message: `${patientdefine?.Firstname} ${patientdefine?.Lastname} hastasının destek planları ${username} tarafından güncellendi.`,
            pushurl: '/Patients'
        })

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
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patient = await db.patientModel.findOne({ where: { Uuid: Uuid } })
        if (!patient) {
            return next(createNotfounderror([messages.ERROR.PATIENT_NOT_FOUND], req.language))
        }
        if (patient.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PATIENT_NOT_ACTIVE], req.language))
        }

        await db.patientModel.destroy({ where: { Uuid: Uuid }, transaction: t });

        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } })

        await CreateNotification({
            type: types.Delete,
            service: 'Hastalar',
            role: 'patientnotification',
            message: `${patientdefine?.Firstname} ${patientdefine?.Lastname} hastası ${username} tarafından silindi.`,
            pushurl: '/Patients'
        })
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
    const username = req?.identity?.user?.Username || 'System'

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
            Updateduser: username,
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
            Createduser: username,
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
    const username = req?.identity?.user?.Username || 'System'

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
            Updateduser: username,
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
            Createduser: username,
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

async function Createfromtemplate(req, res, next) {

    const body = req.body
    const t = await db.sequelize.transaction();

    try {

        for (const patientdata of body) {

            let patientdefineuuid = uuid()

            await db.patientdefineModel.create({
                Uuid: patientdefineuuid,
                Firstname: patientdata.Firstname,
                Lastname: patientdata.Lastname,
                PatienttypeID: patientdata.PatienttypeID,
                CostumertypeID: patientdata.CostumertypeID,
                Gender: String(patientdata.Gender),
                CountryID: String(patientdata.CountryID),
                Createduser: "System",
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })

            let patientuuid = uuid()
            await db.patientModel.create({
                PatientdefineID: patientdefineuuid,
                Approvaldate: "2023-11-01 00:00:00",
                Registerdate: "2023-11-01 00:00:00",
                Happensdate: patientdata.Happensdate,
                DepartmentID: "f276eb15-0c06-4367-b075-30150c520d2a",
                CaseID: "e599c0e3-5a87-4612-bb1c-6733466643c5",
                Iswaitingactivation: 0,
                Uuid: patientuuid,
                Createduser: "System",
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })

            await db.patientmovementModel.create({
                Uuid: uuid(),
                OldPatientmovementtype: 0,
                Patientmovementtype: 2,
                NewPatientmovementtype: 2,
                Createduser: "System",
                Createtime: "2023-11-01 00:00:00",
                PatientID: patientuuid,
                Movementdate: new Date(),
                IsDeactive: false,
                IsTodoneed: false,
                IsTodocompleted: false,
                IsComplated: true,
                Iswaitingactivation: false,
                Isactive: true
            }, { transaction: t })

            await db.patientmovementModel.create({
                Uuid: uuid(),
                OldPatientmovementtype: 2,
                Patientmovementtype: 1,
                NewPatientmovementtype: 1,
                Createduser: "System",
                Createtime: "2023-11-01 00:00:00",
                PatientID: patientuuid,
                Movementdate: new Date(),
                IsDeactive: false,
                IsTodoneed: false,
                IsTodocompleted: false,
                IsComplated: true,
                Iswaitingactivation: false,
                Isactive: true
            }, { transaction: t })
        }

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    return res.status(200).json({ message: "success" })
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
    UpdatePatienttododefines,
    DeletePatient,
    Editpatientstocks,
    UpdatePatientplace,
    OutPatient,
    InPatient,
    AddPatientReturnPatient,
    Createfromtemplate,
    UpdatePatientsupportplans,
    TransferPatientplace,
    UpdatePatientscase
}