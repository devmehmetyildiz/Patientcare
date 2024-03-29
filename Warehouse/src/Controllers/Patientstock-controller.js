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


async function Transferpatientstock(req, res, next) {
    let validationErrors = []
    const {
        Uuid,
        WarehouseID,
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isUUID(WarehouseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.WAREHOUSEID_REQUIRED)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const patient = req.body
    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patientstocks = await db.patientstockModel.findAll({ where: { PatientID: patient.Uuid } });
        for (const patientstock of patientstocks) {

            let amount = 0;
            let movements = await db.patientstockmovementModel.findAll({ where: { StockID: patientstock.Uuid } })
            for (const movement of movements) {
                amount += (movement.Amount * movement.Movementtype);
                await db.patientstockmovementModel.destroy({ where: { Uuid: movement.Uuid } }, { transaction: t })
            }

            let foundedstock = await db.stockModel.findOne({
                where: {
                    Skt: patientstock.Skt,
                    Barcodeno: patientstock.Barcodeno,
                    StockdefineID: patientstock.StockdefineID,
                    DepartmentID: patientstock.DepartmentID,
                    WarehouseID: WarehouseID,
                    Issupply: patientstock.Issupply,
                    Ismedicine: patientstock.Ismedicine
                }
            })

            if (!foundedstock) {
                let newstockUuid = uuid()
                await db.stockModel.create({
                    ...patientstock,
                    Uuid: newstockUuid,
                    CreatedUser: username,
                    CreateTime: new Date(),
                    Isapproved: false,
                    IsActive: true,
                }, { transaction: t })
                await db.stockmovementModel.create({
                    Uuid: uuid(),
                    StockID: newstockUuid,
                    Amount: amount,
                    Movementdate: new Date(),
                    Movementtype: 1,
                    Prevvalue: 0,
                    Newvalue: amount,
                    Isapproved: true,
                    CreatedUser: username,
                    CreateTime: new Date(),
                    IsActive: true
                }, { transaction: t })
            } else {
                let previousamount = 0;
                let oldmovements = await db.stockmovementModel.findAll({ where: { StockID: foundedstock.Uuid } })
                for (const oldmovement of oldmovements) {
                    previousamount += (oldmovement.Amount * oldmovement.Movementtype);
                }
                await db.stockmovementModel.create({
                    Uuid: uuid(),
                    StockID: foundedstock.Uuid,
                    Amount: amount,
                    Movementdate: new Date(),
                    Movementtype: 1,
                    Prevvalue: previousamount,
                    Newvalue: previousamount + amount,
                    Isapproved: true,
                    CreatedUser: username,
                    CreateTime: new Date(),
                    IsActive: true
                }, { transaction: t })
            }

            await db.patientstockModel.destroy({ where: { Uuid: patientstock.Uuid } }, { transaction: t })
        }

        const warehouse = await db.warehouseModel.findOne({ where: { Uuid: WarehouseID } });
        const patientdefine = await DoGet(config.services.Business, `Patientdefines/${patient?.PatientdefineID}`)

        await CreateNotification({
            type: types.Transfer,
            service: 'Hastalar',
            role: 'patientstocknotification',
            message: `${warehouse?.Name} ambarına ${patientdefine?.Firstname} ${patientdefine?.Lastname} hastasının stokları ${username} tarafından transfer edildi.`,
            pushurl: '/Warehouses'
        })

        t.commit()
    } catch (error) {
        t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    res.status(200).json({ succes: true })
}

async function GetPatientstocks(req, res, next) {
    try {
        const patientstocks = await db.patientstockModel.findAll({ where: { Isactive: true } })
        res.status(200).json(patientstocks)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPatientstock(req, res, next) {

    let validationErrors = []
    if (!req.params.stockId) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKID_REQUIRED)
    }
    if (!validator.isUUID(req.params.stockId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const patientstock = await db.patientstockModel.findOne({ where: { Uuid: req.params.stockId } });
        if (!patientstock) {
            return next(createNotfounderror([messages.ERROR.STOCK_NOT_FOUND], req.language))
        }
        if (!patientstock.Isactive) {
            return next(createNotfounderror([messages.ERROR.STOCK_NOT_ACTIVE], req.language))
        }
        res.status(200).json(patientstock)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddPatientstock(req, res, next) {

    let validationErrors = []
    const {
        PatientID,
        StockdefineID,
        DepartmentID,
        Skt,
        Barcodeno,
        Ismedicine,
        Issupply
    } = req.body

    if (!validator.isUUID(PatientID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isUUID(StockdefineID)) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKDEFINEID_REQUIRED)
    }
    if (!validator.isUUID(DepartmentID)) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED)
    }
    if ((Ismedicine || Issupply) && !validator.isISODate(Skt)) {
        validationErrors.push(messages.VALIDATION_ERROR.SKT_REQUIRED)
    }
    if ((Ismedicine || Issupply) && !validator.isString(Barcodeno)) {
        validationErrors.push(messages.VALIDATION_ERROR.BARCODENO_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let stockuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.patientstockModel.create({
            ...req.body,
            Uuid: stockuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true,
            Isapproved: false
        }, { transaction: t })

        await db.patientstockmovementModel.create({
            Uuid: uuid(),
            StockID: stockuuid,
            Amount: req.body.Amount,
            Movementdate: new Date(),
            Movementtype: 1,
            Prevvalue: 0,
            Newvalue: req.body.Amount,
            Createduser: username,
            Createtime: new Date(),
            Isapproved: true,
            Isactive: true
        }, { transaction: t })

        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: StockdefineID } });
        const unit = await DoGet(config.services.Setting, `Units/${stockdefine?.UnitID}`)
        const patient = await DoGet(config.services.Business, `Patients/${PatientID}`)
        const patientdefine = await DoGet(config.services.Business, `Patientdefines/${patient?.PatientdefineID}`)

        await CreateNotification({
            type: types.Create,
            service: Issupply ? 'Hasta Sarf Malzemeleri' : Ismedicine ? 'Hasta İlaçları' : 'Hasta Stokları',
            role: 'patientstocknotification',
            message: `${patientdefine?.Firstname} ${patientdefine?.Lastname} hastasına ${req.body.Amount} ${unit?.Name} ${stockdefine?.Name} ${username} tarafından eklendi.`,
            pushurl: Issupply ? '/Patientsupplies' : Ismedicine ? '/Patientmedicines' : '/Patientstocks'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetPatientstocks(req, res, next)
}

async function UpdatePatientstock(req, res, next) {

    let validationErrors = []
    const {
        PatientID,
        StockdefineID,
        DepartmentID,
        Skt,
        Barcodeno,
        Uuid,
        Ismedicine,
        Issupply
    } = req.body

    if (!validator.isUUID(PatientID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isUUID(StockdefineID)) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKDEFINEID_REQUIRED)
    }
    if (!validator.isUUID(DepartmentID)) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED)
    }
    if ((Ismedicine || Issupply) && !validator.isISODate(Skt)) {
        validationErrors.push(messages.VALIDATION_ERROR.SKT_REQUIRED)
    }
    if ((Ismedicine || Issupply) && !validator.isString(Barcodeno)) {
        validationErrors.push(messages.VALIDATION_ERROR.BARCODENO_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKID)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKID_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const stock = await db.patientstockModel.findOne({ where: { Uuid: Uuid } })
        if (!stock) {
            return next(createNotfounderror([messages.ERROR.STOCK_NOT_FOUND], req.language))
        }
        if (stock.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STOCK_NOT_ACTIVE], req.language))
        }

        await db.patientstockModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: StockdefineID } });
        const patient = await DoGet(config.services.Business, `Patients/${PatientID}`)
        const patientdefine = await DoGet(config.services.Business, `Patientdefines/${patient?.PatientdefineID}`)

        await CreateNotification({
            type: types.Update,
            service: Issupply ? 'Hasta Sarf Malzemeleri' : Ismedicine ? 'Hasta İlaçları' : 'Hasta Stokları',
            role: 'patientstocknotification',
            message: `${patientdefine?.Firstname} ${patientdefine?.Lastname} hastasına ait ${stockdefine?.Name} ${username} tarafından güncellendi.`,
            pushurl: Issupply ? '/Patientsupplies' : Ismedicine ? '/Patientmedicines' : '/Patientstocks'
        })
        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPatientstocks(req, res, next)
}

async function UpdatePatientstocklist(req, res, next) {

    let validationErrors = []

    const stocklist = req.body
    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        for (const stockitem of stocklist) {
            const {
                PatientID,
                StockdefineID,
                DepartmentID,
                Skt,
                Barcodeno,
                Order,
                Uuid,
                Ismedicine,
                Issupply
            } = stockitem

            if (!validator.isUUID(PatientID)) {
                validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
            }
            if (!validator.isUUID(StockdefineID)) {
                validationErrors.push(messages.VALIDATION_ERROR.STOCKDEFINEID_REQUIRED)
            }
            if (!validator.isUUID(DepartmentID)) {
                validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED)
            }
            if ((Ismedicine || Issupply) && !validator.isISODate(Skt)) {
                validationErrors.push(messages.VALIDATION_ERROR.SKT_REQUIRED)
            }
            if ((Ismedicine || Issupply) && !validator.isString(Barcodeno)) {
                validationErrors.push(messages.VALIDATION_ERROR.BARCODENO_REQUIRED)
            }
            if (!validator.isNumber(Order)) {
                validationErrors.push(messages.VALIDATION_ERROR.ORDER_REQUIRED)
            }

            if (validationErrors.length > 0) {
                return next(createValidationError(validationErrors, req.language))
            }

            if (Uuid && validator.isUUID(Uuid)) {
                const stock = await db.patientstockModel.findOne({ where: { Uuid: Uuid } })
                if (!stock) {
                    return next(createNotfounderror([messages.ERROR.STOCK_NOT_FOUND], req.language))
                }
                if (stock.Isactive === false) {
                    return next(createAccessDenied([messages.ERROR.STOCK_NOT_ACTIVE], req.language))
                }
                if (stockitem.Willdetele) {
                    await db.patientstockModel.destroy({ where: { Uuid: Uuid }, transaction: t });
                    await db.patientstockmovementModel.destroy({ where: { StockID: Uuid } })
                } else {
                    await db.patientstockModel.update({
                        ...stockitem,
                        Updateduser: username,
                        Updatetime: new Date(),
                    }, { where: { Uuid: Uuid } }, { transaction: t })
                }
            } else {
                let stockuuid = uuid()
                await db.patientstockModel.create({
                    ...stockitem,
                    Uuid: stockuuid,
                    Createduser: username,
                    Createtime: new Date(),
                    Isapproved: false,
                    Isactive: true
                }, { transaction: t })

                await db.patientstockmovementModel.create({
                    Uuid: uuid(),
                    StockID: stockuuid,
                    Amount: stockitem.Amount,
                    Movementdate: new Date(),
                    Movementtype: 1,
                    Prevvalue: 0,
                    Isapproved: true,
                    Newvalue: stockitem.Amount,
                    Createduser: username,
                    Createtime: new Date(),
                    Isactive: true
                }, { transaction: t })
            }
        }

        await CreateNotification({
            type: types.Update,
            service: 'Hastalar',
            role: 'patientstocknotification',
            message: `Hasta stok listesi ${username} tarafından güncellendi.`,
        })
        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    res.status(200).json({ success: true })
}

async function ApprovePatientstock(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.stockId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patientstock = await db.patientstockModel.findOne({ where: { Uuid: Uuid } })
        if (!patientstock) {
            return next(createNotfounderror([messages.ERROR.STOCK_NOT_FOUND], req.language))
        }
        if (patientstock.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STOCK_NOT_ACTIVE], req.language))
        }

        await db.patientstockModel.update({
            ...patientstock,
            Isapproved: true,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        const stock = await db.patientstockModel.findOne({ where: { Uuid: req.params.stockId } });
        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: stock?.StockdefineID } });
        const patient = await DoGet(config.services.Business, `Patients/${PatientID}`)
        const patientdefine = await DoGet(config.services.Business, `Patientdefines/${patient?.PatientdefineID}`)

        await CreateNotification({
            type: types.Update,
            service: stock?.Issupply ? 'Hasta Sarf Malzemeleri' : stock?.Ismedicine ? 'Hasta İlaçları' : 'Hasta Stokları',
            role: 'patientstocknotification',
            message: `${patientdefine?.Firstname} ${patientdefine?.Lastname} hastasına ait ${stockdefine?.Name} ${username} tarafından onaylandı.`,
            pushurl: stock?.Issupply ? '/Patientsupplies' : stock?.Ismedicine ? '/Patientmedicines' : '/Patientstocks'

        })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetPatientstocks(req, res, next)
}

async function ApprovePatientstocks(req, res, next) {

    let validationErrors = []
    const body = req.body

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        for (const data of (body || [])) {
            if (!data) {
                validationErrors.push(messages.VALIDATION_ERROR.STOCKID_REQUIRED)
            }
            if (!validator.isUUID(data)) {
                validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKID)
            }
            if (validationErrors.length > 0) {
                return next(createValidationError(validationErrors, req.language))
            }

            const patientstock = await db.patientstockModel.findOne({ where: { Uuid: data } })
            if (!patientstock) {
                return next(createNotfounderror([messages.ERROR.STOCK_NOT_FOUND], req.language))
            }
            if (patientstock.Isactive === false) {
                return next(createAccessDenied([messages.ERROR.STOCK_NOT_ACTIVE], req.language))
            }

            await db.patientstockModel.update({
                ...patientstock,
                Isapproved: true,
                Updateduser: username,
                Updatetime: new Date(),
            }, { where: { Uuid: data } }, { transaction: t })
        }

        await CreateNotification({
            type: types.Update,
            service: 'Hasta Stokları',
            role: 'patientstocknotification',
            message: `${username} tarafından toplu stok onaylaması yapıldı.`,
        })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetPatientstocks(req, res, next)
}


async function DeletePatientstock(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.stockId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patientstock = await db.patientstockModel.findOne({ where: { Uuid: req.params.stockId } });
        if (!patientstock) {
            return createNotfounderror([messages.ERROR.STOCK_NOT_FOUND])
        }
        if (!patientstock.Isactive) {
            return createNotfounderror([messages.ERROR.STOCK_NOT_ACTIVE])
        }

        await db.patientstockmovementModel.destroy({ where: { StockID: Uuid } })
        await db.patientstockModel.destroy({ where: { Uuid: Uuid }, transaction: t });

        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: stock?.StockdefineID } });

        await CreateNotification({
            type: types.Delete,
            service: patientstock?.Issupply ? 'Hasta Sarf Malzemeleri' : patientstock?.Ismedicine ? 'Hasta İlaçları' : 'Hasta Stokları',
            role: 'patientstocknotification',
            message: `${stockdefine?.Name}  ${username} tarafından silindi.`,
            pushurl: patientstock?.Issupply ? '/Patientsupplies' : patientstock?.Ismedicine ? '/Patientmedicines' : '/Patientstocks'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetPatientstocks(req, res, next)
}

module.exports = {
    GetPatientstocks,
    GetPatientstock,
    AddPatientstock,
    UpdatePatientstock,
    DeletePatientstock,
    Transferpatientstock,
    UpdatePatientstocklist,
    ApprovePatientstock,
    ApprovePatientstocks
}