const config = require("../Config")
const { types } = require("../Constants/Defines")
const messages = require("../Constants/PatientMessages")
const CreateNotification = require("../Utilities/CreateNotification")
const DoGet = require("../Utilities/DoGet")
const DoPost = require("../Utilities/DoPost")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')
const { patientmovementtypes } = require('../Constants/Patientmovementypes')
const DoDelete = require("../Utilities/DoDelete")
const Createlog = require("../Utilities/Createlog")
const DoPut = require("../Utilities/DoPut")

const DELIVERY_TYPE_PATIENT = 0
const DELIVERY_TYPE_WAREHOUSE = 1

async function GetPatients(req, res, next) {
    try {
        let data = null
        const patients = await db.patientModel.findAll()
        for (const patient of patients) {
            patient.Movements = await db.patientmovementModel.findAll({ where: { PatientID: patient?.Uuid } });
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
        if (req?.Uuid) {
            data = await db.patientModel.findOne({ where: { Uuid: req?.Uuid } });
        }
        res.json({ list: patients, data: data })
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
        patient.Movements = await db.patientmovementModel.findAll({ where: { PatientID: patient?.Uuid } });
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
        DepartmentID,
        CaseID,
        Patientdefine,
        PatientdefineID,
        Stocks
    } = req.body

    let isNewpatient = !validator.isUUID(PatientdefineID)

    if (isNewpatient) {
        if (!(validator.isString(Patientdefine?.CountryID) && validator.isCountryID(Patientdefine?.CountryID))) {
            validationErrors.push(messages.ERROR.COUNTRYID_REQUIRED)
        }
    } else {
        if (!validator.isUUID(PatientdefineID)) {
            validationErrors.push(messages.VALIDATION_ERROR.PATIENTDEFINE_NOT_FOUND)
        }
    }
    if (!validator.isUUID(DepartmentID)) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED)
    }
    if (!validator.isUUID(CaseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.CASEID_REQUIRED)
    }
    if (!validator.isISODate(Approvaldate)) {
        validationErrors.push(messages.VALIDATION_ERROR.APPROVALDATE_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    let patientuuid = uuid()
    try {
        if (isNewpatient) {
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
        await db.patientModel.create({
            ...req.body,
            Uuid: patientuuid,
            Createduser: username,
            Createtime: new Date(),
            CreateduserID: req?.identity?.user?.Uuid || username,
            Patientcreatetime: new Date(),
            Ispreregistration: true,
            Ischecked: false,
            Isapproved: false,
            Isoninstitution: false,
            Isalive: true,
            Isleft: false,
            Isactive: true
        }, { transaction: t })

        let patientmovementuuid = uuid()

        await db.patientmovementModel.create({
            Uuid: patientmovementuuid,
            Type: patientmovementtypes.Patientcreate,
            PatientID: patientuuid,
            UserID: req?.identity?.user?.Uuid || username,
            Info: '',
            Occureddate: new Date()
        }, { transaction: t })


        const stockdefines = await DoGet(config.services.Warehouse, `Stockdefines`)
        const stocktypes = await DoGet(config.services.Warehouse, `Stocktypes`)
        for (const stock of Stocks) {

            const {
                StockdefineID,
                Type,
                Amount,
                Skt
            } = stock

            if (!validator.isUUID(StockdefineID)) {
                validationErrors.push(messages.VALIDATION_ERROR.STOCKDEFINEID_REQUIRED)
            }
            if (!validator.isNumber(Type)) {
                validationErrors.push(messages.VALIDATION_ERROR.TYPE_REQUIRED)
            }
            if (!validator.isNumber(Number(Amount))) {
                validationErrors.push(messages.VALIDATION_ERROR.AMOUNT_REQUIRED)
            }

            if (validationErrors.length > 0) {
                return next(createValidationError(validationErrors, req.language))
            }

            const stockdefine = stockdefines.find(u => u.Uuid === StockdefineID)
            const stocktype = stocktypes.find(u => u.Uuid === stockdefine?.StocktypeID)

            if (stocktype?.Issktneed) {
                if (!validator.isString(Skt)) {
                    next(createValidationError([messages.VALIDATION_ERROR.SKT_REQUIRED], req.language))
                }
            }

            await DoPost(config.services.Warehouse, `Stocks/AddStockWithoutMovement`, {
                ...stock,
                Isapproved: true,
                WarehouseID: patientuuid,
            })
        }

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
    req.Uuid = patientuuid
    GetPatients(req, res, next)
}

async function UpdatePatient(req, res, next) {

    let validationErrors = []
    const {
        Approvaldate,
        DepartmentID,
        CaseID,
        PatientdefineID,
        Uuid,
        Stocks
    } = req.body


    if (!validator.isUUID(PatientdefineID)) {
        validationErrors.push(messages.ERROR.PATIENTDEFINE_NOT_FOUND)
    }
    if (!validator.isUUID(DepartmentID)) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED)
    }
    if (!validator.isUUID(CaseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.CASEID_REQUIRED)
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
            return next(createNotfounderror([messages.ERROR.PATIENT_NOT_FOUND], req.language))
        }
        if (patient.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PATIENT_NOT_ACTIVE], req.language))
        }

        await db.patientModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await db.patientmovementModel.create({
            Uuid: uuid(),
            Type: patientmovementtypes.Patientupdate,
            PatientID: Uuid,
            UserID: req?.identity?.user?.Uuid || username,
            Info: '',
            Occureddate: new Date()
        }, { transaction: t })

        const stockdefines = await DoGet(config.services.Warehouse, `Stockdefines`)
        const stocktypes = await DoGet(config.services.Warehouse, `Stocktypes`)

        await DoDelete(config.services.Warehouse, `Stocks/DeleteStockByWarehouseID/${Uuid}`)

        for (const stock of Stocks) {

            const {
                StockdefineID,
                Type,
                Amount,
                Skt
            } = stock

            if (!validator.isUUID(StockdefineID)) {
                validationErrors.push(messages.VALIDATION_ERROR.STOCKDEFINEID_REQUIRED)
            }
            if (!validator.isNumber(Type)) {
                validationErrors.push(messages.VALIDATION_ERROR.TYPE_REQUIRED)
            }
            if (!validator.isNumber(Number(Amount))) {
                validationErrors.push(messages.VALIDATION_ERROR.AMOUNT_REQUIRED)
            }

            if (validationErrors.length > 0) {
                return next(createValidationError(validationErrors, req.language))
            }

            const stockdefine = stockdefines.find(u => u.Uuid === StockdefineID)
            const stocktype = stocktypes.find(u => u.Uuid === stockdefine?.StocktypeID)

            if (stocktype?.Issktneed) {
                if (!validator.isString(Skt)) {
                    next(createValidationError([messages.VALIDATION_ERROR.SKT_REQUIRED], req.language))
                }
            }

            await DoPost(config.services.Warehouse, `Stocks/AddStockWithoutMovement`, {
                ...{
                    Order: stock?.Order,
                    Type: stock?.Type,
                    Amount: stock?.Amount,
                    StocktypeID: stock?.StocktypeID,
                    StockgrouptypeID: stock?.StockgrouptypeID,
                    StockdefineID: stock?.StockdefineID,
                    Isapproved: true,
                    Isdeactivated: stock?.Isdeactivated,
                    Deactivateinfo: stock?.Deactivateinfo,
                    Skt: stock?.Skt,
                    Info: stock?.Info,
                    Iscompleted: stock?.Iscompleted,
                },
                WarehouseID: Uuid,
            })
        }

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
    req.Uuid = Uuid
    GetPatients(req, res, next)
}

async function UpdatePatientDates(req, res, next) {

    let validationErrors = []
    const {
        Uuid,
        Happensdate,
        Approvaldate,
        Registerdate,
    } = req.body


    if (!validator.isISODate(Approvaldate)) {
        validationErrors.push(messages.VALIDATION_ERROR.APPROVALDATE_REQUIRED)
    }
    if (!validator.isISODate(Registerdate)) {
        validationErrors.push(messages.VALIDATION_ERROR.REGISTERDATE_REQUIRED)
    }
    if (!validator.isISODate(Happensdate)) {
        validationErrors.push(messages.VALIDATION_ERROR.HAPPENSDATE_REQUIRED)
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
            return next(createNotfounderror([messages.ERROR.PATIENT_NOT_FOUND], req.language))
        }
        if (patient.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PATIENT_NOT_ACTIVE], req.language))
        }

        await db.patientModel.update({
            ...patient,
            Registerdate: Registerdate,
            Approvaldate: Approvaldate,
            Happensdate: Happensdate,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await db.patientmovementModel.create({
            Uuid: uuid(),
            Type: patientmovementtypes.Patientupdate,
            PatientID: Uuid,
            UserID: req?.identity?.user?.Uuid || username,
            Info: '',
            Occureddate: new Date()
        }, { transaction: t })

        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } })

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
    req.Uuid = Uuid
    GetPatients(req, res, next)
}

async function CheckPatient(req, res, next) {

    let validationErrors = []

    const {
        Uuid,
        CaseID,
        Checkinfo,
        Isoninstitution
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PATIENTID)
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
        const patient = await db.patientModel.findOne({ where: { Uuid: Uuid } })
        if (!patient) {
            return next(createNotfounderror([messages.ERROR.PATIENT_NOT_FOUND], req.language))
        }
        if (patient.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PATIENT_NOT_ACTIVE], req.language))
        }
        if (patient.Ischecked === true) {
            return next(createAccessDenied([messages.ERROR.PATIENT_IS_CHECKED], req.language))
        }
        if (patient.Isapproved === true) {
            return next(createAccessDenied([messages.ERROR.PATIENT_IS_APPROVED], req.language))
        }
        if (patient.Ispreregistration === true) {
            return next(createAccessDenied([messages.ERROR.PATIENT_IS_COMPLETED], req.language))
        }

        const {
            Approvaldate,
            DepartmentID,
            PatientdefineID,
        } = patient

        if (!validator.isUUID(PatientdefineID)) {
            validationErrors.push(messages.ERROR.PATIENTDEFINE_NOT_FOUND)
        }
        if (!validator.isUUID(DepartmentID)) {
            validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED)
        }
        if (!validator.isISODate(Approvaldate)) {
            validationErrors.push(messages.VALIDATION_ERROR.APPROVALDATE_REQUIRED)
        }

        await db.patientModel.update({
            ...patient,
            CaseID: CaseID,
            Patientchecktime: new Date(),
            CheckeduserID: req?.identity?.user?.Uuid || username,
            Ispreregistration: true,
            Ischecked: true,
            Isapproved: false,
            Isoninstitution: Isoninstitution || false,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await db.patientmovementModel.create({
            Uuid: uuid(),
            PatientID: Uuid,
            Type: patientmovementtypes.Patientcheck,
            UserID: req?.identity?.user?.Uuid || username,
            Info: Checkinfo || '',
            Occureddate: new Date()
        }, { transaction: t })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    req.Uuid = Uuid
    GetPatients(req, res, next)
}

async function ApprovePatient(req, res, next) {

    let validationErrors = []

    const {
        Uuid,
        CaseID,
        Approveinfo,
        Isoninstitution
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PATIENTID)
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

        const patient = await db.patientModel.findOne({ where: { Uuid: Uuid } })
        if (!patient) {
            return next(createNotfounderror([messages.ERROR.PATIENT_NOT_FOUND], req.language))
        }
        if (patient.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PATIENT_NOT_ACTIVE], req.language))
        }
        if (patient.Ischecked === false) {
            return next(createAccessDenied([messages.ERROR.PATIENT_IS_CHECKED], req.language))
        }
        if (patient.Isapproved === true) {
            return next(createAccessDenied([messages.ERROR.PATIENT_IS_APPROVED], req.language))
        }
        if (patient.Ispreregistration === true) {
            return next(createAccessDenied([messages.ERROR.PATIENT_IS_COMPLETED], req.language))
        }

        const {
            Approvaldate,
            DepartmentID,
            PatientdefineID,
        } = patient

        if (!validator.isUUID(PatientdefineID)) {
            validationErrors.push(messages.ERROR.PATIENTDEFINE_NOT_FOUND)
        }
        if (!validator.isUUID(DepartmentID)) {
            validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED)
        }
        if (!validator.isISODate(Approvaldate)) {
            validationErrors.push(messages.VALIDATION_ERROR.APPROVALDATE_REQUIRED)
        }

        await db.patientModel.update({
            ...patient,
            CaseID: CaseID,
            Patientapprovetime: new Date(),
            ApproveduserID: req?.identity?.user?.Uuid || username,
            Ispreregistration: true,
            Ischecked: true,
            Isapproved: true,
            Isoninstitution: Isoninstitution || false,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await db.patientmovementModel.create({
            Uuid: uuid(),
            PatientID: Uuid,
            Type: patientmovementtypes.Patientapprove,
            UserID: req?.identity?.user?.Uuid || username,
            Info: Approveinfo || '',
            Occureddate: new Date()
        }, { transaction: t })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    req.Uuid = Uuid
    GetPatients(req, res, next)
}

async function CancelCheckPatient(req, res, next) {

    let validationErrors = []

    const {
        Uuid,
        CaseID,
        Cancelcheckinfo,
        Isoninstitution
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PATIENTID)
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
        const patient = await db.patientModel.findOne({ where: { Uuid: Uuid } })
        if (!patient) {
            return next(createNotfounderror([messages.ERROR.PATIENT_NOT_FOUND], req.language))
        }
        if (patient.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PATIENT_NOT_ACTIVE], req.language))
        }
        if (patient.Ischecked === false) {
            return next(createAccessDenied([messages.ERROR.PATIENT_IS_CHECKED], req.language))
        }
        if (patient.Isapproved === true) {
            return next(createAccessDenied([messages.ERROR.PATIENT_IS_APPROVED], req.language))
        }
        if (patient.Ispreregistration === true) {
            return next(createAccessDenied([messages.ERROR.PATIENT_IS_COMPLETED], req.language))
        }

        const {
            Approvaldate,
            DepartmentID,
            PatientdefineID,
        } = patient

        if (!validator.isUUID(PatientdefineID)) {
            validationErrors.push(messages.ERROR.PATIENTDEFINE_NOT_FOUND)
        }
        if (!validator.isUUID(DepartmentID)) {
            validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED)
        }
        if (!validator.isISODate(Approvaldate)) {
            validationErrors.push(messages.VALIDATION_ERROR.APPROVALDATE_REQUIRED)
        }

        await db.patientModel.update({
            ...patient,
            CaseID: CaseID,
            Patientchecktime: null,
            CheckeduserID: null,
            Ispreregistration: true,
            Ischecked: false,
            Isapproved: false,
            Isoninstitution: Isoninstitution || false,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await db.patientmovementModel.create({
            Uuid: uuid(),
            PatientID: Uuid,
            Type: patientmovementtypes.Patientcancelcheck,
            UserID: req?.identity?.user?.Uuid || username,
            Info: Cancelcheckinfo || '',
            Occureddate: new Date()
        }, { transaction: t })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    req.Uuid = Uuid
    GetPatients(req, res, next)
}

async function CancelApprovePatient(req, res, next) {

    let validationErrors = []

    const {
        Uuid,
        CaseID,
        Cancelapproveinfo,
        Isoninstitution
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PATIENTID)
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
        const patient = await db.patientModel.findOne({ where: { Uuid: Uuid } })
        if (!patient) {
            return next(createNotfounderror([messages.ERROR.PATIENT_NOT_FOUND], req.language))
        }
        if (patient.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PATIENT_NOT_ACTIVE], req.language))
        }
        if (patient.Ischecked === false) {
            return next(createAccessDenied([messages.ERROR.PATIENT_IS_CHECKED], req.language))
        }
        if (patient.Isapproved === false) {
            return next(createAccessDenied([messages.ERROR.PATIENT_IS_APPROVED], req.language))
        }
        if (patient.Ispreregistration === true) {
            return next(createAccessDenied([messages.ERROR.PATIENT_IS_COMPLETED], req.language))
        }

        const {
            Approvaldate,
            DepartmentID,
            PatientdefineID,
        } = patient

        if (!validator.isUUID(PatientdefineID)) {
            validationErrors.push(messages.ERROR.PATIENTDEFINE_NOT_FOUND)
        }
        if (!validator.isUUID(DepartmentID)) {
            validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED)
        }
        if (!validator.isISODate(Approvaldate)) {
            validationErrors.push(messages.VALIDATION_ERROR.APPROVALDATE_REQUIRED)
        }

        await db.patientModel.update({
            ...patient,
            CaseID: CaseID,
            Patientapprovetime: null,
            ApproveduserID: null,
            Ispreregistration: true,
            Ischecked: true,
            Isapproved: false,
            Isoninstitution: Isoninstitution || false,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await db.patientmovementModel.create({
            Uuid: uuid(),
            PatientID: Uuid,
            Type: patientmovementtypes.Patientcancelapprove,
            UserID: req?.identity?.user?.Uuid || username,
            Info: Cancelapproveinfo || '',
            Occureddate: new Date()
        }, { transaction: t })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    req.Uuid = Uuid
    GetPatients(req, res, next)
}

async function CompletePatient(req, res, next) {

    let validationErrors = []

    const {
        Uuid,
        CaseID,
        Completeinfo,
        isTransferstocks,
        Isoninstitution,
        Registerdate,
        FloorID,
        RoomID,
        BedID
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PURCHASEORDERID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PURCHASEORDERID)
    }
    if (!validator.isBoolean(isTransferstocks)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISTRANSFERSTOCKS_REQUIRED)
    }
    if (!validator.isBoolean(Isoninstitution)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISONINSTITUTION_REQUIRED)
    }
    if (!validator.isISODate(Registerdate)) {
        validationErrors.push(messages.VALIDATION_ERROR.REGISTERDATE_REQUIRED)
    }
    if (!validator.isUUID(FloorID)) {
        validationErrors.push(messages.VALIDATION_ERROR.FLOORID_REQUIRED)
    }
    if (!validator.isUUID(RoomID)) {
        validationErrors.push(messages.VALIDATION_ERROR.ROOMID_REQUIRED)
    }
    if (!validator.isUUID(BedID)) {
        validationErrors.push(messages.VALIDATION_ERROR.BEDID_REQUIRED)
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
        const patient = await db.patientModel.findOne({ where: { Uuid: Uuid } })
        if (!patient) {
            return next(createNotfounderror([messages.ERROR.PATIENT_NOT_FOUND], req.language))
        }
        if (patient.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PATIENT_NOT_ACTIVE], req.language))
        }
        if (patient.Ischecked === false) {
            return next(createAccessDenied([messages.ERROR.PATIENT_IS_CHECKED], req.language))
        }
        if (patient.Isapproved === false) {
            return next(createAccessDenied([messages.ERROR.PATIENT_IS_APPROVED], req.language))
        }
        if (patient.Ispreregistration === true) {
            return next(createAccessDenied([messages.ERROR.PATIENT_IS_COMPLETED], req.language))
        }

        const {
            Approvaldate,
            DepartmentID,
            PatientdefineID,
        } = patient

        if (!validator.isUUID(PatientdefineID)) {
            validationErrors.push(messages.ERROR.PATIENTDEFINE_NOT_FOUND)
        }
        if (!validator.isUUID(DepartmentID)) {
            validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED)
        }
        if (!validator.isISODate(Approvaldate)) {
            validationErrors.push(messages.VALIDATION_ERROR.APPROVALDATE_REQUIRED)
        }
        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.language))
        }

        await DoPut(config.services.Setting, 'Beds/ChangeBedOccupied', {
            BedID: BedID,
            Isoccupied: true,
            PatientID: patient?.Uuid
        })

        const patientstocks = await DoGet(config.services.Warehouse, `Stocks/GetStocksByWarehouseID/${patient?.Uuid}`)

        if (!isTransferstocks) {
            let reqBody = []
            for (const stock of patientstocks) {
                reqBody.push({
                    StockID: stock?.Uuid,
                    Amount: stock?.Amount || 0,
                    Movementdate: new Date(),
                    Movementtype: 1,
                    Isapproved: true,
                })
            }

            if (reqBody.length > 0) {
                await DoPost(config.services.Warehouse, 'Stockmovements/InsertList', {
                    Stockmovements: reqBody
                })
            }
        }

        await db.patientModel.update({
            ...patient,
            FloorID: FloorID,
            RoomID: RoomID,
            BedID: BedID,
            CaseID: CaseID,
            Patientcompletetime: new Date(),
            CompleteduserID: req?.identity?.user?.Uuid || username,
            Ispreregistration: false,
            Ischecked: true,
            Isapproved: true,
            Isoninstitution: Isoninstitution || false,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await db.patientmovementModel.create({
            Uuid: uuid(),
            PatientID: Uuid,
            Type: patientmovementtypes.Patientcomplete,
            UserID: req?.identity?.user?.Uuid || username,
            Info: Completeinfo || '',
            Occureddate: new Date()
        }, { transaction: t })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    req.Uuid = Uuid
    GetPatients(req, res, next)
}

async function GetPatientByPlace(req, res, next) {

    const {
        BedID,
        RoomID,
        FloorID,
    } = req.body

    let validationErrors = []
    if (!validator.isUUID(BedID)) {
        validationErrors.push(messages.VALIDATION_ERROR.BEDID_REQUIRED)
    }
    if (!validator.isUUID(RoomID)) {
        validationErrors.push(messages.VALIDATION_ERROR.ROOMID_REQUIRED)
    }
    if (!validator.isUUID(FloorID)) {
        validationErrors.push(messages.VALIDATION_ERROR.FLOORID_REQUIRED)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const patient = await db.patientModel.findOne({
            where: {
                BedID: BedID,
                RoomID: RoomID,
                FloorID: FloorID,
            }
        });
        if (!patient) {
            return next(createNotfounderror([messages.ERROR.PATIENT_NOT_FOUND], req.language))
        }
        if (!patient.Isactive) {
            return createNotfounderror([messages.ERROR.PATIENT_NOT_ACTIVE])
        }
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

async function PatientsRemove(req, res, next) {
    let validationErrors = []

    const {
        Uuid,
        CaseID,
        Leftinfo
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PATIENTID)
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
        const patient = await db.patientModel.findOne({ where: { Uuid: Uuid } })
        if (!patient) {
            return next(createNotfounderror([messages.ERROR.PATIENT_NOT_FOUND], req.language))
        }
        if (patient.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PATIENT_NOT_ACTIVE], req.language))
        }
        if (patient.Ischecked === false) {
            return next(createAccessDenied([messages.ERROR.PATIENT_IS_CHECKED], req.language))
        }
        if (patient.Isapproved === false) {
            return next(createAccessDenied([messages.ERROR.PATIENT_IS_APPROVED], req.language))
        }
        if (patient.Ispreregistration === true) {
            return next(createAccessDenied([messages.ERROR.PATIENT_IS_COMPLETED], req.language))
        }

        const {
            Approvaldate,
            DepartmentID,
            PatientdefineID,
            Isleft,
            Isalive
        } = patient

        if (!validator.isISODate(Approvaldate)) {
            validationErrors.push(messages.ERROR.APPROVALDATE_REQUIRED3)
        }
        if (!validator.isUUID(PatientdefineID)) {
            validationErrors.push(messages.ERROR.PATIENTDEFINE_NOT_FOUND)
        }
        if (!validator.isUUID(DepartmentID)) {
            validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED)
        }
        if (!validator.isBoolean(Isleft)) {
            validationErrors.push(messages.VALIDATION_ERROR.ISLEFT_REQUIRED)
        }
        if (Isleft === true) {
            validationErrors.push(messages.VALIDATION_ERROR.PATIENT_ALREADY_LEFT)
        }
        if (!validator.isBoolean(Isalive)) {
            validationErrors.push(messages.VALIDATION_ERROR.ISALIVE_REQUIRED)
        }
        if (Isalive === false) {
            validationErrors.push(messages.VALIDATION_ERROR.PATIENT_ALREADY_DEAD)
        }

        try {
            await axios({
                method: 'PUT',
                url: config.services.Setting + "Beds/ChangeBedOccupied",
                headers: {
                    session_key: config.session.secret
                },
                data: {
                    BedID: patient?.BedID,
                    Isoccupied: false
                }
            })
        } catch (error) {
            return next(requestErrorCatcher(error, 'Setting'))
        }

        await db.patientModel.update({
            ...patient,
            CaseID: CaseID,
            Isoninstitution: false,
            Isleft: true,
            Leftinfo: Leftinfo,
            BedID: null,
            RoomID: null,
            FloorID: null,
            Leavedate: new Date(),
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })


        await db.patientmovementModel.create({
            Uuid: uuid(),
            PatientID: Uuid,
            Type: patientmovementtypes.Patientleft,
            UserID: req?.identity?.user?.Uuid || username,
            Info: Leftinfo || '',
            Occureddate: new Date()
        }, { transaction: t })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    req.Uuid = Uuid
    GetPatients(req, res, next)
}

async function PatientsDead(req, res, next) {
    let validationErrors = []

    const {
        Uuid,
        CaseID,
        Deadinfo
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PATIENTID)
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
        const patient = await db.patientModel.findOne({ where: { Uuid: Uuid } })
        if (!patient) {
            return next(createNotfounderror([messages.ERROR.PATIENT_NOT_FOUND], req.language))
        }
        if (patient.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PATIENT_NOT_ACTIVE], req.language))
        }
        if (patient.Ischecked === false) {
            return next(createAccessDenied([messages.ERROR.PATIENT_IS_CHECKED], req.language))
        }
        if (patient.Isapproved === false) {
            return next(createAccessDenied([messages.ERROR.PATIENT_IS_APPROVED], req.language))
        }
        if (patient.Ispreregistration === true) {
            return next(createAccessDenied([messages.ERROR.PATIENT_IS_COMPLETED], req.language))
        }

        const {
            Approvaldate,
            DepartmentID,
            PatientdefineID,
            Isleft,
            Isalive
        } = patient

        if (!validator.isISODate(Approvaldate)) {
            validationErrors.push(messages.ERROR.APPROVALDATE_REQUIRED3)
        }
        if (!validator.isUUID(PatientdefineID)) {
            validationErrors.push(messages.ERROR.PATIENTDEFINE_NOT_FOUND)
        }
        if (!validator.isUUID(DepartmentID)) {
            validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED)
        }
        if (!validator.isBoolean(Isleft)) {
            validationErrors.push(messages.VALIDATION_ERROR.ISLEFT_REQUIRED)
        }
        if (Isleft === true) {
            validationErrors.push(messages.VALIDATION_ERROR.PATIENT_ALREADY_LEFT)
        }
        if (!validator.isBoolean(Isalive)) {
            validationErrors.push(messages.VALIDATION_ERROR.ISALIVE_REQUIRED)
        }
        if (Isalive === false) {
            validationErrors.push(messages.VALIDATION_ERROR.PATIENT_ALREADY_DEAD)
        }

        try {
            await axios({
                method: 'PUT',
                url: config.services.Setting + "Beds/ChangeBedOccupied",
                headers: {
                    session_key: config.session.secret
                },
                data: {
                    BedID: patient?.BedID,
                    Isoccupied: false
                }
            })
        } catch (error) {
            return next(requestErrorCatcher(error, 'Setting'))
        }

        await db.patientModel.update({
            ...patient,
            CaseID: CaseID,
            Isoninstitution: false,
            Isalive: false,
            BedID: null,
            RoomID: null,
            FloorID: null,
            Deadinfo: Deadinfo,
            Deathdate: new Date(),
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await db.patientmovementModel.create({
            Uuid: uuid(),
            PatientID: Uuid,
            Type: patientmovementtypes.Patientdead,
            UserID: req?.identity?.user?.Uuid || username,
            Info: Deadinfo || '',
            Occureddate: new Date()
        }, { transaction: t })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    req.Uuid = Uuid
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

        await db.patientModel.update({
            ...patient,
            CaseID: CaseID,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: PatientID } }, { transaction: t })

        await db.patientmovementModel.create({
            Uuid: uuid(),
            PatientID: PatientID,
            Type: patientmovementtypes.Patientcasechange,
            UserID: req?.identity?.user?.Uuid || username,
            Info: '',
            Occureddate: new Date()
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

            await db.patientModel.update({
                ...patient,
                CaseID: CaseID,
                Updateduser: username,
                Updatetime: new Date(),
            }, { where: { Uuid: PatientID } }, { transaction: t })

            await db.patientmovementModel.create({
                Uuid: uuid(),
                PatientID: PatientID,
                Type: patientmovementtypes.Patientcasechange,
                UserID: req?.identity?.user?.Uuid || username,
                Info: '',
                Occureddate: new Date()
            }, { transaction: t })
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
        BedID,
        Willempty
    } = req.body

    if (!validator.isUUID(PatientID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!Willempty) {
        if (!validator.isUUID(FloorID)) {
            validationErrors.push(messages.VALIDATION_ERROR.FLOORID_REQUIRED)
        }
        if (!validator.isUUID(RoomID)) {
            validationErrors.push(messages.VALIDATION_ERROR.ROOMID_REQUIRED)
        }
        if (!validator.isUUID(BedID)) {
            validationErrors.push(messages.VALIDATION_ERROR.BEDID_REQUIRED)
        }
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

        const selectedPatientOldBed = patient?.BedID
        const targetBedPatient = await db.patientModel.findOne({ where: { BedID: BedID || '' } })

        const newBed = {
            Bed: BedID,
            Room: RoomID,
            Floor: FloorID
        }

        const oldBed = {
            Bed: patient?.BedID,
            Room: patient?.RoomID,
            Floor: patient?.FloorID
        }

        if (Willempty) {
            DoPut(config.services.Setting, "Beds/ChangeBedOccupied", {
                BedID: oldBed?.Bed,
                Isoccupied: false
            })

            await db.patientModel.update({
                ...patient,
                FloorID: null,
                BedID: null,
                RoomID: null,
                Updateduser: username,
                Updatetime: new Date(),
            }, { where: { Uuid: PatientID } }, { transaction: t })
        } else {
            // Hedefte hasta var, Değişen hastanında yatağı var
            // Hedef yataktaki hastayı, şuanki hastanın yatağına ata
            // Değişen hastayı şuanki yatağa ata
            if (validator.isUUID(selectedPatientOldBed) && validator.isUUID(targetBedPatient?.Uuid)) {

                DoPut(config.services.Setting, "Beds/ChangeBedOccupied", {
                    BedID: newBed.Bed,
                    PatientID: patient?.Uuid,
                    Isoccupied: true
                })

                DoPut(config.services.Setting, "Beds/ChangeBedOccupied", {
                    BedID: oldBed?.Bed,
                    PatientID: targetBedPatient?.Uuid,
                    Isoccupied: true
                })

                await db.patientModel.update({
                    ...targetBedPatient,
                    FloorID: oldBed.Floor,
                    BedID: oldBed.Bed,
                    RoomID: oldBed.Room,
                    Updateduser: username,
                    Updatetime: new Date(),
                }, { where: { Uuid: targetBedPatient?.Uuid } }, { transaction: t })

                await db.patientModel.update({
                    ...patient,
                    FloorID: newBed.Floor,
                    BedID: newBed.Bed,
                    RoomID: newBed.Room,
                    Updateduser: username,
                    Updatetime: new Date(),
                }, { where: { Uuid: PatientID } }, { transaction: t })
            }

            // Target dont have patient , patient has bed
            // Hedef yatakta hasta yok 
            // değişen hastanın şuanki yatağa ata, hastanın eski yatağını boşalt
            if (validator.isUUID(selectedPatientOldBed) && !validator.isUUID(targetBedPatient?.Uuid)) {

                DoPut(config.services.Setting, "Beds/ChangeBedOccupied", {
                    BedID: newBed.Bed,
                    PatientID: patient?.Uuid,
                    Isoccupied: true
                })

                DoPut(config.services.Setting, "Beds/ChangeBedOccupied", {
                    BedID: oldBed?.Bed,
                    Isoccupied: false
                })

                await db.patientModel.update({
                    ...patient,
                    FloorID: newBed.Floor,
                    BedID: newBed.Bed,
                    RoomID: newBed.Room,
                    Updateduser: username,
                    Updatetime: new Date(),
                }, { where: { Uuid: PatientID } }, { transaction: t })

            }

            // Target has patient , patient dont have bed
            // Hastanın Eski yatağı yok, hedefteki yatakta hasta var
            // hedefteki hastayı boşa al
            // hedefteki yatağı güncelle, hastayı güncelle
            if (!validator.isUUID(selectedPatientOldBed) && validator.isUUID(targetBedPatient?.Uuid)) {

                DoPut(config.services.Setting, "Beds/ChangeBedOccupied", {
                    BedID: newBed.Bed,
                    PatientID: patient?.Uuid,
                    Isoccupied: true
                })

                await db.patientModel.update({
                    ...targetBedPatient,
                    FloorID: null,
                    BedID: null,
                    RoomID: null,
                    Updateduser: username,
                    Updatetime: new Date(),
                }, { where: { Uuid: targetBedPatient?.Uuid } }, { transaction: t })

                await db.patientModel.update({
                    ...patient,
                    FloorID: newBed.Floor,
                    BedID: newBed.Bed,
                    RoomID: newBed.Room,
                    Updateduser: username,
                    Updatetime: new Date(),
                }, { where: { Uuid: PatientID } }, { transaction: t })

            }

            // Target dont have patient, patient dont have bed
            // Hastanın yatağı yok
            // hedef yatakta hasta yok 
            if (!validator.isUUID(selectedPatientOldBed) && !validator.isUUID(targetBedPatient?.Uuid)) {

                DoPut(config.services.Setting, "Beds/ChangeBedOccupied", {
                    BedID: newBed.Bed,
                    PatientID: patient?.Uuid,
                    Isoccupied: true
                })

                await db.patientModel.update({
                    ...patient,
                    FloorID: newBed.Floor,
                    BedID: newBed.Bed,
                    RoomID: newBed.Room,
                    Updateduser: username,
                    Updatetime: new Date(),
                }, { where: { Uuid: PatientID } }, { transaction: t })
            }
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

async function DeletePreregisrations(req, res, next) {

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
        if (patient.Ispreregistration === false) {
            return next(createAccessDenied([messages.ERROR.PATIENT_NOT_ON_PREREGISRATION], req.language))
        }

        try {
            await axios({
                method: 'DELETE',
                url: config.services.Warehouse + "Stocks/DeleteStockByWarehouseID/" + patient?.Uuid,
                headers: {
                    session_key: config.session.secret
                },
            })
        } catch (error) {
            return next(requestErrorCatcher(error, 'Setting'))
        }

        try {
            await axios({
                method: 'DELETE',
                url: config.services.File + "Files/DeleteFileByParentID/" + patient?.Uuid,
                headers: {
                    session_key: config.session.secret
                },
            })
        } catch (error) {
            return next(requestErrorCatcher(error, 'Setting'))
        }

        await db.patientModel.update({
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: false
        }, { where: { Uuid: patient?.Uuid } }, { transaction: t })

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
    GetPatient,
    AddPatient,
    UpdatePatient,
    UpdatePatientcase,
    UpdatePatienttododefines,
    DeletePatient,
    GetPatientByPlace,
    UpdatePatientplace,
    Createfromtemplate,
    UpdatePatientsupportplans,
    TransferPatientplace,
    UpdatePatientscase,
    CheckPatient,
    ApprovePatient,
    CancelCheckPatient,
    CancelApprovePatient,
    CompletePatient,
    PatientsRemove,
    DeletePreregisrations,
    PatientsDead,
    UpdatePatientDates
}