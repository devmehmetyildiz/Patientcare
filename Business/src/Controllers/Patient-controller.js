const config = require("../Config")
const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const DoGet = require("../Utilities/DoGet")
const DoPost = require("../Utilities/DoPost")
const { sequelizeErrorCatcher, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')
const { patientmovementtypes } = require('../Constants/Patientmovementypes')
const DoDelete = require("../Utilities/DoDelete")
const DoPut = require("../Utilities/DoPut")

async function GetPatients(req, res, next) {
    try {
        let data = null
        const patients = await db.patientModel.findAll()
        for (const patient of patients) {
            patient.Events = await db.patienteventmovementModel.findAll({
                where: {
                    PatientID: patient?.Uuid,
                    Isactive: true
                },
                order: [['Occureddate', 'ASC']]
            });
            patient.Movements = await db.patientmovementModel.findAll({
                where: {
                    PatientID: patient?.Uuid,
                    Isactive: true
                },
                order: [['Occureddate', 'ASC']]
            });
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
        validationErrors.push(req.t('Patients.Error.PatientIDRequired'))
    }
    if (!validator.isUUID(req.params.patientId)) {
        validationErrors.push(req.t('Patients.Error.UnsupportedPatientID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patients'), req.language))
    }

    try {
        const patient = await db.patientModel.findOne({ where: { Uuid: req.params.patientId } });
        patient.Movements = await db.patientmovementModel.findAll({
            where: {
                PatientID: patient?.Uuid,
                Isactive: true
            },
            order: [['Occureddate', 'ASC']]
        });
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
        patient.Events = await db.patienteventmovementModel.findAll({
            where: {
                PatientID: patient?.Uuid,
                Isactive: true
            },
            order: [['Occureddate', 'ASC']]
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
            validationErrors.push(req.t('Patients.Error.CountryIDRequired'))
        }
    } else {
        if (!validator.isUUID(PatientdefineID)) {
            validationErrors.push(req.t('Patients.Error.PatientdefineRequired'))
        }
    }
    if (!validator.isUUID(DepartmentID)) {
        validationErrors.push(req.t('Patients.Error.DepartmentIDRequired'))
    }
    if (!validator.isUUID(CaseID)) {
        validationErrors.push(req.t('Patients.Error.CaseIDRequired'))
    }
    if (!validator.isISODate(Approvaldate)) {
        validationErrors.push(req.t('Patients.Error.ApprovaldateRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patients'), req.language))
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
            Isalive: true,
            Isleft: false,
            Isactive: true
        }, { transaction: t })

        await db.patientmovementModel.create({
            Uuid: uuid(),
            Type: patientmovementtypes.Patientcreate,
            CaseID: CaseID,
            PatientID: patientuuid,
            UserID: req?.identity?.user?.Uuid || username,
            Info: '',
            Occureddate: new Date(),
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
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
                validationErrors.push(req.t('Patients.Error.StockdefineIDRequired'))
            }
            if (!validator.isNumber(Type)) {
                validationErrors.push(req.t('Patients.Error.StocktypeRequired'))
            }
            if (!validator.isNumber(Number(Amount))) {
                validationErrors.push(req.t('Patients.Error.AmountRequired'))
            }

            if (validationErrors.length > 0) {
                return next(createValidationError(validationErrors, req.t('Patients'), req.language))
            }

            const stockdefine = stockdefines.find(u => u.Uuid === StockdefineID)
            const stocktype = stocktypes.find(u => u.Uuid === stockdefine?.StocktypeID)

            if (stocktype?.Issktneed) {
                if (!validator.isString(Skt)) {
                    return next(createValidationError(req.t('Patients.Error.SktRequired'), req.t('Patients'), req.language))
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
            service: req.t('Patients'),
            role: 'patientnotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Hastası ${username} tarafından Oluşturuldu.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient Created By ${username}`
            }[req.language],
            pushurl: '/Patients'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    req.Uuid = patientuuid
    GetPatients(req, res, next)
}

async function AddPatienteventmovement(req, res, next) {

    let validationErrors = []
    const {
        PatientID,
        EventID,
        Info,
        Occureddate,
    } = req.body

    if (!validator.isUUID(PatientID)) {
        validationErrors.push(req.t('Patients.Error.PatientIDRequired'))
    }
    if (!validator.isUUID(EventID)) {
        validationErrors.push(req.t('Patients.Error.EventIDRequired'))
    }
    if (!validator.isISODate(Occureddate)) {
        validationErrors.push(req.t('Patients.Error.OccureddateRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patients'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    let eventmovementuuid = uuid()
    try {
        await db.patienteventmovementModel.create({
            Uuid: eventmovementuuid,
            PatientID: PatientID,
            EventID: EventID,
            UserID: req?.identity?.user?.Uuid || username,
            Info: Info,
            Occureddate: Occureddate,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        const patient = await db.patientModel.findOne({ where: { Uuid: PatientID } })
        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } })

        await CreateNotification({
            type: types.Create,
            service: req.t('Patients'),
            role: 'patientnotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Hastasına Ait Hareket ${username} tarafından Oluşturuldu.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient Movement Created By ${username}`
            }[req.language],
            pushurl: '/Patients'
        })

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
        Approvaldate,
        DepartmentID,
        CaseID,
        PatientdefineID,
        Uuid,
        Stocks
    } = req.body


    if (!validator.isUUID(PatientdefineID)) {
        validationErrors.push(req.t('Patients.Error.PatientdefineIDRequired'))
    }
    if (!validator.isUUID(DepartmentID)) {
        validationErrors.push(req.t('Patients.Error.DepartmentIDRequired'))
    }
    if (!validator.isUUID(CaseID)) {
        validationErrors.push(req.t('Patients.Error.CaseIDRequired'))
    }
    if (!validator.isISODate(Approvaldate)) {
        validationErrors.push(req.t('Patients.Error.ApprovaldateRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Patients.Error.PatientIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patients.Error.UnsupportedPatientID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patients'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patient = await db.patientModel.findOne({ where: { Uuid: Uuid } })
        if (!patient) {
            return next(createNotFoundError(req.t('Patients.Error.NotFound'), req.t('Patients'), req.language))
        }
        if (patient.Isactive === false) {
            return next(createNotFoundError(req.t('Patients.Error.NotActive'), req.t('Patients'), req.language))
        }

        await db.patientModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.patientmovementModel.create({
            Uuid: uuid(),
            Type: patientmovementtypes.Patientupdate,
            CaseID: CaseID,
            PatientID: Uuid,
            UserID: req?.identity?.user?.Uuid || username,
            Info: '',
            Occureddate: new Date(),
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
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
                validationErrors.push(req.t('Patients.Error.StockdefineIDRequired'))
            }
            if (!validator.isNumber(Type)) {
                validationErrors.push(req.t('Patients.Error.StocktypeRequired'))
            }
            if (!validator.isNumber(Number(Amount))) {
                validationErrors.push(req.t('Patients.Error.AmountRequired'))
            }

            if (validationErrors.length > 0) {
                return next(createValidationError(validationErrors, req.t('Patients'), req.language))
            }

            const stockdefine = stockdefines.find(u => u.Uuid === StockdefineID)
            const stocktype = stocktypes.find(u => u.Uuid === stockdefine?.StocktypeID)

            if (stocktype?.Issktneed) {
                if (!validator.isString(Skt)) {
                    return next(createValidationError(req.t('Patients.Error.SktRequired'), req.t('Patients'), req.language))
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
            service: req.t('Patients'),
            role: 'patientnotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Hastası ${username} tarafından Güncellendi.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient Updated By ${username}`
            }[req.language],
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
        Info,
        Guardiannote,
    } = req.body


    if (!validator.isISODate(Approvaldate)) {
        validationErrors.push(req.t('Patients.Error.ApprovaldateRequired'))
    }
    if (!validator.isISODate(Happensdate)) {
        validationErrors.push(req.t('Patients.Error.HappensdataRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Patients.Error.PatientIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patients.Error.UnsupportedPatientID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patients'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patient = await db.patientModel.findOne({ where: { Uuid: Uuid } })
        if (!patient) {
            return next(createNotFoundError(req.t('Patients.Error.NotFound'), req.t('Patients'), req.language))
        }
        if (patient.Isactive === false) {
            return next(createNotFoundError(req.t('Patients.Error.NotActive'), req.t('Patients'), req.language))
        }

        await db.patientModel.update({
            ...patient,
            Approvaldate: Approvaldate,
            Happensdate: Happensdate,
            Info: Info,
            Guardiannote: Guardiannote,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.patientmovementModel.create({
            Uuid: uuid(),
            Type: patientmovementtypes.Patientupdate,
            CaseID: patient?.CaseID,
            PatientID: Uuid,
            UserID: req?.identity?.user?.Uuid || username,
            Info: '',
            Occureddate: new Date(),
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } })

        await CreateNotification({
            type: types.Update,
            service: req.t('Patients'),
            role: 'patientnotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Hastasına ait Kurum Bilgileri ${username} tarafından Güncellendi.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient's Organization Knowledges Updated By ${username}`
            }[req.language],
            pushurl: '/Patients'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    req.Uuid = Uuid
    GetPatients(req, res, next)
}

async function UpdatePatientmovements(req, res, next) {

    let validationErrors = []
    const {
        Uuid,
        Occureddate
    } = req.body


    if (!validator.isISODate(Occureddate)) {
        validationErrors.push(req.t('Patients.Error.OccureddateRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Patients.Error.PatientmovementIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patients.Error.UnsupportedPatientmovementID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patients'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patientmovement = await db.patientmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!patientmovement) {
            return next(createNotFoundError(req.t('Patients.Error.NotFound'), req.t('Patients'), req.language))
        }
        if (patientmovement.Isactive === false) {
            return next(createNotFoundError(req.t('Patients.Error.NotActive'), req.t('Patients'), req.language))
        }

        await db.patientmovementModel.update({
            Occureddate: Occureddate,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        const patient = await db.patientModel.findOne({ where: { Uuid: patientmovement?.PatientID } })
        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } })

        await CreateNotification({
            type: types.Update,
            service: req.t('Patients'),
            role: 'patientnotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Hastasına ait Hareket ${username} tarafından Güncellendi.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient's Movement Updated By ${username}`
            }[req.language],
            pushurl: '/Patients'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    req.Uuid = Uuid
    GetPatients(req, res, next)
}

async function UpdatePatienteventmovements(req, res, next) {

    let validationErrors = []
    const {
        Uuid,
        EventID,
        Occureddate,
        Info
    } = req.body

    if (!validator.isUUID(EventID)) {
        validationErrors.push(req.t('Patients.Error.EventIDRequired'))
    }
    if (!validator.isISODate(Occureddate)) {
        validationErrors.push(req.t('Patients.Error.OccureddateRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Patients.Error.PatienteventmovementIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patients.Error.UnsupportedPatienteventmovementID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patients'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patienteventmovement = await db.patienteventmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!patienteventmovement) {
            return next(createNotFoundError(req.t('Patients.Error.PatienteventmovementNotFound'), req.t('Patients'), req.language))
        }
        if (patienteventmovement.Isactive === false) {
            return next(createNotFoundError(req.t('Patients.Error.PatienteventmovementNotActive'), req.t('Patients'), req.language))
        }

        await db.patienteventmovementModel.update({
            EventID: EventID,
            Occureddate: Occureddate,
            Info: Info,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        const patient = await db.patientModel.findOne({ where: { Uuid: patienteventmovement?.PatientID } })
        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } })

        await CreateNotification({
            type: types.Update,
            service: req.t('Patients'),
            role: 'patientnotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Hastasına ait Vaka Hareketi ${username} tarafından Güncellendi.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient's Event Movement Updated By ${username}`
            }[req.language],
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
    } = req.body

    if (!Uuid) {
        validationErrors.push(req.t('Patients.Error.PatientIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patients.Error.UnsupportedPatientID'))
    }
    if (!validator.isUUID(CaseID)) {
        validationErrors.push(req.t('Patients.Error.CaseIDRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patients'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patient = await db.patientModel.findOne({ where: { Uuid: Uuid } })
        if (!patient) {
            return next(createNotFoundError(req.t('Patients.Error.NotFound'), req.t('Patients'), req.language))
        }
        if (patient.Isactive === false) {
            return next(createNotFoundError(req.t('Patients.Error.NotActive'), req.t('Patients'), req.language))
        }
        if (patient.Ischecked === true) {
            return next(createNotFoundError(req.t('Patients.Error.Checked'), req.t('Patients'), req.language))
        }
        if (patient.Isapproved === true) {
            return next(createNotFoundError(req.t('Patients.Error.Approved'), req.t('Patients'), req.language))
        }
        if (patient.Ispreregistration === true) {
            return next(createNotFoundError(req.t('Patients.Error.Completed'), req.t('Patients'), req.language))
        }

        const {
            Approvaldate,
            DepartmentID,
            PatientdefineID,
        } = patient

        if (!validator.isUUID(PatientdefineID)) {
            validationErrors.push(req.t('Patients.Error.PatientdefineIDRequired'))
        }
        if (!validator.isUUID(DepartmentID)) {
            validationErrors.push(req.t('Patients.Error.DepartmentIDRequired'))
        }
        if (!validator.isISODate(Approvaldate)) {
            validationErrors.push(req.t('Patients.Error.ApprovaldateRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Patients'), req.language))
        }

        await db.patientModel.update({
            ...patient,
            CaseID: CaseID,
            Patientchecktime: new Date(),
            CheckeduserID: req?.identity?.user?.Uuid || username,
            Ispreregistration: true,
            Ischecked: true,
            Isapproved: false,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.patientmovementModel.create({
            Uuid: uuid(),
            PatientID: Uuid,
            Type: patientmovementtypes.Patientcheck,
            CaseID: CaseID,
            UserID: req?.identity?.user?.Uuid || username,
            Info: Checkinfo || '',
            Occureddate: new Date(),
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await t.commit();

        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } })

        await CreateNotification({
            type: types.Update,
            service: req.t('Patients'),
            role: 'patientnotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Hastası ${username} tarafından Kontrol Edildi.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient Checked By ${username}`
            }[req.language],
            pushurl: '/Patients'
        })
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
    } = req.body

    if (!Uuid) {
        validationErrors.push(req.t('Patients.Error.PatientIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patients.Error.UnsupportedPatientID'))
    }
    if (!validator.isUUID(CaseID)) {
        validationErrors.push(req.t('Patients.Error.CaseIDRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patients'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {

        const patient = await db.patientModel.findOne({ where: { Uuid: Uuid } })
        if (!patient) {
            return next(createNotFoundError(req.t('Patients.Error.NotFound'), req.t('Patients'), req.language))
        }
        if (patient.Isactive === false) {
            return next(createNotFoundError(req.t('Patients.Error.NotActive'), req.t('Patients'), req.language))
        }
        if (patient.Ischecked === false) {
            return next(createNotFoundError(req.t('Patients.Error.Checked'), req.t('Patients'), req.language))
        }
        if (patient.Isapproved === true) {
            return next(createNotFoundError(req.t('Patients.Error.Approved'), req.t('Patients'), req.language))
        }
        if (patient.Ispreregistration === true) {
            return next(createNotFoundError(req.t('Patients.Error.Completed'), req.t('Patients'), req.language))
        }

        const {
            Approvaldate,
            DepartmentID,
            PatientdefineID,
        } = patient

        if (!validator.isUUID(PatientdefineID)) {
            validationErrors.push(req.t('Patients.Error.PatientdefineIDRequired'))
        }
        if (!validator.isUUID(DepartmentID)) {
            validationErrors.push(req.t('Patients.Error.DepartmentIDRequired'))
        }
        if (!validator.isISODate(Approvaldate)) {
            validationErrors.push(req.t('Patients.Error.ApprovaldateRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Patients'), req.language))
        }

        await db.patientModel.update({
            ...patient,
            CaseID: CaseID,
            Patientapprovetime: new Date(),
            ApproveduserID: req?.identity?.user?.Uuid || username,
            Ispreregistration: true,
            Ischecked: true,
            Isapproved: true,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.patientmovementModel.create({
            Uuid: uuid(),
            PatientID: Uuid,
            CaseID: CaseID,
            Type: patientmovementtypes.Patientapprove,
            UserID: req?.identity?.user?.Uuid || username,
            Info: Approveinfo || '',
            Occureddate: new Date(),
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await t.commit();

        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } })

        await CreateNotification({
            type: types.Update,
            service: req.t('Patients'),
            role: 'patientnotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Hastası ${username} tarafından Onaylandı.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient Approved By ${username}`
            }[req.language],
            pushurl: '/Patients'
        })

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
    } = req.body

    if (!Uuid) {
        validationErrors.push(req.t('Patients.Error.PatientIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patients.Error.UnsupportedPatientID'))
    }
    if (!validator.isUUID(CaseID)) {
        validationErrors.push(req.t('Patients.Error.CaseIDRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patients'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patient = await db.patientModel.findOne({ where: { Uuid: Uuid } })
        if (!patient) {
            return next(createNotFoundError(req.t('Patients.Error.NotFound'), req.t('Patients'), req.language))
        }
        if (patient.Isactive === false) {
            return next(createNotFoundError(req.t('Patients.Error.NotActive'), req.t('Patients'), req.language))
        }
        if (patient.Ischecked === false) {
            return next(createNotFoundError(req.t('Patients.Error.NotChecked'), req.t('Patients'), req.language))
        }
        if (patient.Isapproved === true) {
            return next(createNotFoundError(req.t('Patients.Error.Approved'), req.t('Patients'), req.language))
        }
        if (patient.Ispreregistration === true) {
            return next(createNotFoundError(req.t('Patients.Error.Completed'), req.t('Patients'), req.language))
        }

        const {
            Approvaldate,
            DepartmentID,
            PatientdefineID,
        } = patient

        if (!validator.isUUID(PatientdefineID)) {
            validationErrors.push(req.t('Patients.Error.PatientdefineIDRequired'))
        }
        if (!validator.isUUID(DepartmentID)) {
            validationErrors.push(req.t('Patients.Error.DepartmentIDRequired'))
        }
        if (!validator.isISODate(Approvaldate)) {
            validationErrors.push(req.t('Patients.Error.ApprovaldateRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Patients'), req.language))
        }

        await db.patientModel.update({
            ...patient,
            CaseID: CaseID,
            Patientchecktime: null,
            CheckeduserID: null,
            Ispreregistration: true,
            Ischecked: false,
            Isapproved: false,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.patientmovementModel.create({
            Uuid: uuid(),
            PatientID: Uuid,
            CaseID: CaseID,
            Type: patientmovementtypes.Patientcancelcheck,
            UserID: req?.identity?.user?.Uuid || username,
            Info: Cancelcheckinfo || '',
            Occureddate: new Date(),
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await t.commit();

        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } })

        await CreateNotification({
            type: types.Update,
            service: req.t('Patients'),
            role: 'patientnotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Hastası ${username} tarafından Kontrol İptali Yapıldı.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient Cancel Checked By ${username}`
            }[req.language],
            pushurl: '/Patients'
        })
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
    } = req.body

    if (!Uuid) {
        validationErrors.push(req.t('Patients.Error.PatientIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patients.Error.UnsupportedPatientID'))
    }
    if (!validator.isUUID(CaseID)) {
        validationErrors.push(req.t('Patients.Error.CaseIDRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patients'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patient = await db.patientModel.findOne({ where: { Uuid: Uuid } })
        if (!patient) {
            return next(createNotFoundError(req.t('Patients.Error.NotFound'), req.t('Patients'), req.language))
        }
        if (patient.Isactive === false) {
            return next(createNotFoundError(req.t('Patients.Error.NotActive'), req.t('Patients'), req.language))
        }
        if (patient.Ischecked === false) {
            return next(createNotFoundError(req.t('Patients.Error.NotChecked'), req.t('Patients'), req.language))
        }
        if (patient.Isapproved === false) {
            return next(createNotFoundError(req.t('Patients.Error.NotApproved'), req.t('Patients'), req.language))
        }
        if (patient.Ispreregistration === true) {
            return next(createNotFoundError(req.t('Patients.Error.Completed'), req.t('Patients'), req.language))
        }

        const {
            Approvaldate,
            DepartmentID,
            PatientdefineID,
        } = patient

        if (!validator.isUUID(PatientdefineID)) {
            validationErrors.push(req.t('Patients.Error.PatientdefineIDRequired'))
        }
        if (!validator.isUUID(DepartmentID)) {
            validationErrors.push(req.t('Patients.Error.DepartmentIDRequired'))
        }
        if (!validator.isISODate(Approvaldate)) {
            validationErrors.push(req.t('Patients.Error.ApprovaldateRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Patients'), req.language))
        }

        await db.patientModel.update({
            ...patient,
            CaseID: CaseID,
            Patientapprovetime: null,
            ApproveduserID: null,
            Ispreregistration: true,
            Ischecked: true,
            Isapproved: false,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.patientmovementModel.create({
            Uuid: uuid(),
            PatientID: Uuid,
            Type: patientmovementtypes.Patientcancelapprove,
            CaseID: CaseID,
            UserID: req?.identity?.user?.Uuid || username,
            Info: Cancelapproveinfo || '',
            Occureddate: new Date(),
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await t.commit();

        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } })

        await CreateNotification({
            type: types.Update,
            service: req.t('Patients'),
            role: 'patientnotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Hastası ${username} tarafından Onay İptali Yapıldı.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient Cancel Approved By ${username}`
            }[req.language],
            pushurl: '/Patients'
        })
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
        FloorID,
        RoomID,
        BedID
    } = req.body

    if (!Uuid) {
        validationErrors.push(req.t('Patients.Error.PatientIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patients.Error.UnsupportedPatientID'))
    }
    if (!validator.isBoolean(isTransferstocks)) {
        validationErrors.push(req.t('Patients.Error.IsTransferstocksRequired'))
    }
    if (!validator.isUUID(FloorID)) {
        validationErrors.push(req.t('Patients.Error.FloorRequired'))
    }
    if (!validator.isUUID(RoomID)) {
        validationErrors.push(req.t('Patients.Error.RoomRequired'))
    }
    if (!validator.isUUID(BedID)) {
        validationErrors.push(req.t('Patients.Error.BedRequired'))
    }
    if (!validator.isUUID(CaseID)) {
        validationErrors.push(req.t('Patients.Error.CaseIDRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patients'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        const patient = await db.patientModel.findOne({ where: { Uuid: Uuid } })
        if (!patient) {
            return next(createNotFoundError(req.t('Patients.Error.NotFound'), req.t('Patients'), req.language))
        }
        if (patient.Isactive === false) {
            return next(createNotFoundError(req.t('Patients.Error.NotActive'), req.t('Patients'), req.language))
        }
        if (patient.Ischecked === false) {
            return next(createNotFoundError(req.t('Patients.Error.NotChecked'), req.t('Patients'), req.language))
        }
        if (patient.Isapproved === false) {
            return next(createNotFoundError(req.t('Patients.Error.NotApproved'), req.t('Patients'), req.language))
        }
        if (patient.Ispreregistration === true) {
            return next(createNotFoundError(req.t('Patients.Error.Completed'), req.t('Patients'), req.language))
        }

        const {
            Approvaldate,
            DepartmentID,
            PatientdefineID,
        } = patient

        if (!validator.isUUID(PatientdefineID)) {
            validationErrors.push(req.t('Patients.Error.PatientdefineIDRequired'))
        }
        if (!validator.isUUID(DepartmentID)) {
            validationErrors.push(req.t('Patients.Error.DepartmentIDRequired'))
        }
        if (!validator.isISODate(Approvaldate)) {
            validationErrors.push(req.t('Patients.Error.ApprovaldateRequired'))
        }
        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Patients'), req.language))
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
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.patientmovementModel.create({
            Uuid: uuid(),
            PatientID: Uuid,
            Type: patientmovementtypes.Patientcomplete,
            CaseID: CaseID,
            UserID: req?.identity?.user?.Uuid || username,
            Info: Completeinfo || '',
            Occureddate: new Date(),
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await t.commit();

        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } })

        await CreateNotification({
            type: types.Update,
            service: req.t('Patients'),
            role: 'patientnotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Hastası ${username} tarafından Kurum Alındı.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient Completed By ${username}`
            }[req.language],
            pushurl: '/Patients'
        })
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
        validationErrors.push(req.t('Patients.Error.PatientdefineIDRequired'))
    }
    if (!validator.isUUID(RoomID)) {
        validationErrors.push(req.t('Patients.Error.PatientdefineIDRequired'))
    }
    if (!validator.isUUID(FloorID)) {
        validationErrors.push(req.t('Patients.Error.PatientdefineIDRequired'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patients'), req.language))
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
            return next(createNotFoundError(req.t('Patients.Error.NotFound'), req.t('Patients'), req.language))
        }
        if (!patient.Isactive) {
            return next(createNotFoundError(req.t('Patients.Error.NotActive'), req.t('Patients'), req.language))
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
        Leftinfo,
        Leavedate
    } = req.body

    if (!Uuid) {
        validationErrors.push(req.t('Patients.Error.PatientIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patients.Error.UnsupportedPatientID'))
    }
    if (!validator.isUUID(CaseID)) {
        validationErrors.push(req.t('Patients.Error.CaseIDRequired'))
    }
    if (!validator.isISODate(Leavedate)) {
        validationErrors.push(req.t('Patients.Error.LeavedateRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patients'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patient = await db.patientModel.findOne({ where: { Uuid: Uuid } })
        if (!patient) {
            return next(createNotFoundError(req.t('Patients.Error.NotFound'), req.t('Patients'), req.language))
        }
        if (patient.Isactive === false) {
            return next(createNotFoundError(req.t('Patients.Error.NotActive'), req.t('Patients'), req.language))
        }
        if (patient.Ischecked === false) {
            return next(createNotFoundError(req.t('Patients.Error.NotChecked'), req.t('Patients'), req.language))
        }
        if (patient.Isapproved === false) {
            return next(createNotFoundError(req.t('Patients.Error.NotApproved'), req.t('Patients'), req.language))
        }
        if (patient.Ispreregistration === true) {
            return next(createNotFoundError(req.t('Patients.Error.Completed'), req.t('Patients'), req.language))
        }

        const {
            Approvaldate,
            DepartmentID,
            PatientdefineID,
            Isleft,
            Isalive
        } = patient

        if (!validator.isISODate(Approvaldate)) {
            validationErrors.push(req.t('Patients.Error.ApprovaldateRequired'))
        }
        if (!validator.isUUID(PatientdefineID)) {
            validationErrors.push(req.t('Patients.Error.PatientdefineIDRequired'))
        }
        if (!validator.isUUID(DepartmentID)) {
            validationErrors.push(req.t('Patients.Error.DepartmentIDRequired'))
        }
        if (!validator.isBoolean(Isleft)) {
            validationErrors.push(req.t('Patients.Error.IsleftRequired'))
        }
        if (Isleft === true) {
            validationErrors.push(req.t('Patients.Error.LeftAlready'))
        }
        if (!validator.isBoolean(Isalive)) {
            validationErrors.push(req.t('Patients.Error.IsaliveRequired'))
        }
        if (Isalive === false) {
            validationErrors.push(req.t('Patients.Error.DeadAlready'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Patients'), req.language))
        }

        if (validator.isUUID(patient?.BedID)) {
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
        }

        await db.patientModel.update({
            ...patient,
            CaseID: CaseID,
            Isleft: true,
            Leftinfo: Leftinfo,
            BedID: null,
            RoomID: null,
            FloorID: null,
            Leavedate: Leavedate,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })


        await db.patientmovementModel.create({
            Uuid: uuid(),
            PatientID: Uuid,
            Type: patientmovementtypes.Patientleft,
            CaseID: CaseID,
            UserID: req?.identity?.user?.Uuid || username,
            Info: Leftinfo || '',
            Occureddate: Leavedate,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await t.commit();

        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } })

        await CreateNotification({
            type: types.Update,
            service: req.t('Patients'),
            role: 'patientnotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Hastası ${username} tarafından Kurumdan Çıkartıldı.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient Removed By ${username}`
            }[req.language],
            pushurl: '/Patients'
        })

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
        Deadinfo,
        Deathdate
    } = req.body

    if (!Uuid) {
        validationErrors.push(req.t('Patients.Error.PatientIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patients.Error.UnsupportedPatientID'))
    }
    if (!validator.isUUID(CaseID)) {
        validationErrors.push(req.t('Patients.Error.CaseIDRequired'))
    }
    if (!validator.isISODate(Deathdate)) {
        validationErrors.push(req.t('Patients.Error.DeathdateRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patients'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patient = await db.patientModel.findOne({ where: { Uuid: Uuid } })
        if (!patient) {
            return next(createNotFoundError(req.t('Patients.Error.NotFound'), req.t('Patients'), req.language))
        }
        if (patient.Isactive === false) {
            return next(createNotFoundError(req.t('Patients.Error.NotActive'), req.t('Patients'), req.language))
        }
        if (patient.Ischecked === false) {
            return next(createNotFoundError(req.t('Patients.Error.NotChecked'), req.t('Patients'), req.language))
        }
        if (patient.Isapproved === false) {
            return next(createNotFoundError(req.t('Patients.Error.NotApproved'), req.t('Patients'), req.language))
        }
        if (patient.Ispreregistration === true) {
            return next(createNotFoundError(req.t('Patients.Error.Completed'), req.t('Patients'), req.language))
        }

        const {
            Approvaldate,
            DepartmentID,
            PatientdefineID,
            Isleft,
            Isalive
        } = patient

        if (!validator.isISODate(Approvaldate)) {
            validationErrors.push(req.t('Patients.Error.ApprovaldateRequired'))
        }
        if (!validator.isUUID(PatientdefineID)) {
            validationErrors.push(req.t('Patients.Error.PatientdefineIDRequired'))
        }
        if (!validator.isUUID(DepartmentID)) {
            validationErrors.push(req.t('Patients.Error.DepartmentIDRequired'))
        }
        if (!validator.isBoolean(Isleft)) {
            validationErrors.push(req.t('Patients.Error.IsleftRequired'))
        }
        if (Isleft === true) {
            validationErrors.push(req.t('Patients.Error.LeftAlready'))
        }
        if (!validator.isBoolean(Isalive)) {
            validationErrors.push(req.t('Patients.Error.IsaliveRequired'))
        }
        if (Isalive === false) {
            validationErrors.push(req.t('Patients.Error.DeadAlready'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Patients'), req.language))
        }

        if (validator.isUUID(patient?.BedID)) {
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
        }

        await db.patientModel.update({
            ...patient,
            CaseID: CaseID,
            Isalive: false,
            BedID: null,
            RoomID: null,
            FloorID: null,
            Deadinfo: Deadinfo,
            Deathdate: Deathdate,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.patientmovementModel.create({
            Uuid: uuid(),
            PatientID: Uuid,
            Type: patientmovementtypes.Patientdead,
            CaseID: CaseID,
            UserID: req?.identity?.user?.Uuid || username,
            Info: Deadinfo || '',
            Occureddate: Deathdate,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await t.commit();

        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } })

        await CreateNotification({
            type: types.Update,
            service: req.t('Patients'),
            role: 'patientnotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Hastası ${username} tarafından Vefat Durumuna Getirildi.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient Entered Dead Status By ${username}`
            }[req.language],
            pushurl: '/Patients'
        })
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    req.Uuid = Uuid
    GetPatients(req, res, next)
}

async function PatientsMakeactive(req, res, next) {
    let validationErrors = []

    const {
        Uuid,
        CaseID
    } = req.body

    if (!Uuid) {
        validationErrors.push(req.t('Patients.Error.PatientIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patients.Error.UnsupportedPatientID'))
    }
    if (!validator.isUUID(CaseID)) {
        validationErrors.push(req.t('Patients.Error.CaseIDRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patients'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patient = await db.patientModel.findOne({ where: { Uuid: Uuid } })
        if (!patient) {
            return next(createNotFoundError(req.t('Patients.Error.NotFound'), req.t('Patients'), req.language))
        }
        if (patient.Isactive === false) {
            return next(createNotFoundError(req.t('Patients.Error.NotActive'), req.t('Patients'), req.language))
        }
        if (patient.Ischecked === false) {
            return next(createNotFoundError(req.t('Patients.Error.NotChecked'), req.t('Patients'), req.language))
        }
        if (patient.Isapproved === false) {
            return next(createNotFoundError(req.t('Patients.Error.NotApproved'), req.t('Patients'), req.language))
        }
        if (patient.Ispreregistration === true) {
            return next(createNotFoundError(req.t('Patients.Error.Completed'), req.t('Patients'), req.language))
        }

        const {
            Approvaldate,
            DepartmentID,
            PatientdefineID,
            Isleft,
            Isalive
        } = patient

        if (!validator.isISODate(Approvaldate)) {
            validationErrors.push(req.t('Patients.Error.ApprovaldateRequired'))
        }
        if (!validator.isUUID(PatientdefineID)) {
            validationErrors.push(req.t('Patients.Error.PatientdefineIDRequired'))
        }
        if (!validator.isUUID(DepartmentID)) {
            validationErrors.push(req.t('Patients.Error.DepartmentIDRequired'))
        }
        if (!validator.isBoolean(Isleft)) {
            validationErrors.push(req.t('Patients.Error.IsleftRequired'))
        }
        if (!validator.isBoolean(Isalive)) {
            validationErrors.push(req.t('Patients.Error.IsaliveRequired'))
        }
        if (!(Isleft === false || Isleft === false)) {
            validationErrors.push(req.t('Patients.Error.IsNotDeadOrLeftAlready'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Patients'), req.language))
        }

        await db.patientModel.update({
            ...patient,
            CaseID: CaseID,
            Isalive: true,
            BedID: null,
            RoomID: null,
            FloorID: null,
            Deadinfo: null,
            Deathdate: null,
            Leftinfo: null,
            Leavedate: null,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.patientmovementModel.create({
            Uuid: uuid(),
            PatientID: Uuid,
            Type: patientmovementtypes.Patientcasechange,
            CaseID: CaseID,
            UserID: req?.identity?.user?.Uuid || username,
            Info: '',
            Occureddate: new Date(),
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await t.commit();

        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } })

        await CreateNotification({
            type: types.Update,
            service: req.t('Patients'),
            role: 'patientnotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Hastası ${username} tarafından Tekrardan Aktif Edildi.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient Activated Again By ${username}`
            }[req.language],
            pushurl: '/Patients'
        })
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
        Occureddate,
        Occuredenddate,
        Ispastdate
    } = req.body

    if (!validator.isUUID(PatientID)) {
        validationErrors.push(req.t('Patients.Error.PatientIDRequired'))
    }
    if (!validator.isUUID(CaseID)) {
        validationErrors.push(req.t('Patients.Error.CaseIDRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patients'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {

        const patient = await db.patientModel.findOne({ where: { Uuid: PatientID } })
        if (!patient) {
            return next(createNotFoundError(req.t('Patients.Error.NotFound'), req.t('Patients'), req.language))
        }
        if (patient.Isactive === false) {
            return next(createNotFoundError(req.t('Patients.Error.NotActive'), req.t('Patients'), req.language))
        }

        if (!Ispastdate) {
            await db.patientModel.update({
                ...patient,
                CaseID: CaseID,
                Updateduser: username,
                Updatetime: new Date(),
            }, { where: { Uuid: PatientID }, transaction: t })
        }

        if (validator.isISODate(Occureddate)) {
            const patientmovements = await db.patientmovementModel.findAll({
                where: {
                    PatientID: patient?.Uuid,
                    Isactive: true,
                    Occureddate: {
                        [Sequelize.Op.gte]: Occureddate
                    }
                },
                order: [['Occureddate', 'ASC']]
            });

            if ((patientmovements || []).length > 0) {

                const isHaveenddate = validator.isISODate(Occuredenddate)
                if (!isHaveenddate) {
                    return next(createValidationError(req.t('Patients.Error.MovementEndDateRequired'), req.t('Patients'), req.language))
                }

                const nextmovement = patientmovements[0]

                const isEnddatelowerthanfirstmovement = Checkdatelowerthanother(Occuredenddate, patientmovements[0]?.Occureddate)
                if (!isEnddatelowerthanfirstmovement) {
                    return next(createValidationError(req.t('Patients.Error.MovementEndDateTooBig'), req.t('Patients'), req.language))
                }

                if (isEnddatelowerthanfirstmovement) {
                    await db.patientmovementModel.update({
                        Occureddate: Occuredenddate,
                        Updateduser: username,
                        Updatetime: new Date(),
                    }, { where: { Uuid: nextmovement?.Uuid || '' }, transaction: t })
                }
            }
        }

        await db.patientmovementModel.create({
            Uuid: uuid(),
            PatientID: PatientID,
            CaseID: CaseID,
            Type: patientmovementtypes.Patientcasechange,
            UserID: req?.identity?.user?.Uuid || username,
            Info: '',
            Occureddate: Occureddate,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } })

        await CreateNotification({
            type: types.Update,
            service: req.t('Patients'),
            role: 'patientnotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Hastası ${username} tarafından Durumu Değiştirildi.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient Case Changed By ${username}`
            }[req.language],
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
                Occureddate,
                Occuredenddate
            } = data

            if (!validator.isUUID(PatientID)) {
                validationErrors.push(req.t('Patients.Error.PatientIDRequired'))
            }
            if (!validator.isUUID(CaseID)) {
                validationErrors.push(req.t('Patients.Error.CaseIDRequired'))
            }

            if (validationErrors.length > 0) {
                return next(createValidationError(validationErrors, req.t('Patients'), req.language))
            }

            const patient = await db.patientModel.findOne({ where: { Uuid: PatientID } })
            if (!patient) {
                return next(createNotFoundError(req.t('Patients.Error.NotFound'), req.t('Patients'), req.language))
            }
            if (patient.Isactive === false) {
                return next(createNotFoundError(req.t('Patients.Error.NotActive'), req.t('Patients'), req.language))
            }

            await db.patientModel.update({
                ...patient,
                CaseID: CaseID,
                Updateduser: username,
                Updatetime: new Date(),
            }, { where: { Uuid: PatientID }, transaction: t })

            if (validator.isUUID(Occureddate)) {
                const patientmovements = await db.patientmovementModel.findAll({
                    where: {
                        PatientID: patient?.Uuid,
                        Isactive: true,
                        Occureddate: {
                            [Sequelize.Op.gte]: Occureddate
                        }
                    },
                    order: [['Occureddate', 'ASC']]
                });

                if ((patientmovements || []).length > 0) {

                    const isHaveenddate = validator.isUUID(Occuredenddate)
                    if (!isHaveenddate) {
                        return next(createValidationError(req.t('Patients.Error.MovementEndDateRequired'), req.t('Patients'), req.language))
                    }

                    const nextmovement = patientmovements[0]

                    const isEnddatelowerthanfirstmovement = Checkdatelowerthanother(Occuredenddate, patientmovements[0]?.Occureddate)
                    if (!isEnddatelowerthanfirstmovement) {
                        return next(createValidationError(req.t('Patients.Error.MovementEndDateTooBig'), req.t('Patients'), req.language))
                    }


                    if (isEnddatelowerthanfirstmovement) {
                        await db.patientmovementModel.update({
                            Occureddate: Occuredenddate,
                            Updateduser: username,
                            Updatetime: new Date(),
                        }, { where: { Uuid: nextmovement?.Uuid || '' }, transaction: t })
                    }
                }
            }

            await db.patientmovementModel.create({
                Uuid: uuid(),
                PatientID: PatientID,
                CaseID: CaseID,
                Type: patientmovementtypes.Patientcasechange,
                UserID: req?.identity?.user?.Uuid || username,
                Info: '',
                Occureddate: Occureddate,
                Createduser: username,
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
        }

        await CreateNotification({
            type: types.Update,
            service: req.t('Patients'),
            role: 'patientnotification',
            message: {
                tr: `Hastaların durumları ${username} tarafından Gerçekleştirildi.`,
                en: `Patients Cases Changed By ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Patients.Error.PatientIDRequired'))
    }
    if (!Willempty) {
        if (!validator.isUUID(FloorID)) {
            validationErrors.push(req.t('Patients.Error.FloorRequired'))
        }
        if (!validator.isUUID(RoomID)) {
            validationErrors.push(req.t('Patients.Error.RoomRequired'))
        }
        if (!validator.isUUID(BedID)) {
            validationErrors.push(req.t('Patients.Error.BedRequired'))
        }
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patients'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patient = await db.patientModel.findOne({ where: { Uuid: PatientID } })

        if (!patient) {
            return next(createNotFoundError(req.t('Patients.Error.NotFound'), req.t('Patients'), req.language))
        }
        if (patient.Isactive === false) {
            return next(createNotFoundError(req.t('Patients.Error.NotActive'), req.t('Patients'), req.language))
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
            }, { where: { Uuid: PatientID }, transaction: t })

            await db.patientmovementModel.create({
                Uuid: uuid(),
                PatientID: patient?.Uuid,
                CaseID: patient?.CaseID,
                Type: patientmovementtypes.Patientplacechange,
                UserID: req?.identity?.user?.Uuid || username,
                Info: '',
                Occureddate: new Date(),
                Createduser: username,
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })

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
                }, { where: { Uuid: targetBedPatient?.Uuid }, transaction: t })

                await db.patientmovementModel.create({
                    Uuid: uuid(),
                    PatientID: targetBedPatient?.Uuid,
                    CaseID: targetBedPatient?.CaseID,
                    Type: patientmovementtypes.Patientplacechange,
                    UserID: req?.identity?.user?.Uuid || username,
                    Info: '',
                    Occureddate: new Date(),
                    Createduser: username,
                    Createtime: new Date(),
                    Isactive: true
                }, { transaction: t })

                await db.patientModel.update({
                    ...patient,
                    FloorID: newBed.Floor,
                    BedID: newBed.Bed,
                    RoomID: newBed.Room,
                    Updateduser: username,
                    Updatetime: new Date(),
                }, { where: { Uuid: PatientID }, transaction: t })

                await db.patientmovementModel.create({
                    Uuid: uuid(),
                    PatientID: patient?.Uuid,
                    CaseID: patient?.CaseID,
                    Type: patientmovementtypes.Patientplacechange,
                    UserID: req?.identity?.user?.Uuid || username,
                    Info: '',
                    Occureddate: new Date(),
                    Createduser: username,
                    Createtime: new Date(),
                    Isactive: true
                }, { transaction: t })
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
                }, { where: { Uuid: PatientID }, transaction: t })

                await db.patientmovementModel.create({
                    Uuid: uuid(),
                    PatientID: patient?.Uuid,
                    CaseID: patient?.CaseID,
                    Type: patientmovementtypes.Patientplacechange,
                    UserID: req?.identity?.user?.Uuid || username,
                    Info: '',
                    Occureddate: new Date(),
                    Createduser: username,
                    Createtime: new Date(),
                    Isactive: true
                }, { transaction: t })

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
                }, { where: { Uuid: targetBedPatient?.Uuid }, transaction: t })

                await db.patientmovementModel.create({
                    Uuid: uuid(),
                    PatientID: targetBedPatient?.Uuid,
                    CaseID: targetBedPatient?.CaseID,
                    Type: patientmovementtypes.Patientplacechange,
                    UserID: req?.identity?.user?.Uuid || username,
                    Info: '',
                    Occureddate: new Date(),
                    Createduser: username,
                    Createtime: new Date(),
                    Isactive: true
                }, { transaction: t })

                await db.patientModel.update({
                    ...patient,
                    FloorID: newBed.Floor,
                    BedID: newBed.Bed,
                    RoomID: newBed.Room,
                    Updateduser: username,
                    Updatetime: new Date(),
                }, { where: { Uuid: PatientID }, transaction: t })

                await db.patientmovementModel.create({
                    Uuid: uuid(),
                    PatientID: patient?.Uuid,
                    CaseID: patient?.CaseID,
                    Type: patientmovementtypes.Patientplacechange,
                    UserID: req?.identity?.user?.Uuid || username,
                    Info: '',
                    Occureddate: new Date(),
                    Createduser: username,
                    Createtime: new Date(),
                    Isactive: true
                }, { transaction: t })
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
                }, { where: { Uuid: PatientID }, transaction: t })

                await db.patientmovementModel.create({
                    Uuid: uuid(),
                    PatientID: patient?.Uuid,
                    CaseID: patient?.CaseID,
                    Type: patientmovementtypes.Patientplacechange,
                    UserID: req?.identity?.user?.Uuid || username,
                    Info: '',
                    Occureddate: new Date(),
                    Createduser: username,
                    Createtime: new Date(),
                    Isactive: true
                }, { transaction: t })
            }
        }

        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } })

        await CreateNotification({
            type: types.Update,
            service: req.t('Patients'),
            role: 'patientnotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Hastasına Konumu ${username} Tarafından  Değiştirildi.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient Place Changed By ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Patients.Error.PatientIDRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patients'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patient = await db.patientModel.findOne({ where: { Uuid: PatientID } })
        if (!patient) {
            return next(createNotFoundError(req.t('Patients.Error.NotFound'), req.t('Patients'), req.language))
        }
        if (patient.Isactive === false) {
            return next(createNotFoundError(req.t('Patients.Error.NotActive'), req.t('Patients'), req.language))
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
        }, { where: { Uuid: PatientID }, transaction: t })


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
            }, { where: { Uuid: OtherPatientID }, transaction: t })

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
        validationErrors.push(req.t('Patients.Error.PatientIDRequired'))
    }
    if (!validator.isArray(Tododefines)) {
        validationErrors.push(req.t('Patients.Error.TododefinesRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patients'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patient = await db.patientModel.findOne({ where: { Uuid: PatientID } })
        if (!patient) {
            return next(createNotFoundError(req.t('Patients.Error.NotFound'), req.t('Patients'), req.language))
        }
        if (patient.Isactive === false) {
            return next(createNotFoundError(req.t('Patients.Error.NotActive'), req.t('Patients'), req.language))
        }

        await db.patienttododefineModel.destroy({ where: { PatientID: PatientID }, transaction: t });
        for (const tododefine of Tododefines) {
            if (!tododefine.Uuid || !validator.isUUID(tododefine.Uuid)) {
                return next(createNotFoundError(req.t('Patients.Error.UnsupportedTododefineID'), req.t('Patients'), req.language))
            }
            await db.patienttododefineModel.create({
                PatientID: PatientID,
                TododefineID: tododefine.Uuid
            }, { transaction: t });
        }

        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } })

        await CreateNotification({
            type: types.Update,
            service: req.t('Patients'),
            role: 'patientnotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Hastasına ait Rutinler ${username} Tarafından  Değiştirildi.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient Routines Changed By ${username}`
            }[req.language],
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
        Type,
        Supportplans,
    } = req.body

    if (!validator.isUUID(PatientID)) {
        validationErrors.push(req.t('Patients.Error.PatientIDRequired'))
    }
    if (!validator.isNumber(Type)) {
        validationErrors.push(req.t('Patients.Error.SupportplanTypeRequired'))
    }
    if (!validator.isArray(Supportplans)) {
        validationErrors.push(req.t('Patients.Error.SupportplansRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patients'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patient = await db.patientModel.findOne({ where: { Uuid: PatientID } })
        if (!patient) {
            return next(createNotFoundError(req.t('Patients.Error.NotFound'), req.t('Patients'), req.language))
        }
        if (patient.Isactive === false) {
            return next(createNotFoundError(req.t('Patients.Error.NotActive'), req.t('Patients'), req.language))
        }

        await db.patientsupportplanModel.destroy({ where: { PatientID: PatientID, Type: Type }, transaction: t });
        for (const supportplan of Supportplans) {
            if (!supportplan.Uuid || !validator.isUUID(supportplan.Uuid)) {
                return next(createNotFoundError(req.t('Patients.Error.UnsupportedSupportplanID'), req.t('Patients'), req.language))
            }
            await db.patientsupportplanModel.create({
                PatientID: PatientID,
                Type: Type,
                PlanID: supportplan.Uuid
            }, { transaction: t });
        }

        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } })

        await CreateNotification({
            type: types.Update,
            service: req.t('Patients'),
            role: 'patientnotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Hastasına ait Destek Planları ${username} Tarafından  Değiştirildi.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient Support Plans Changed By ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Patients.Error.PatientIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patients.Error.UnsupportedPatientID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patients'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patient = await db.patientModel.findOne({ where: { Uuid: Uuid } })
        if (!patient) {
            return next(createNotFoundError(req.t('Patients.Error.NotFound'), req.t('Patients'), req.language))
        }
        if (patient.Isactive === false) {
            return next(createNotFoundError(req.t('Patients.Error.NotActive'), req.t('Patients'), req.language))
        }

        await db.patientModel.destroy({ where: { Uuid: Uuid }, transaction: t });

        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Patients'),
            role: 'patientnotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Hastası ${username} Tarafından  Silindi.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient Deleted By ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Patients.Error.PatientIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patients.Error.UnsupportedPatientID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patients'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patient = await db.patientModel.findOne({ where: { Uuid: Uuid } })
        if (!patient) {
            return next(createNotFoundError(req.t('Patients.Error.NotFound'), req.t('Patients'), req.language))
        }
        if (patient.Isactive === false) {
            return next(createNotFoundError(req.t('Patients.Error.NotActive'), req.t('Patients'), req.language))
        }
        if (patient.Ispreregistration === false) {
            return next(createNotFoundError(req.t('Patients.Error.CompletedAlready'), req.t('Patients'), req.language))
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
        }, { where: { Uuid: patient?.Uuid }, transaction: t })

        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Patients'),
            role: 'patientnotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Ön Kayıtlı Hastası ${username} Tarafından Silindi.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Pre Registration Patient Deleted By ${username}`
            }[req.language],
            pushurl: '/Patients'
        })
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetPatients(req, res, next)
}

async function DeletePatientmovement(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.patientmovementId

    if (!Uuid) {
        validationErrors.push(req.t('Patients.Error.PatientmovementIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patients.Error.UnsupportedPatientmovementID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patients'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patientmovement = await db.patientmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!patientmovement) {
            return next(createNotFoundError(req.t('Patients.Error.PatientmovementNotFound'), req.t('Patients'), req.language))
        }
        if (patientmovement.Isactive === false) {
            return next(createNotFoundError(req.t('Patients.Error.PatientmovementNotActive'), req.t('Patients'), req.language))
        }

        await db.patientmovementModel.update({
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })


        const patient = await db.patientModel.findOne({ where: { Uuid: patientmovement?.PatientID } })
        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Patients'),
            role: 'patientnotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Hastasına ait Hareket ${username} Tarafından Silindi.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient Movement Deleted By ${username}`
            }[req.language],
            pushurl: '/Patients'
        })
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetPatients(req, res, next)
}

async function DeletePatienteventmovement(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.patienteventmovementId

    if (!Uuid) {
        validationErrors.push(req.t('Patients.Error.PatienteventmovementIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patients.Error.UnsupportedPatientmovementID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patienteventmovement = await db.patienteventmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!patienteventmovement) {
            return next(createNotFoundError(req.t('Patients.Error.PatientmovementNotFound'), req.t('Patients'), req.language))
        }
        if (patienteventmovement.Isactive === false) {
            return next(createNotFoundError(req.t('Patients.Error.PatientmovementNotActive'), req.t('Patients'), req.language))
        }

        await db.patienteventmovementModel.update({
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })


        const patient = await db.patientModel.findOne({ where: { Uuid: patienteventmovement?.PatientID } })
        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Patients'),
            role: 'patientnotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Hastasına ait Vaka Hareketi ${username} Tarafından Silindi.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient Event Movement Deleted By ${username}`
            }[req.language],
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
    const {
        list,
        external
    } = body

    const t = await db.sequelize.transaction();

    try {

        const currentDate = new Date()

        for (const patientdata of list) {

            const patientdefineuuid = uuid()
            const patientuuid = uuid()

            await db.patientdefineModel.create({
                Uuid: patientdefineuuid,
                Firstname: patientdata.Firstname,
                Lastname: patientdata.Lastname,
                Fathername: patientdata.Fathername,
                Mothername: patientdata.Mothername,
                Motherbiologicalaffinity: patientdata.Motherbiologicalaffinity,
                Ismotheralive: patientdata.Ismotheralive,
                Fatherbiologicalaffinity: patientdata.Fatherbiologicalaffinity,
                Isfatheralive: patientdata.Isfatheralive,
                CountryID: patientdata.CountryID,
                Dateofbirth: new Date(patientdata.Dateofbirth),
                Placeofbirth: patientdata.Placeofbirth,
                Medicalboardreport: patientdata.Medicalboardreport,
                Dependency: patientdata.Dependency,
                Gender: patientdata.Gender,
                Marialstatus: patientdata.Marialstatus,
                Criminalrecord: patientdata.Criminalrecord,
                Childnumber: patientdata.Childnumber,
                Disabledchildnumber: patientdata.Disabledchildnumber,
                Siblingstatus: patientdata.Siblingstatus,
                Sgkstatus: patientdata.Sgkstatus,
                Budgetstatus: patientdata.Budgetstatus,
                Town: patientdata.Town,
                City: patientdata.City,
                Address1: patientdata.Address1,
                Address2: patientdata.Address2,
                Country: patientdata.Country,
                Contactnumber1: patientdata.Contactnumber1,
                Contactnumber2: patientdata.Contactnumber2,
                Contactname1: patientdata.Contactname1,
                Contactname2: patientdata.Contactname2,
                CostumertypeID: patientdata.CostumertypeID,
                PatienttypeID: patientdata.PatienttypeID,
                Createduser: "System",
                Createtime: currentDate,
                Isactive: true
            }, { transaction: t })

            await db.patientModel.create({
                Uuid: patientuuid,
                PatientdefineID: patientdefineuuid,
                Patientstatus: null,
                Approvaldate: new Date(patientdata.Approvaldate),
                Releasedate: null,
                Info: patientdata.Info,
                Guardiannote: patientdata.Guardiannote,
                Happensdate: new Date(patientdata.Happensdate),
                Leavedate: null,
                Deathdate: null,
                RoomID: null,
                FloorID: null,
                BedID: null,
                DepartmentID: external.DepartmentID,
                Patientcreatetime: currentDate,
                Patientchecktime: currentDate,
                Patientapprovetime: currentDate,
                Patientcompletetime: currentDate,
                CreateduserID: "System",
                CheckeduserID: "System",
                ApproveduserID: "System",
                CompleteduserID: "System",
                Ischecked: true,
                Isapproved: true,
                Ispreregistration: false,
                Isalive: true,
                Isleft: false,
                Leftinfo: null,
                Deadinfo: null,
                CaseID: external.CaseID,
                Createduser: "System",
                Createtime: currentDate,
                Isactive: true
            }, { transaction: t })

            await db.patientmovementModel.create({
                Uuid: uuid(),
                Type: patientmovementtypes.Patientcreate,
                CaseID: external.CaseID,
                PatientID: patientuuid,
                UserID: "System",
                Info: '',
                Occureddate: new Date(patientdata.Approvaldate),
                Createduser: "System",
                Createtime: new Date(),
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

function Checkdatelowerthanother(startDate, endDate) {

    const StartDate = new Date(startDate)
    const EndDate = new Date(endDate)

    if (StartDate.getTime() >= EndDate.getTime()) {
        return false
    } else {
        return true
    }

}

async function GetPatientRollCall(req, res, next) {
    try {
        let validationErrors = []
        const {
            Month,
        } = req.body

        if (!validator.isISODate(Month)) {
            validationErrors.push(req.t('Patients.Error.MonthRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Patients'), req.language))
        }

        const startOfMonth = new Date(Month)
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const endtOfMonth = new Date(Month)
        endtOfMonth.setMonth(endtOfMonth.getMonth() + 1);
        endtOfMonth.setDate(0);
        endtOfMonth.setHours(23, 59, 59, 999);

        const dayArray = generateDateArray(Month);

        let resArr = []

        const patients = await db.patientModel.findAll({
            where: {
                Approvaldate: {
                    [Sequelize.Op.lt]: endtOfMonth,
                },
                [Sequelize.Op.or]: [
                    {
                        Isleft: false,
                        Isalive: true,
                    },
                    {
                        Isalive: true,
                        Isleft: true,
                        Leavedate: {
                            [Sequelize.Op.gt]: startOfMonth,
                        },
                    },
                    {
                        Isleft: false,
                        Isalive: false,
                        Deathdate: {
                            [Sequelize.Op.gt]: startOfMonth,
                        },
                    },
                ],
                Ischecked: true,
                Isapproved: true,
                Ispreregistration: false,
                Isactive: true,
            },
        });

        for (const patient of patients) {

            const patientdefine = await db.patientdefineModel.findOne({ where: { Isactive: true, Uuid: patient?.PatientdefineID || '' } })

            let rollcallArr = []

            for (const day of dayArray) {

                const dayStart = new Date(day)
                dayStart.setHours(0, 0, 0, 0);
                const dayEnd = new Date(day)
                dayEnd.setHours(23, 59, 59, 999);

                const now = new Date()
                now.setHours(23, 59, 59, 999);

                if (dayEnd.getTime() <= now.getTime()) {
                    const lastPatientmovement = await db.patientmovementModel.findOne({
                        where: {
                            Isactive: true,
                            PatientID: patient?.Uuid || '',
                            Occureddate: {
                                [Sequelize.Op.lte]: dayEnd,
                            }
                        },
                        order: [['Occureddate', 'DESC']],
                        limit: 1,
                    })
                    rollcallArr.push({
                        Day: day.toDateString(),
                        CaseID: lastPatientmovement?.CaseID,
                    })

                } else {
                    rollcallArr.push({
                        Day: day.toDateString(),
                        CaseID: null,
                    })
                }
            }

            resArr.push({
                Uuid: patient?.Uuid,
                Name: `${patientdefine?.Firstname} ${patientdefine?.Lastname} - ${patientdefine?.CountryID}`,
                CostumertypeID: patientdefine?.CostumertypeID,
                PatienttypeID: patientdefine?.PatienttypeID,
                Rollcall: rollcallArr
            })
        }
        res.json(resArr)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

function generateDateArray(month) {
    const start = new Date(month)
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(month)
    end.setMonth(end.getMonth() + 1);
    end.setDate(0);
    end.setHours(23, 59, 59, 999);

    const days = [];

    while (start.getTime() <= end.getTime()) {
        const day = new Date(start)
        days.push(day);
        start.setDate(start.getDate() + 1);
    }

    return days;
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
    UpdatePatientDates,
    PatientsMakeactive,
    DeletePatientmovement,
    UpdatePatientmovements,
    AddPatienteventmovement,
    UpdatePatienteventmovements,
    DeletePatienteventmovement,
    GetPatientRollCall
}