const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetPatientstockmovements(req, res, next) {
    try {
        const patientstockmovements = await db.patientstockmovementModel.findAll({ where: { Isactive: true } })
        for (const patientstockmovement of patientstockmovements) {
            patientstockmovement.Stock = db.patientstockModel.find(u => u.Uuid === patientstockmovement.StockID)
            patientstockmovement.Stock && (patientstockmovement.Stock.Stockdefine = db.stockdefineModel.find(u => u.Uuid === patientstockmovement.Stock.StockdefineID))
        }
        res.status(200).json(patientstockmovements)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function GetPatientstockmovement(req, res, next) {

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
        const patientstockmovement = await db.patientstockmovementModel.findOne({ where: { Uuid: req.params.stockmovementId } });
        if (!patientstockmovement) {
            return createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language)
        }
        if (!patientstockmovement.Isactive) {
            return createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language)
        }
        patientstockmovement.Stock = db.patientstockModel.find(u => u.Uuid === patientstockmovement.StockID)
        patientstockmovement.Stock && (patientstockmovement.Stock.Stockdefine = db.stockdefineModel.find(u => u.Uuid === patientstockmovement.Stock.StockdefineID))
        res.status(200).json(patientstockmovement)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function AddPatientstockmovement(req, res, next) {

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
        await db.patientstockmovementModel.create({
            ...req.body,
            Uuid: stockmovementuuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await t.commit()
        const patientstockmovements = await db.patientstockmovementModel.findAll({ where: { Isactive: true } })
        for (const patientstockmovement of patientstockmovements) {
            patientstockmovement.Stock = db.patientstockModel.find(u => u.Uuid === patientstockmovement.StockID)
            patientstockmovement.Stock && (patientstockmovement.Stock.Stockdefine = db.stockdefineModel.find(u => u.Uuid === patientstockmovement.Stock.StockdefineID))
        }
        res.status(200).json(patientstockmovements)
    } catch (err) {
        await t.rollback()
        next(sequelizeErrorCatcher(err))
    }
}

async function UpdatePatientstockmovement(req, res, next) {

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
        const patientstockmovement = await db.patientstockmovementModel.findOne({ where: { Uuid: req.params.stockmovementId } });
        if (!patientstockmovement) {
            return createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language)
        }
        if (!patientstockmovement.Isactive) {
            return createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language)
        }

        const t = await db.sequelize.transaction();

        await db.patientstockmovementModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await t.commit()
        const patientstockmovements = await db.patientstockmovementModel.findAll({ where: { Isactive: true } })
        for (const patientstockmovement of patientstockmovements) {
            patientstockmovement.Stock = db.patientstockModel.find(u => u.Uuid === patientstockmovement.StockID)
            patientstockmovement.Stock && (patientstockmovement.Stock.Stockdefine = db.stockdefineModel.find(u => u.Uuid === patientstockmovement.Stock.StockdefineID))
        }
        res.status(200).json(patientstockmovements)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }


}

async function DeletePatientstockmovement(req, res, next) {

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
        const patientstockmovement = await db.patientstockmovementModel.findOne({ where: { Uuid: req.params.stockmovementId } });
        if (!patientstockmovement) {
            return createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language)
        }
        if (!patientstockmovement.Isactive) {
            return createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language)
        }
        const t = await db.sequelize.transaction();

        await db.patientstockmovementModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();
        const patientstockmovements = await db.patientstockmovementModel.findAll({ where: { Isactive: true } })
        for (const patientstockmovement of patientstockmovements) {
            patientstockmovement.Stock = db.patientstockModel.find(u => u.Uuid === patientstockmovement.StockID)
            patientstockmovement.Stock && (patientstockmovement.Stock.Stockdefine = db.stockdefineModel.find(u => u.Uuid === patientstockmovement.Stock.StockdefineID))
        }
        res.status(200).json(patientstockmovements)
    } catch (error) {
        await t.rollback();
        next(sequelizeErrorCatcher(error))
    }

}

module.exports = {
    GetPatientstockmovements,
    GetPatientstockmovement,
    AddPatientstockmovement,
    UpdatePatientstockmovement,
    DeletePatientstockmovement,
}