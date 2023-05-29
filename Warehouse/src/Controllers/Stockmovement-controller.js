const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetStockmovements(req, res, next) {
    try {
        const stockmovements = await db.stockmovementModel.findAll({ where: { Isactive: true } })
        for (const stockmovement of stockmovements) {
            stockmovement.Stock = stockModel.find(u => u.Uuid === stockmovement.StockID)
        }
        res.status(200).json(stockmovements)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
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
        stockmovement.Stock = stockModel.find(u => u.Uuid === stockmovement.StockID)
        res.status(200).json(stockmovement)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
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
        await db.stockmovementModel.create({
            ...req.body,
            Uuid: stockmovementuuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await t.commit()
        const stockmovements = await db.stockmovementModel.findAll({ where: { Isactive: true } })
        for (const stockmovement of stockmovements) {
            stockmovement.Stock = stockModel.find(u => u.Uuid === stockmovement.StockID)
        }
        res.status(200).json(stockmovements)
    } catch (err) {
        await t.rollback()
        next(sequelizeErrorCatcher(err))
    }
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
    try {
        const stockmovement = db.stockmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!stockmovement) {
            return next(createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_FOUND], req.language))
        }
        if (stockmovement.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language))
        }

        const t = await db.sequelize.transaction();

        await db.stockmovementModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await t.commit()
        const stockmovements = await db.stockmovementModel.findAll({ where: { Isactive: true } })
        for (const stockmovement of stockmovements) {
            stockmovement.Stock = stockModel.find(u => u.Uuid === stockmovement.StockID)
        }
        res.status(200).json(stockmovements)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }


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

    try {
        const stockmovement = db.stockmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!stockmovement) {
            return next(createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_FOUND], req.language))
        }
        if (stockmovement.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language))
        }
        const t = await db.sequelize.transaction();

        await db.stockmovementModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();
        const stockmovements = await db.stockmovementModel.findAll({ where: { Isactive: true } })
        for (const stockmovement of stockmovements) {
            stockmovement.Stock = stockModel.find(u => u.Uuid === stockmovement.StockID)
        }
        res.status(200).json(stockmovements)
    } catch (error) {
        await t.rollback();
        next(sequelizeErrorCatcher(error))
    }

}

module.exports = {
    GetStockmovements,
    GetStockmovement,
    AddStockmovement,
    UpdateStockmovement,
    DeleteStockmovement,
}