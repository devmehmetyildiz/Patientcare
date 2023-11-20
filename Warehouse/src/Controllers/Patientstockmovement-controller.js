const config = require("../Config")
const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')

async function GetPatientstockmovements(req, res, next) {
    try {
        const patientstockmovements = await db.patientstockmovementModel.findAll({ where: { Isactive: true } })
        res.status(200).json(patientstockmovements)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
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
            return next(createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language))
        }
        if (!patientstockmovement.Isactive) {
            return next(createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language))
        }
        res.status(200).json(patientstockmovement)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
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
    } = req.body

    if (!validator.isUUID(StockID)) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKID_REQUIRED)
    }
    if (!validator.isNumber(Movementtype)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTTYPE_REQUIRED)
    }
    if (!validator.isNumber(Amount)) {
        validationErrors.push(messages.VALIDATION_ERROR.AMOUNT_REQUIRED)
    }
    if (!validator.isNumber(Prevvalue)) {
        validationErrors.push(messages.VALIDATION_ERROR.PREVVALUE_REQUIRED)
    }
    if (!validator.isNumber(Newvalue)) {
        validationErrors.push(messages.VALIDATION_ERROR.NEWVALUE_REQUIRED)
    }
    if (!validator.isISODate(Movementdate)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTDATE_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let stockmovementuuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        let amount = 0.0;
        let movements = await db.patientstockmovementModel.findAll({ where: { StockID: StockID } })
        movements.forEach(movement => {
            amount += (movement.Amount * movement.Movementtype);
        });
        await db.patientstockmovementModel.create({
            ...req.body,
            Prevvalue: amount,
            Newvalue: Amount + amount,
            Uuid: stockmovementuuid,
            Createduser: "System",
            Createtime: new Date(),
            Isapproved: false,
            Isactive: true
        }, { transaction: t })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetPatientstockmovements(req, res, next)
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
        Uuid
    } = req.body

    if (!validator.isUUID(StockID)) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKID_REQUIRED)
    }
    if (!validator.isNumber(Movementtype)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTTYPE_REQUIRED)
    }
    if (!validator.isNumber(Amount)) {
        validationErrors.push(messages.VALIDATION_ERROR.AMOUNT_REQUIRED)
    }
    if (!validator.isNumber(Prevvalue)) {
        validationErrors.push(messages.VALIDATION_ERROR.PREVVALUE_REQUIRED)
    }
    if (!validator.isNumber(Newvalue)) {
        validationErrors.push(messages.VALIDATION_ERROR.NEWVALUE_REQUIRED)
    }
    if (!validator.isISODate(Movementdate)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTDATE_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKMOVEMENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKMOVEMENTID)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    const t = await db.sequelize.transaction();

    try {
        const patientstockmovement = await db.patientstockmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!patientstockmovement) {
            return next(createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_FOUND], req.language))
        }
        if (patientstockmovement.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language))
        }

        await db.patientstockmovementModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPatientstockmovements(req, res, next)
}

async function ApprovePatientstockmovement(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.stockmovementId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKMOVEMENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKMOVEMENTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const patientstockmovement = await db.patientstockmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!patientstockmovement) {
            return next(createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_FOUND], req.language))
        }
        if (patientstockmovement.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language))
        }

        await db.patientstockmovementModel.update({
            ...patientstockmovement,
            Isapproved: true,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })
        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPatientstockmovements(req, res, next)
}

async function ApprovePatientstockmovements(req, res, next) {

    let validationErrors = []
    const body = req.body

    const t = await db.sequelize.transaction();
    try {
        for (const data of (body || [])) {
            if (!data) {
                validationErrors.push(messages.VALIDATION_ERROR.STOCKMOVEMENTID_REQUIRED)
            }
            if (!validator.isUUID(data)) {
                validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKMOVEMENTID)
            }
            if (validationErrors.length > 0) {
                return next(createValidationError(validationErrors, req.language))
            }
            const patientstockmovement = await db.patientstockmovementModel.findOne({ where: { Uuid: data } })
            if (!patientstockmovement) {
                return next(createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_FOUND], req.language))
            }
            if (patientstockmovement.Isactive === false) {
                return next(createAccessDenied([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language))
            }

            await db.patientstockmovementModel.update({
                ...patientstockmovement,
                Isapproved: true,
                Updateduser: "System",
                Updatetime: new Date(),
            }, { where: { Uuid: data } }, { transaction: t })
        }
        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetPatientstockmovements(req, res, next)
}

async function DeletePatientstockmovement(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.stockmovementId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKMOVEMENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKMOVEMENTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const patientstockmovement = await db.patientstockmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!patientstockmovement) {
            return next(createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_FOUND], req.language))
        }
        if (patientstockmovement.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language))
        }

        await db.patientstockmovementModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetPurchaseorderstockmovements(req, res, next)
}

module.exports = {
    GetPatientstockmovements,
    GetPatientstockmovement,
    AddPatientstockmovement,
    UpdatePatientstockmovement,
    DeletePatientstockmovement,
    ApprovePatientstockmovement,
    ApprovePatientstockmovements
}