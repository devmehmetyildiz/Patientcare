const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


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
                next(requestErrorCatcher(error, 'Setting'))
            }
            for (const stock of stocks) {
                let amount = 0.0;
                let movements = await db.stockmovementModel.findAll({ where: { StockID: stock.Uuid } })
                movements.forEach(movement => {
                    amount += (movement.Amount * movement.Movementtype);
                });
                stock.Amount = amount
                stock.Stockdefine = db.stockdefineModel.findOne({ where: { Uuid: stock.StockdefineID } })
                stock.Stockdefine.Unit = units.find(u => u.Uuid === stock.Stockdefine.UnitID)
                stock.Stockdefine.Department = departments.find(u => u.Uuid === stock.Stockdefine.DepartmentID)
                stock.Warehouse = db.warehouseModel.findOne({ where: { Uuid: stock.WarehouseID } })
            }
        }
        res.status(200).json(stocks)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function GetStock(req, res, next) {

    let validationErrors = []
    if (!req.params.stockId) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKMOVEMENTID_REQUIRED)
    }
    if (!validator.isUUID(req.params.stockId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKMOVEMENTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const stock = await db.stockModel.findOne({ where: { Uuid: req.params.stockId } });
        if (!stock) {
            return createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language)
        }
        if (!stock.Isactive) {
            return createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language)
        }
        try {
            stock.Warehouse = db.warehouseModel.findOne({ where: { Uuid: stock.WarehouseID } })
            stock.Stockdefine = db.stockdefineModel.findOne({ where: { Uuid: stock.StockdefineID } })
            let amount = 0.0;
            let movements = await db.stockmovementModel.findAll({ where: { StockID: stock.Uuid } })
            movements.forEach(movement => {
                amount += (movement.Amount * movement.Movementtype);
            });
            stock.Amount = amount
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
        } catch (error) {
            next(requestErrorCatcher(error, 'Setting'))
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
        Isdeactive,
        Deactivetime,
        Source,
        StockdefineID,
        DepartmentID,
        Skt,
        Barcodeno,
        Info,
        Willdelete,
        Status,
        Order,
    } = req.body

    if (!validator.isUUID(WarehouseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKID_REQUIRED, req.language)
    }
    if (!validator.isBoolean(Isonusage)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTTYPE_REQUIRED, req.language)
    }
    if (!validator.isBoolean(Isdeactive)) {
        validationErrors.push(messages.VALIDATION_ERROR.AMOUNT_REQUIRED, req.language)
    }
    if (!validator.isISODate(Deactivetime)) {
        validationErrors.push(messages.VALIDATION_ERROR.PREVVALUE_REQUIRED, req.language)
    }
    if (!validator.isNumber(Source)) {
        validationErrors.push(messages.VALIDATION_ERROR.NEWVALUE_REQUIRED, req.language)
    }
    if (!validator.isUUID(StockdefineID)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTDATE_REQUIRED, req.language)
    }
    if (!validator.isUUID(DepartmentID)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTDATE_REQUIRED, req.language)
    }
    if (!validator.isISODate(Skt)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTDATE_REQUIRED, req.language)
    }
    if (!validator.isString(Barcodeno)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTDATE_REQUIRED, req.language)
    }
    if (!validator.isString(Info)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTDATE_REQUIRED, req.language)
    }
    if (!validator.isBoolean(Willdelete)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTDATE_REQUIRED, req.language)
    }
    if (!validator.isNumber(Status)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTDATE_REQUIRED, req.language)
    }
    if (!validator.isNumber(Order)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTDATE_REQUIRED, req.language)
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

        await t.commit()
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
                next(requestErrorCatcher(error, 'Setting'))
            }
            for (const stock of stocks) {
                let amount = 0.0;
                let movements = await db.stockmovementModel.findAll({ where: { StockID: stock.Uuid } })
                movements.forEach(movement => {
                    amount += (movement.Amount * movement.Movementtype);
                });
                stock.Amount = amount
                stock.Stockdefine = db.stockdefineModel.findOne({ where: { Uuid: stock.StockdefineID } })
                stock.Stockdefine.Unit = units.find(u => u.Uuid === stock.Stockdefine.UnitID)
                stock.Stockdefine.Department = departments.find(u => u.Uuid === stock.Stockdefine.DepartmentID)
                stock.Warehouse = db.warehouseModel.findOne({ where: { Uuid: stock.WarehouseID } })
            }
        }
        res.status(200).json(stocks)
    } catch (err) {
        await t.rollback()
        next(sequelizeErrorCatcher(err))
    }
}

async function UpdateStock(req, res, next) {

    let validationErrors = []
    const {
        WarehouseID,
        Isonusage,
        Isdeactive,
        Deactivetime,
        Source,
        StockdefineID,
        DepartmentID,
        Skt,
        Barcodeno,
        Info,
        Willdelete,
        Status,
        Order,
        Uuid
    } = req.body

    if (!validator.isUUID(WarehouseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKID_REQUIRED, req.language)
    }
    if (!validator.isBoolean(Isonusage)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTTYPE_REQUIRED, req.language)
    }
    if (!validator.isBoolean(Isdeactive)) {
        validationErrors.push(messages.VALIDATION_ERROR.AMOUNT_REQUIRED, req.language)
    }
    if (!validator.isISODate(Deactivetime)) {
        validationErrors.push(messages.VALIDATION_ERROR.PREVVALUE_REQUIRED, req.language)
    }
    if (!validator.isNumber(Source)) {
        validationErrors.push(messages.VALIDATION_ERROR.NEWVALUE_REQUIRED, req.language)
    }
    if (!validator.isUUID(StockdefineID)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTDATE_REQUIRED, req.language)
    }
    if (!validator.isUUID(DepartmentID)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTDATE_REQUIRED, req.language)
    }
    if (!validator.isISODate(Skt)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTDATE_REQUIRED, req.language)
    }
    if (!validator.isString(Barcodeno)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTDATE_REQUIRED, req.language)
    }
    if (!validator.isString(Info)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTDATE_REQUIRED, req.language)
    }
    if (!validator.isBoolean(Willdelete)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTDATE_REQUIRED, req.language)
    }
    if (!validator.isNumber(Status)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTDATE_REQUIRED, req.language)
    }
    if (!validator.isNumber(Order)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTDATE_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTDATE_REQUIRED, req.language)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTDATE_REQUIRED, req.language)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    try {
        const stock = db.stockModel.findOne({ where: { Uuid: Uuid } })
        if (!stock) {
            return next(createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_FOUND], req.language))
        }
        if (stock.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language))
        }

        const t = await db.sequelize.transaction();

        await db.stockModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await t.commit()
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
                next(requestErrorCatcher(error, 'Setting'))
            }
            for (const stock of stocks) {
                let amount = 0.0;
                let movements = await db.stockmovementModel.findAll({ where: { StockID: stock.Uuid } })
                movements.forEach(movement => {
                    amount += (movement.Amount * movement.Movementtype);
                });
                stock.Amount = amount
                stock.Stockdefine = db.stockdefineModel.findOne({ where: { Uuid: stock.StockdefineID } })
                stock.Stockdefine.Unit = units.find(u => u.Uuid === stock.Stockdefine.UnitID)
                stock.Stockdefine.Department = departments.find(u => u.Uuid === stock.Stockdefine.DepartmentID)
                stock.Warehouse = db.warehouseModel.findOne({ where: { Uuid: stock.WarehouseID } })
            }
        }
        res.status(200).json(stocks)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }


}

async function DeleteStock(req, res, next) {

    let validationErrors = []
    const {
        Uuid
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKMOVEMENTID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKMOVEMENTID, req.language)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const stock = await db.stockModel.findOne({ where: { Uuid: req.params.stockId } });
        if (!stock) {
            return createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language)
        }
        if (!stock.Isactive) {
            return createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language)
        }
        const t = await db.sequelize.transaction();

        await db.stockModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();
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
                next(requestErrorCatcher(error, 'Setting'))
            }
            for (const stock of stocks) {
                let amount = 0.0;
                let movements = await db.stockmovementModel.findAll({ where: { StockID: stock.Uuid } })
                movements.forEach(movement => {
                    amount += (movement.Amount * movement.Movementtype);
                });
                stock.Amount = amount
                stock.Stockdefine = stockdefineModel.findOne({ where: { Uuid: stock.StockdefineID } })
                stock.Stockdefine.Unit = units.find(u => u.Uuid === stock.Stockdefine.UnitID)
                stock.Stockdefine.Department = units.find(u => u.Uuid === stock.Stockdefine.DepartmentID)
                stock.Stockdefine.Department = units.find(u => u.Uuid === stock.Stockdefine.DepartmentID)
                stock.Warehouse = warehouseModel.findOne({ where: { Uuid: stock.WarehouseID } })
            }
        }
        res.status(200).json(stocks)
    } catch (error) {
        await t.rollback();
        next(sequelizeErrorCatcher(error))
    }

}

module.exports = {
    GetStocks,
    GetStock,
    AddStock,
    UpdateStock,
    DeleteStock,
}