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
        if (purchaseorderstocks && purchaseorderstocks.length > 0) {
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
            for (const purchaseorderstock of purchaseorderstocks) {
                let amount = 0.0;
                let movements = await db.purchaseorderstockmovementModel.findAll({ where: { StockID: purchaseorderstock.Uuid } })
                movements.forEach(movement => {
                    amount += (movement.Amount * movement.Movementtype);
                });
                purchaseorderstock.Amount = amount
                purchaseorderstock.Stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: purchaseorderstock.StockdefineID } })
                if (purchaseorderstock.Stockdefine) {
                    purchaseorderstock.Stockdefine.Unit = units.find(u => u.Uuid === purchaseorderstock.Stockdefine.UnitID)
                    purchaseorderstock.Stockdefine.Department = departments.find(u => u.Uuid === purchaseorderstock.Stockdefine.DepartmentID)
                }
                purchaseorderstock.Purchaseorder = await db.purchaseorderModel.findOne({ where: { Uuid: purchaseorderstock.PurchaseorderID } })
            }
        }
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
            return createNotfounderror([messages.ERROR.STOCK_NOT_FOUND], req.language)
        }
        if (!purchaseorderstock.Isactive) {
            return createNotfounderror([messages.ERROR.STOCK_NOT_ACTIVE], req.language)
        }
        try {
            purchaseorderstock.Purchaseorder = await db.purchaseorderModel.findOne({ where: { Uuid: purchaseorderstock.PurchaseorderID } })
            purchaseorderstock.Stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: purchaseorderstock.StockdefineID } })
            let amount = 0.0;
            let movements = await db.purchaseorderstockModel.findAll({ where: { StockID: purchaseorderstock.Uuid } })
            movements.forEach(movement => {
                amount += (movement.Amount * movement.Movementtype);
            });
            purchaseorderstock.Amount = amount
            if (purchaseorderstock.Stockdefine) {
                const departmentsresponse = await axios({
                    method: 'GET',
                    url: config.services.Setting + `Departments/${purchaseorderstock.Stockdefine.DepartmentID}`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                const unitsresponse = await axios({
                    method: 'GET',
                    url: config.services.Setting + `Units/${purchaseorderstock.Stockdefine.UnitID}`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                purchaseorderstock.Stockdefine.Department = departmentsresponse.data
                purchaseorderstock.Stockdefine.Unit = unitsresponse.data
            }
        } catch (error) {
            return next(requestErrorCatcher(error, 'Setting'))
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
        Isonusage,
        Source,
        StockdefineID,
        DepartmentID,
        Skt,
        Barcodeno,
        Info,
        Status,
        Order,
    } = req.body

    if (!validator.isUUID(PurchaseorderID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PURCHASEORDERID_REQUIRED, req.language)
    }
    if (!validator.isBoolean(Isonusage)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISONUSAGE_REQUIRED, req.language)
    }
    if (!validator.isNumber(Source)) {
        validationErrors.push(messages.VALIDATION_ERROR.SOURCE_REQUIRED, req.language)
    }
    if (!validator.isUUID(StockdefineID)) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKDEFINEID_REQUIRED, req.language)
    }
    if (!validator.isUUID(DepartmentID)) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED, req.language)
    }
    if (!validator.isISODate(Skt)) {
        validationErrors.push(messages.VALIDATION_ERROR.SKT_REQUIRED, req.language)
    }
    if (!validator.isString(Barcodeno)) {
        validationErrors.push(messages.VALIDATION_ERROR.BARCODENO_REQUIRED, req.language)
    }
    if (!validator.isString(Info)) {
        validationErrors.push(messages.VALIDATION_ERROR.INFO_REQUIRED, req.language)
    }
    if (!validator.isNumber(Status)) {
        validationErrors.push(messages.VALIDATION_ERROR.STATUS_REQUIRED, req.language)
    }
    if (!validator.isNumber(Order)) {
        validationErrors.push(messages.VALIDATION_ERROR.ORDER_REQUIRED, req.language)
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
    GetPurchaseorderstocks(req, res, next)
}

async function UpdatePurchaseorderstock(req, res, next) {

    let validationErrors = []
    const {
        PurchaseorderID,
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

    if (!validator.isUUID(PurchaseorderID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PURCHASEORDERID_REQUIRED, req.language)
    }
    if (!validator.isBoolean(Isonusage)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISONUSAGE_REQUIRED, req.language)
    }
    if (!validator.isNumber(Source)) {
        validationErrors.push(messages.VALIDATION_ERROR.SOURCE_REQUIRED, req.language)
    }
    if (!validator.isUUID(StockdefineID)) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKDEFINEID_REQUIRED, req.language)
    }
    if (!validator.isUUID(DepartmentID)) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED, req.language)
    }
    if (!validator.isISODate(Skt)) {
        validationErrors.push(messages.VALIDATION_ERROR.SKT_REQUIRED, req.language)
    }
    if (!validator.isString(Barcodeno)) {
        validationErrors.push(messages.VALIDATION_ERROR.BARCODENO_REQUIRED, req.language)
    }
    if (!validator.isString(Info)) {
        validationErrors.push(messages.VALIDATION_ERROR.INFO_REQUIRED, req.language)
    }
    if (!validator.isNumber(Status)) {
        validationErrors.push(messages.VALIDATION_ERROR.STATUS_REQUIRED, req.language)
    }
    if (!validator.isNumber(Order)) {
        validationErrors.push(messages.VALIDATION_ERROR.ORDER_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKID, req.language)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKID_REQUIRED, req.language)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    const t = await db.sequelize.transaction();
    try {
        const stock = db.stockModel.findOne({ where: { Uuid: Uuid } })
        if (!stock) {
            return next(createNotfounderror([messages.ERROR.STOCK_NOT_FOUND], req.language))
        }
        if (stock.Isactive === false) {
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

async function DeletePurchaseorderstock(req, res, next) {

    let validationErrors = []
    const {
        Uuid
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKID, req.language)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const purchaseorderstock = await db.purchaseorderstockModel.findOne({ where: { Uuid: req.params.stockId } });
        if (!purchaseorderstock) {
            return createNotfounderror([messages.ERROR.STOCK_NOT_FOUND], req.language)
        }
        if (!purchaseorderstock.Isactive) {
            return createNotfounderror([messages.ERROR.STOCK_NOT_ACTIVE], req.language)
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
}