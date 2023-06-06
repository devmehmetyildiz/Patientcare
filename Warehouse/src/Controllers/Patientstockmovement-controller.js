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
        let departments = []
        let units = []
        if (patientstockmovements && patientstockmovements.length > 0) {
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
        for (const patientstockmovement of patientstockmovements) {
            patientstockmovement.Stock = await db.patientstockModel.findOne({ where: { Uuid: patientstockmovement.StockID } })
            if (patientstockmovement.Stock) {
                patientstockmovement.Stock.Stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: patientstockmovement.Stock.StockdefineID } })
                if (patientstockmovement.Stock.Stockdefine) {
                    patientstockmovement.Stock.Stockdefine.Department = departments.find(u => u.Uuid === patientstockmovement.Stock.Stockdefine.DepartmentID)
                    patientstockmovement.Stock.Stockdefine.Unit = units.find(u => u.Uuid === patientstockmovement.Stock.Stockdefine.UnitID)
                }
            }
        }
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
        patientstockmovement.Stock = await db.purchaseorderstockModel.findOne({ where: { Uuid: patientstockmovement.StockID } })
        if (patientstockmovement.Stock) {
            patientstockmovement.Stock.Stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: patientstockmovement.Stock.StockdefineID } })
            if (patientstockmovement.Stock.Stockdefine) {
                try {
                    const departmentresponse = await axios({
                        method: 'GET',
                        url: config.services.Setting + `Departments/${patientstockmovement.Stock.Stockdefine.DepartmentID}`,
                        headers: {
                            session_key: config.session.secret
                        }
                    })
                    const unitresponse = await axios({
                        method: 'GET',
                        url: config.services.Setting + `Units/${patientstockmovement.Stock.Stockdefine.UnitID}`,
                        headers: {
                            session_key: config.session.secret
                        }
                    })
                    patientstockmovement.Stock.Stockdefine.Department = departmentresponse.data
                    patientstockmovement.Stock.Stockdefine.Unit = unitresponse.data
                } catch (error) {
                    return next(requestErrorCatcher(error, 'Setting'))
                }
            }
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
        const patientstockmovement =await db.patientstockmovementModel.findOne({ where: { Uuid: Uuid } })
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

    const t = await db.sequelize.transaction();
    try {
        const patientstockmovement =await db.patientstockmovementModel.findOne({ where: { Uuid: Uuid } })
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
}