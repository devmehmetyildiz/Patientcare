const config = require("../Config")
const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')

async function GetStockmovements(req, res, next) {
    try {
        const stockmovements = await db.stockmovementModel.findAll({ where: { Isactive: true } })
        let departments = []
        let units = []
        if (stockmovements && stockmovements.length > 0) {
            try {
                const departmentresponse = await axios({
                    method: 'GET',
                    url: config.services.Setting + 'Departments',
                    headers: {
                        session_key: config.session.secret
                    }
                })
                const unitresponse = await axios({
                    method: 'GET',
                    url: config.services.Setting + 'Units',
                    headers: {
                        session_key: config.session.secret
                    }
                })
                departments = departmentresponse.data
                units = unitresponse.data
            } catch (error) {
                return next(requestErrorCatcher(error, 'Setting'))
            }
        }
        for (const stockmovement of stockmovements) {
            stockmovement.Stock = await db.stockModel.findOne({ where: { Uuid: stockmovement.StockID } })
            if (stockmovement.Stock) {
                stockmovement.Stock.Stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: stockmovement.Stock.StockdefineID } })
                if (stockmovement.Stock.Stockdefine) {
                    stockmovement.Stock.Stockdefine.Department = departments.find(u => u.Uuid === stockmovement.Stock.Stockdefine.DepartmentID)
                    stockmovement.Stock.Stockdefine.Unit = units.find(u => u.Uuid === stockmovement.Stock.Stockdefine.UnitID)
                }
            }
        }
        res.status(200).json(stockmovements)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetStockmovement(req, res, next) {

    let validationErrors = []
    if (!req.params.stockmovementId) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKMOVEMENTID_REQUIRED)
    }
    if (!validator.isUUID(req.params.stockmovementId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKMOVEMENTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const stockmovement = await db.stockmovementModel.findOne({ where: { Uuid: req.params.stockmovementId } });
        if (!stockmovement) {
            return createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language)
        }
        if (!stockmovement.Isactive) {
            return createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language)
        }
        stockmovement.Stock = await db.stockModel.findOne({ where: { Uuid: stockmovement.StockID } })
        if (stockmovement.Stock) {
            stockmovement.Stock.Stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: stockmovement.Stock.StockdefineID } })
            if (stockmovement.Stock.Stockdefine) {
                try {
                    const departmentresponse = await axios({
                        method: 'GET',
                        url: config.services.Setting + `Departments/${stockmovement.Stock.Stockdefine.DepartmentID}`,
                        headers: {
                            session_key: config.session.secret
                        }
                    })
                    const unitresponse = await axios({
                        method: 'GET',
                        url: config.services.Setting + `Units/${stockmovement.Stock.Stockdefine.UnitID}`,
                        headers: {
                            session_key: config.session.secret
                        }
                    })
                    stockmovement.Stock.Stockdefine.Department = departmentresponse.data
                    stockmovement.Stock.Stockdefine.Unit = unitresponse.data
                } catch (error) {
                    return next(requestErrorCatcher(error, 'Setting'))
                }
            }
        }
        res.status(200).json(stockmovement)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddStockmovement(req, res, next) {

    let validationErrors = []
    const {
        StockID,
        Movementtype,
        Amount,
        Prevvalue,
        Newvalue,
        Movementdate,
        Status
    } = req.body

    if (!validator.isUUID(StockID)) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKID_REQUIRED, req.language)
    }
    if (!validator.isNumber(Movementtype)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTTYPE_REQUIRED, req.language)
    }
    if (!validator.isNumber(Amount)) {
        validationErrors.push(messages.VALIDATION_ERROR.AMOUNT_REQUIRED, req.language)
    }
    if (!validator.isNumber(Prevvalue)) {
        validationErrors.push(messages.VALIDATION_ERROR.PREVVALUE_REQUIRED, req.language)
    }
    if (!validator.isNumber(Newvalue)) {
        validationErrors.push(messages.VALIDATION_ERROR.NEWVALUE_REQUIRED, req.language)
    }
    if (!validator.isISODate(Movementdate)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTDATE_REQUIRED, req.language)
    }
    if (!validator.isNumber(Status)) {
        validationErrors.push(messages.VALIDATION_ERROR.STATUS_REQUIRED, req.language)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let stockmovementuuid = uuid()

    const t = await db.sequelize.transaction();
    try {
        let amount = 0.0;
        let movements = await db.stockmovementModel.findAll({ where: { StockID: StockID } })
        movements.forEach(movement => {
            amount += (movement.Amount * movement.Movementtype);
        });
        await db.stockmovementModel.create({
            ...req.body,
            Prevvalue: amount,
            Newvalue: Amount + amount,
            Uuid: stockmovementuuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })
        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetStockmovement(req, res, next)
}

async function UpdateStockmovement(req, res, next) {

    let validationErrors = []
    const {
        StockID,
        Movementtype,
        Amount,
        Prevvalue,
        Newvalue,
        Movementdate,
        Status,
        Uuid
    } = req.body

    if (!validator.isUUID(StockID)) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKID_REQUIRED, req.language)
    }
    if (!validator.isNumber(Movementtype)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTTYPE_REQUIRED, req.language)
    }
    if (!validator.isNumber(Amount)) {
        validationErrors.push(messages.VALIDATION_ERROR.AMOUNT_REQUIRED, req.language)
    }
    if (!validator.isNumber(Prevvalue)) {
        validationErrors.push(messages.VALIDATION_ERROR.PREVVALUE_REQUIRED, req.language)
    }
    if (!validator.isNumber(Newvalue)) {
        validationErrors.push(messages.VALIDATION_ERROR.NEWVALUE_REQUIRED, req.language)
    }
    if (!validator.isISODate(Movementdate)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTDATE_REQUIRED, req.language)
    }
    if (!validator.isNumber(Status)) {
        validationErrors.push(messages.VALIDATION_ERROR.STATUS_REQUIRED, req.language)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKMOVEMENTID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKMOVEMENTID, req.language)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    const t = await db.sequelize.transaction();
    try {
        const stockmovement = await db.stockmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!stockmovement) {
            return next(createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_FOUND], req.language))
        }
        if (stockmovement.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language))
        }

        await db.stockmovementModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })
        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetStockmovement(req, res, next)
}

async function DeleteStockmovement(req, res, next) {

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

    const t = await db.sequelize.transaction();
    try {
        const stockmovement = await db.stockmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!stockmovement) {
            return next(createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_FOUND], req.language))
        }
        if (stockmovement.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language))
        }
        await db.stockmovementModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetStockmovement(req, res, next)
}


module.exports = {
    GetStockmovements,
    GetStockmovement,
    AddStockmovement,
    UpdateStockmovement,
    DeleteStockmovement,
}