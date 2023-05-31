const config = require("../Config")
const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')

async function GetPurchaseorderstockmovements(req, res, next) {
    try {
        const purchaseorderstockmovements = await db.purchaseorderstockmovementModel.findAll({ where: { Isactive: true } })
        let departments = []
        let units = []
        if (purchaseorderstockmovements && purchaseorderstockmovements.length > 0) {
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
        for (const purchaseorderstockmovement of purchaseorderstockmovements) {
            purchaseorderstockmovement.Stock = await db.purchaseorderstockModel.findOne({ where: { Uuid: purchaseorderstockmovement.StockID } })
            if (purchaseorderstockmovement.Stock) {
                purchaseorderstockmovement.Stock.Stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: purchaseorderstockmovement.Stock.StockdefineID } })
                if (purchaseorderstockmovement.Stock.Stockdefine) {
                    purchaseorderstockmovement.Stock.Stockdefine.Department = departments.find(u => u.Uuid === purchaseorderstockmovement.Stock.Stockdefine.DepartmentID)
                    purchaseorderstockmovement.Stock.Stockdefine.Unit = units.find(u => u.Uuid === purchaseorderstockmovement.Stock.Stockdefine.UnitID)
                }
            }
        }
        res.status(200).json(purchaseorderstockmovements)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPurchaseorderstockmovement(req, res, next) {

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
        const purchaseorderstockmovement = await db.purchaseorderstockmovementModel.findOne({ where: { Uuid: req.params.stockmovementId } });
        if (!purchaseorderstockmovement) {
            return createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language)
        }
        if (!purchaseorderstockmovement.Isactive) {
            return createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language)
        }
        purchaseorderstockmovement.Stock = await db.purchaseorderstockModel.findOne({ where: { Uuid: purchaseorderstockmovement.StockID } })
        if (purchaseorderstockmovement.Stock) {
            purchaseorderstockmovement.Stock.Stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: purchaseorderstockmovement.Stock.StockdefineID } })
            if (purchaseorderstockmovement.Stock.Stockdefine) {
                try {
                    const departmentresponse = await axios({
                        method: 'GET',
                        url: config.services.Setting + `Departments/${purchaseorderstockmovement.Stock.Stockdefine.DepartmentID}`,
                        headers: {
                            session_key: config.session.secret
                        }
                    })
                    const unitresponse = await axios({
                        method: 'GET',
                        url: config.services.Setting + `Units/${purchaseorderstockmovement.Stock.Stockdefine.UnitID}`,
                        headers: {
                            session_key: config.session.secret
                        }
                    })
                    purchaseorderstockmovement.Stock.Stockdefine.Department = departmentresponse.data
                    purchaseorderstockmovement.Stock.Stockdefine.Unit = unitresponse.data
                } catch (error) {
                    return next(requestErrorCatcher(error, 'Setting'))
                }
            }
        }
        res.status(200).json(purchaseorderstockmovement)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddPurchaseorderstockmovement(req, res, next) {

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
        let movements = await db.purchaseorderstockmovementModel.findAll({ where: { StockID: StockID } })
        movements.forEach(movement => {
            amount += (movement.Amount * movement.Movementtype);
        });
        await db.purchaseorderstockmovementModel.create({
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
    GetPurchaseorderstockmovements(req, res, next)
}

async function UpdatePurchaseorderstockmovement(req, res, next) {

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
        const purchaseorderstockmovement = db.purchaseorderstockmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!purchaseorderstockmovement) {
            return next(createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_FOUND], req.language))
        }
        if (purchaseorderstockmovement.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language))
        }

        await db.purchaseorderstockmovementModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPurchaseorderstockmovements(req, res, next)
}

async function DeletePurchaseorderstockmovement(req, res, next) {

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
        const purchaseorderstockmovement = db.purchaseorderstockmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!purchaseorderstockmovement) {
            return next(createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_FOUND], req.language))
        }
        if (purchaseorderstockmovement.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language))
        }

        await db.purchaseorderstockmovementModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetPurchaseorderstockmovements(req, res, next)
}

module.exports = {
    GetPurchaseorderstockmovements,
    GetPurchaseorderstockmovement,
    AddPurchaseorderstockmovement,
    UpdatePurchaseorderstockmovement,
    DeletePurchaseorderstockmovement,
}