const config = require("../Config")
const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')


async function GetPurchaseorderstocks(req, res, next) {
    try {
        const purchaseorderstocks = await db.purchaseorderstockModel.findAll({ where: { Isactive: true } })
        res.status(200).json(purchaseorderstocks)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPurchaseorderstock(req, res, next) {

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
        const purchaseorderstock = await db.purchaseorderstockModel.findOne({ where: { Uuid: req.params.stockId } });
        if (!purchaseorderstock) {
            return next(createNotfounderror([messages.ERROR.STOCK_NOT_FOUND], req.language))
        }
        if (!purchaseorderstock.Isactive) {
            return next(createNotfounderror([messages.ERROR.STOCK_NOT_ACTIVE], req.language))
        }
        res.status(200).json(purchaseorderstock)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddPurchaseorderstock(req, res, next) {

    let validationErrors = []
    const {
        PurchaseorderID,
        StockdefineID,
        DepartmentID,
        Skt,
        Barcodeno,
        Order,
        Ismedicine,
        Issupply
    } = req.body

    if (!validator.isUUID(PurchaseorderID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PURCHASEORDERID_REQUIRED)
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
    try {
        await db.purchaseorderstockModel.create({
            ...req.body,
            Uuid: stockuuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await db.purchaseorderstockmovementModel.create({
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
    GetPurchaseorderstocks(req, res, next)
}

async function UpdatePurchaseorderstock(req, res, next) {

    let validationErrors = []
    const {
        PurchaseorderID,
        StockdefineID,
        DepartmentID,
        Skt,
        Barcodeno,
        Order,
        Uuid,
        Ismedicine,
        Issupply
    } = req.body

    if (!validator.isUUID(PurchaseorderID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PURCHASEORDERID_REQUIRED)
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
    try {
        const purchaseorderstock = db.purchaseorderstockModel.findOne({ where: { Uuid: Uuid } })
        if (!purchaseorderstock) {
            return next(createNotfounderror([messages.ERROR.STOCK_NOT_FOUND], req.language))
        }
        if (purchaseorderstock.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STOCK_NOT_ACTIVE], req.language))
        }

        await db.purchaseorderstockModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPurchaseorderstocks(req, res, next)
}

async function ApprovePurchaseorderstock(req, res, next) {

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
        const purchaseorderstock = await db.purchaseorderstockModel.findOne({ where: { Uuid: Uuid } })
        if (!purchaseorderstock) {
            return next(createNotfounderror([messages.ERROR.STOCK_NOT_FOUND], req.language))
        }
        if (purchaseorderstock.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STOCK_NOT_ACTIVE], req.language))
        }

        await db.purchaseorderstockModel.update({
            ...purchaseorderstock,
            Isapproved: true,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetPurchaseorderstocks(req, res, next)
}

async function ApprovePurchaseorderstocks(req, res, next) {

    let validationErrors = []
    const body = req.body

    const t = await db.sequelize.transaction();
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

            const purchaseorderstock = await db.purchaseorderstockModel.findOne({ where: { Uuid: data } })
            if (!purchaseorderstock) {
                return next(createNotfounderror([messages.ERROR.STOCK_NOT_FOUND], req.language))
            }
            if (purchaseorderstock.Isactive === false) {
                return next(createAccessDenied([messages.ERROR.STOCK_NOT_ACTIVE], req.language))
            }

            await db.purchaseorderstockModel.update({
                ...purchaseorderstock,
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
    GetPurchaseorderstocks(req, res, next)
}

async function DeletePurchaseorderstock(req, res, next) {

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
        const purchaseorderstock = await db.purchaseorderstockModel.findOne({ where: { Uuid: req.params.stockId } });
        if (!purchaseorderstock) {
            return createNotfounderror([messages.ERROR.STOCK_NOT_FOUND])
        }
        if (!purchaseorderstock.Isactive) {
            return createNotfounderror([messages.ERROR.STOCK_NOT_ACTIVE])
        }

        await db.purchaseorderstockmovementModel.destroy({ where: { StockID: Uuid } })
        await db.purchaseorderstockModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetPurchaseorderstocks(req, res, next)
}

module.exports = {
    GetPurchaseorderstocks,
    GetPurchaseorderstock,
    AddPurchaseorderstock,
    UpdatePurchaseorderstock,
    DeletePurchaseorderstock,
    ApprovePurchaseorderstock,
    ApprovePurchaseorderstocks,
}