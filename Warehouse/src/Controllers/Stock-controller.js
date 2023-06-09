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
        const stocks = await db.stockModel.findAll({ where: { Isactive: true } })
        if (stocks && stocks.length > 0) {
            let departments = []
            let units = []
            try {
                const departmentsresponse = await axios({
                    method: 'GET',
                    url: config.services.Setting + `Departments`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                const unitsresponse = await axios({
                    method: 'GET',
                    url: config.services.Setting + `Units`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                departments = departmentsresponse.data
                units = unitsresponse.data
            } catch (error) {
                return next(requestErrorCatcher(error, 'Setting'))
            }
            for (const stock of stocks) {
                let amount = 0.0;
                let movements = await db.stockmovementModel.findAll({ where: { StockID: stock.Uuid } })
                movements.forEach(movement => {
                    amount += (movement.Amount * movement.Movementtype);
                });
                stock.Amount = amount
                stock.Stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: stock.StockdefineID } })
                if (stock.Stockdefine) {
                    stock.Stockdefine.Unit = units.find(u => u.Uuid === stock.Stockdefine.UnitID)
                    stock.Stockdefine.Department = departments.find(u => u.Uuid === stock.Stockdefine.DepartmentID)
                }
                stock.Warehouse = await db.warehouseModel.findOne({ where: { Uuid: stock.WarehouseID } })
            }
        }
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
        try {
            stock.Warehouse = await db.warehouseModel.findOne({ where: { Uuid: stock.WarehouseID } })
            stock.Stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: stock.StockdefineID } })
            let amount = 0.0;
            let movements = await db.stockmovementModel.findAll({ where: { StockID: stock.Uuid } })
            movements.forEach(movement => {
                amount += (movement.Amount * movement.Movementtype);
            });
            stock.Amount = amount
            if (stock.Stockdefine) {
                const departmentsresponse = await axios({
                    method: 'GET',
                    url: config.services.Setting + `Departments/${stock.Stockdefine.DepartmentID}`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                const unitsresponse = await axios({
                    method: 'GET',
                    url: config.services.Setting + `Units/${stock.Stockdefine.UnitID}`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                stock.Stockdefine.Department = departmentsresponse.data
                stock.Stockdefine.Unit = unitsresponse.data
            }
        } catch (error) {
            return next(requestErrorCatcher(error, 'Setting'))
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
    if (!validator.isISODate(Skt)) {
        validationErrors.push(messages.VALIDATION_ERROR.SKT_REQUIRED)
    }
    if (!validator.isString(Barcodeno)) {
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
        Uuid
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
    if (!validator.isISODate(Skt)) {
        validationErrors.push(messages.VALIDATION_ERROR.SKT_REQUIRED)
    }
    if (!validator.isString(Barcodeno)) {
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

async function DeleteStock(req, res, next) {

    let validationErrors = []
    const {
        Uuid
    } = req.body

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

        await db.stockmovementModel.destroy({ where: { StockID: Uuid } })
        await db.stockModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetStocks(req, res, next)
}

module.exports = {
    GetStocks,
    GetStock,
    AddStock,
    UpdateStock,
    DeleteStock,
}