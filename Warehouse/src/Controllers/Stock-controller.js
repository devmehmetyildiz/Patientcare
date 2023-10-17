const config = require("../Config")
const messages = require("../Constants/Messages")
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
        Isonusage,
        Source,
        StockdefineID,
        DepartmentID,
        Skt,
        Barcodeno,
        Status,
        Order,
        Ismedicine
    } = req.body

    if (!validator.isUUID(WarehouseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.WAREHOUSEID_REQUIRED)
    }
    if (!validator.isBoolean(Isonusage)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISONUSAGE_REQUIRED)
    }
    if (!validator.isString(Source)) {
        validationErrors.push(messages.VALIDATION_ERROR.SOURCE_REQUIRED)
    }
    if (!validator.isUUID(StockdefineID)) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKDEFINEID_REQUIRED)
    }
    if (!validator.isUUID(DepartmentID)) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED)
    }
    if (Ismedicine && !validator.isISODate(Skt)) {
        validationErrors.push(messages.VALIDATION_ERROR.SKT_REQUIRED)
    }
    if (Ismedicine && !validator.isString(Barcodeno)) {
        validationErrors.push(messages.VALIDATION_ERROR.BARCODENO_REQUIRED)
    }
    if (!validator.isNumber(Status)) {
        validationErrors.push(messages.VALIDATION_ERROR.STATUS_REQUIRED)
    }
    if (!validator.isNumber(Order)) {
        validationErrors.push(messages.VALIDATION_ERROR.ORDER_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let stockuuid = uuid()

    const t = await db.sequelize.transaction();
    try {
        await db.stockModel.create({
            ...req.body,
            Uuid: stockuuid,
            Createduser: "System",
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
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

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
        Isonusage,
        Source,
        StockdefineID,
        DepartmentID,
        Skt,
        Barcodeno,
        Info,
        Status,
        Order,
        Uuid,
        Ismedicine
    } = req.body

    if (!validator.isUUID(WarehouseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.WAREHOUSEID_REQUIRED)
    }
    if (!validator.isBoolean(Isonusage)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISONUSAGE_REQUIRED)
    }
    if (!validator.isNumber(Source)) {
        validationErrors.push(messages.VALIDATION_ERROR.SOURCE_REQUIRED)
    }
    if (!validator.isUUID(StockdefineID)) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKDEFINEID_REQUIRED)
    }
    if (!validator.isUUID(DepartmentID)) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED)
    }
    if (Ismedicine && !validator.isISODate(Skt)) {
        validationErrors.push(messages.VALIDATION_ERROR.SKT_REQUIRED)
    }
    if (Ismedicine && !validator.isString(Barcodeno)) {
        validationErrors.push(messages.VALIDATION_ERROR.BARCODENO_REQUIRED)
    }
    if (!validator.isString(Info)) {
        validationErrors.push(messages.VALIDATION_ERROR.INFO_REQUIRED)
    }
    if (!validator.isNumber(Status)) {
        validationErrors.push(messages.VALIDATION_ERROR.STATUS_REQUIRED)
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
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

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

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    const t = await db.sequelize.transaction();
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
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

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
    try {
        const stock = await db.stockModel.findOne({ where: { Uuid: req.params.stockId } });
        if (!stock) {
            return createNotfounderror([messages.ERROR.STOCK_NOT_FOUND])
        }
        if (!stock.Isactive) {
            return createNotfounderror([messages.ERROR.STOCK_NOT_ACTIVE])
        }

        await db.stockModel.update({
            Deleteduser: "System",
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await db.stockmovementModel.update({
            Deleteduser: "System",
            Deletetime: new Date(),
            Isactive: false
        }, { where: { StockID: Uuid } }, { transaction: t })

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
        if (stock.Ismedicine) {
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
            Createduser: "System",
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
                Skt: stock.Skt,
                Barcodeno: stock.Barcodeno,
                Isapproved: true,
                Createduser: "System",
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
                Newvalue: Amount,
                Createduser: "System",
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
                Prevvalue: amount,
                Isapproved: true,
                Newvalue: amount + Amount,
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
        if (patientstock.Ismedicine) {
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
            Amount: Amount,
            Movementdate: new Date(),
            Movementtype: -1,
            Prevvalue: amount,
            Isapproved: true,
            Newvalue: parseFloat(amount) - parseFloat(Amount),
            Createduser: "System",
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
                Skt: patientstock.Skt,
                Barcodeno: patientstock.Barcodeno,
                Isapproved: true,
                Createduser: "System",
                Createtime: new Date(),
                Isactive: true,
                Isapproved: true
            }, { transaction: t })

            await db.stockmovementModel.create({
                Uuid: uuid(),
                StockID: newstockuuid,
                Amount: parseFloat(Amount),
                Movementdate: new Date(),
                Movementtype: 1,
                Prevvalue: 0,
                Isapproved: true,
                Newvalue: Amount,
                Createduser: "System",
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
                Amount: Amount,
                Movementdate: new Date(),
                Movementtype: 1,
                Prevvalue: amount,
                Isapproved: true,
                Newvalue: parseFloat(oldamount) + parseFloat(Amount),
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
    res.status(200).json({ success: true })
}

module.exports = {
    GetStocks,
    GetStock,
    AddStock,
    UpdateStock,
    DeleteStock,
    ApproveStock,
    TransferfromPatient,
    TransfertoPatient
}