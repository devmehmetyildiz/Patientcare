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

async function GetStocks(req, res, next) {
    try {
        const stocks = await db.stockModel.findAll()
        res.status(200).json(stocks)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetStock(req, res, next) {

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
        const stock = await db.stockModel.findOne({ where: { Uuid: req.params.stockId } });
        if (!stock) {
            return next(createNotfounderror([messages.ERROR.STOCK_NOT_FOUND], req.language))
        }
        if (!stock.Isactive) {
            return next(createNotfounderror([messages.ERROR.STOCK_NOT_ACTIVE], req.language))
        }
        res.status(200).json(stock)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function AddStock(req, res, next) {

    let validationErrors = []
    const {
        WarehouseID,
        StockdefineID,
        DepartmentID,
        Skt,
        Barcodeno,
        Order,
        Ismedicine,
        Issupply
    } = req.body

    if (!validator.isUUID(WarehouseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.WAREHOUSEID_REQUIRED)
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

    let stockuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.stockModel.create({
            ...req.body,
            Uuid: stockuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await db.stockmovementModel.create({
            Uuid: uuid(),
            StockID: stockuuid,
            Amount: req.body.Amount,
            Movementdate: new Date(),
            Movementtype: 1,
            Prevvalue: 0,
            Isapproved: true,
            Newvalue: req.body.Amount,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: StockdefineID } });
        const unit = await DoGet(config.services.Setting, `Units/${stockdefine?.UnitID}`)

        await CreateNotification({
            type: types.Create,
            service: Issupply ? 'Sarf Malzemeleri' : Ismedicine ? 'İlaçlar' : 'Stoklar',
            role: 'stocknotification',
            message: `${req.body.Amount} ${unit?.Name} ${stockdefine?.Name} ürünü ${username} tarafından eklendi.`,
            pushurl: Issupply ? '/Supplies' : Ismedicine ? '/Medicines' : '/Stocks'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetStocks(req, res, next)
}

async function UpdateStock(req, res, next) {

    let validationErrors = []
    const {
        WarehouseID,
        StockdefineID,
        DepartmentID,
        Skt,
        Barcodeno,
        Order,
        Uuid,
        Ismedicine,
        Issupply
    } = req.body

    if (!validator.isUUID(WarehouseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.WAREHOUSEID_REQUIRED)
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
        const stock = await db.stockModel.findOne({ where: { Uuid: Uuid } })
        if (!stock) {
            return next(createNotfounderror([messages.ERROR.STOCK_NOT_FOUND], req.language))
        }
        if (stock.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STOCK_NOT_ACTIVE], req.language))
        }

        await db.stockModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: StockdefineID } });

        await CreateNotification({
            type: types.Update,
            service: Issupply ? 'Sarf Malzemeleri' : Ismedicine ? 'İlaçlar' : 'Stoklar',
            role: 'stocknotification',
            message: `${stockdefine?.Name} ${username} tarafından güncellendi.`,
            pushurl: Issupply ? '/Supplies' : Ismedicine ? '/Medicines' : '/Stocks'
        })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetStocks(req, res, next)
}

async function ApproveStock(req, res, next) {

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
        const stock = await db.stockModel.findOne({ where: { Uuid: Uuid } })
        if (!stock) {
            return next(createNotfounderror([messages.ERROR.STOCK_NOT_FOUND], req.language))
        }
        if (stock.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STOCK_NOT_ACTIVE], req.language))
        }

        await db.stockModel.update({
            ...stock,
            Isapproved: true,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: stock?.StockdefineID } });

        await CreateNotification({
            type: types.Update,
            service: stock?.Issupply ? 'Sarf Malzemeleri' : stock?.Ismedicine ? 'İlaçlar' : 'Stoklar',
            role: 'stocknotification',
            message: `${stockdefine?.Name} ürünü  ${username} tarafından Onaylandı.`,
            pushurl: stock?.Issupply ? '/Supplies' : stock?.Ismedicine ? '/Medicines' : '/Stocks'
        })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetStocks(req, res, next)
}

async function ApproveStocks(req, res, next) {

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

            const stock = await db.stockModel.findOne({ where: { Uuid: data } })
            if (!stock) {
                return next(createNotfounderror([messages.ERROR.STOCK_NOT_FOUND], req.language))
            }
            if (stock.Isactive === false) {
                return next(createAccessDenied([messages.ERROR.STOCK_NOT_ACTIVE], req.language))
            }

            await db.stockModel.update({
                ...stock,
                Isapproved: true,
                Updateduser: username,
                Updatetime: new Date(),
            }, { where: { Uuid: data } }, { transaction: t })
        }

        await CreateNotification({
            type: types.Update,
            service: 'Stoklar',
            role: 'stocknotification',
            message: `${username} toplu stok güncelleme yapıldı.`,
        })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetStocks(req, res, next)
}

async function DeleteStock(req, res, next) {

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
        const stock = await db.stockModel.findOne({ where: { Uuid: req.params.stockId } });
        if (!stock) {
            return createNotfounderror([messages.ERROR.STOCK_NOT_FOUND])
        }
        if (!stock.Isactive) {
            return createNotfounderror([messages.ERROR.STOCK_NOT_ACTIVE])
        }

        await db.stockModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await db.stockmovementModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { StockID: Uuid } }, { transaction: t })

        await db.patientstockmovementModel.destroy({ where: { StockID: Uuid } })
        await db.patientstockModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        
        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: stock?.Uuid } })

        await CreateNotification({
            type: types.Delete,
            service: stock?.Issupply ? 'Sarf Malzemeleri' : stock?.Ismedicine ? 'İlaçlar' : 'Stoklar',
            role: 'stocknotification',
            message: `${stockdefine?.Name}  ${username} tarafından silindi.`,
            pushurl: stock?.Issupply ? '/Supplies' : stock?.Ismedicine ? '/Medicines' : '/Stocks'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetStocks(req, res, next)
}

async function TransfertoPatient(req, res, next) {

    let validationErrors = []
    const {
        WarehouseID,
        StockID,
        PatientID,
        Amount,
    } = req.body

    if (!validator.isUUID(WarehouseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.WAREHOUSEID_REQUIRED)
    }
    if (!validator.isUUID(StockID)) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKID_REQUIRED)
    }
    if (!validator.isUUID(PatientID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isNumber(Amount)) {
        validationErrors.push(messages.VALIDATION_ERROR.AMOUNT_REQUIRED)
    }


    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const stock = await db.stockModel.findOne({ where: { Uuid: StockID } });
        if (!stock) {
            return createNotfounderror([messages.ERROR.STOCK_NOT_FOUND])
        }
        if (!stock.Isactive) {
            return createNotfounderror([messages.ERROR.STOCK_NOT_ACTIVE])
        }


        let amount = 0.0;
        const movements = await db.stockmovementModel.findAll({ where: { StockID: StockID, Isactive: true, Isapproved: true } })
        movements.forEach(movement => {
            amount += (movement.Amount * movement.Movementtype);
        });

        if (parseFloat(amount) < parseFloat(Amount)) {
            return createNotfounderror([messages.ERROR.AMOUNT_NOT_FOUND])
        }

        let isnewstock = false
        const whereClause = {
            PatientID: PatientID,
            StockdefineID: stock.StockdefineID,
            DepartmentID: stock.DepartmentID
        }
        if (stock.Ismedicine || stock.Issupply) {
            whereClause.Skt = stock.Skt
            whereClause.Barcodeno = stock.Barcodeno
        }

        const patientstock = await db.patientstockModel.findOne({ where: whereClause });
        if (!patientstock) {
            isnewstock = true
        }
        if (!patientstock?.Isactive) {
            isnewstock = true
        }

        await db.stockmovementModel.create({
            Uuid: uuid(),
            StockID: StockID,
            Amount: Amount,
            Movementdate: new Date(),
            Movementtype: -1,
            Prevvalue: amount,
            Isapproved: true,
            Newvalue: parseFloat(amount) - parseFloat(Amount),
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        if (isnewstock) {

            const newpatientstockuuid = uuid()

            await db.patientstockModel.create({
                Uuid: newpatientstockuuid,
                PatientID: PatientID,
                StockdefineID: stock.StockdefineID,
                DepartmentID: stock.DepartmentID,
                Ismedicine: stock.Ismedicine,
                Issupply: stock.Issupply,
                Isredprescription: stock.Isredprescription,
                Skt: stock.Skt,
                Barcodeno: stock.Barcodeno,
                Isapproved: true,
                Createduser: username,
                Createtime: new Date(),
                Isactive: true,
                Isapproved: false
            }, { transaction: t })

            await db.patientstockmovementModel.create({
                Uuid: uuid(),
                StockID: newpatientstockuuid,
                Amount: parseFloat(Amount),
                Movementdate: new Date(),
                Movementtype: 1,
                Prevvalue: 0,
                Isapproved: true,
                Newvalue: parseFloat(Amount),
                Createduser: username,
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
        } else {

            let oldamount = 0.0;
            const oldmovements = await db.patientstockmovementModel.findAll({ where: { StockID: patientstock.Uuid, Isactive: true, Isapproved: true } })
            oldmovements.forEach(movement => {
                oldamount += (movement.Amount * movement.Movementtype);
            });

            await db.patientstockmovementModel.create({
                Uuid: uuid(),
                StockID: patientstock.Uuid,
                Amount: Amount,
                Movementdate: new Date(),
                Movementtype: 1,
                Prevvalue: parseFloat(amount),
                Isapproved: false,
                Newvalue: parseFloat(amount) + parseFloat(Amount),
                Createduser: username,
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })

        }

        const warehouse = await db.warehouseModel.findOne({ where: { Uuid: WarehouseID } });
        const patient = await DoGet(config.services.Business, `Patients/${PatientID}`)
        const patientdefine = await DoGet(config.services.Business, `Patientdefines/${patient?.PatientdefineID}`)

        await CreateNotification({
            type: types.Update,
            service: 'Hastalar',
            role: 'stocknotification',
            message: `${patientdefine?.Firstname} ${patientdefine?.Lastname} hastasına ${warehouse?.Name} ambarından ${username} tarafından transfer edildi.`,
            pushurl: `/Patients/${patient?.Uuid}`
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    res.status(200).json({ success: true })
}

async function TransferfromPatient(req, res, next) {

    let validationErrors = []
    const {
        WarehouseID,
        StockID,
        PatientID,
        Amount,
    } = req.body

    if (!validator.isUUID(WarehouseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.WAREHOUSEID_REQUIRED)
    }
    if (!validator.isUUID(StockID)) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKID_REQUIRED)
    }
    if (!validator.isUUID(PatientID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isNumber(Amount)) {
        validationErrors.push(messages.VALIDATION_ERROR.AMOUNT_REQUIRED)
    }


    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patientstock = await db.patientstockModel.findOne({ where: { Uuid: StockID } });
        if (!patientstock) {
            return createNotfounderror([messages.ERROR.STOCK_NOT_FOUND])
        }
        if (!patientstock.Isactive) {
            return createNotfounderror([messages.ERROR.STOCK_NOT_ACTIVE])
        }


        let amount = 0.0;
        const movements = await db.patientstockmovementModel.findAll({ where: { StockID: StockID, Isactive: true, Isapproved: true } })
        movements.forEach(movement => {
            amount += (movement.Amount * movement.Movementtype);
        });

        if (parseFloat(amount) < parseFloat(Amount)) {
            return createNotfounderror([messages.ERROR.AMOUNT_NOT_FOUND])
        }

        let isnewstock = false
        const whereClause = {
            WarehouseID: WarehouseID,
            StockdefineID: patientstock.StockdefineID,
            DepartmentID: patientstock.DepartmentID
        }
        if (patientstock.Ismedicine || patientstock.Issupply) {
            whereClause.Skt = patientstock.Skt
            whereClause.Barcodeno = patientstock.Barcodeno
        }

        const stock = await db.stockModel.findOne({ where: whereClause });
        if (!stock) {
            isnewstock = true
        }
        if (!stock?.Isactive) {
            isnewstock = true
        }

        await db.patientstockmovementModel.create({
            Uuid: uuid(),
            StockID: StockID,
            Amount: parseFloat(Amount),
            Movementdate: new Date(),
            Movementtype: -1,
            Prevvalue: parseFloat(amount),
            Isapproved: true,
            Newvalue: parseFloat(amount) - parseFloat(Amount),
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        if (isnewstock) {

            const newstockuuid = uuid()

            await db.stockModel.create({
                Uuid: newstockuuid,
                WarehouseID: WarehouseID,
                StockdefineID: patientstock.StockdefineID,
                DepartmentID: patientstock.DepartmentID,
                Ismedicine: patientstock.Ismedicine,
                Issupply: patientstock.Issupply,
                Isredprescription: patientstock.Isredprescription,
                Skt: patientstock.Skt,
                Barcodeno: patientstock.Barcodeno,
                Isapproved: true,
                Createduser: username,
                Createtime: new Date(),
                Isactive: true,
                Isapproved: false
            }, { transaction: t })

            await db.stockmovementModel.create({
                Uuid: uuid(),
                StockID: newstockuuid,
                Amount: parseFloat(Amount),
                Movementdate: new Date(),
                Movementtype: 1,
                Prevvalue: 0,
                Isapproved: true,
                Newvalue: parseFloat(Amount),
                Createduser: username,
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
        } else {

            let oldamount = 0.0;
            const oldmovements = await db.stockmovementModel.findAll({ where: { StockID: stock.Uuid, Isactive: true, Isapproved: true } })
            oldmovements.forEach(movement => {
                oldamount += (movement.Amount * movement.Movementtype);
            });

            await db.stockmovementModel.create({
                Uuid: uuid(),
                StockID: stock.Uuid,
                Amount: parseFloat(Amount),
                Movementdate: new Date(),
                Movementtype: 1,
                Prevvalue: parseFloat(amount),
                Isapproved: true,
                Newvalue: parseFloat(oldamount) + parseFloat(Amount),
                Createduser: username,
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })

        }

        const warehouse = await db.warehouseModel.findOne({ where: { Uuid: WarehouseID } });
        const patient = await DoGet(config.services.Business, `Patients/${PatientID}`)
        const patientdefine = await DoGet(config.services.Business, `Patientdefines/${patient?.PatientdefineID}`)

        await CreateNotification({
            type: types.Update,
            service: 'Hastalar',
            role: 'stocknotification',
            message: `${patientdefine?.Firstname} ${patientdefine?.Lastname} hastasınına ait ürünler ${warehouse?.Name} ambarına ${username} tarafından transfer edildi.`,
            pushurl: `/Patients/${patient?.Uuid}`
        })
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    res.status(200).json({ success: true })
}

module.exports = {
    GetStocks,
    GetStock,
    AddStock,
    UpdateStock,
    DeleteStock,
    ApproveStock,
    ApproveStocks,
    TransferfromPatient,
    TransfertoPatient
}