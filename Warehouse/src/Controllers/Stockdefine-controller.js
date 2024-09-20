const config = require("../Config")
const { types } = require("../Constants/Defines")
const messages = require("../Constants/StockdefineMessages")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')

async function GetStockdefines(req, res, next) {
    try {
        const stockdefines = await db.stockdefineModel.findAll({ where: { Isactive: true } })
        res.status(200).json(stockdefines)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetStockdefine(req, res, next) {

    let validationErrors = []
    if (!req.params.stockdefineId) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKDEFINEID_REQUIRED)
    }
    if (!validator.isUUID(req.params.stockdefineId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKDEFINEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: req.params.stockdefineId } });
        if (!stockdefine) {
            return next(createNotfounderror([messages.ERROR.STOCKDEFINE_NOT_FOUND], req.language))
        }
        if (!stockdefine.Isactive) {
            return next(createNotfounderror([messages.ERROR.STOCKDEFINE_NOT_ACTIVE], req.language))
        }

        res.status(200).json(stockdefine)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddStockdefine(req, res, next) {

    let validationErrors = []
    const {
        Name,
        StocktypeID,
        UnitID,
        Barcode
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isUUID(UnitID)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNITID_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let stockdefineuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {

        const stocktype = await db.stocktypeModel.findOne({ where: { Uuid: StocktypeID } });

        if (stocktype?.Isbarcodeneed) {
            if (!validator.isString(Barcode)) {
                next(createValidationError([messages.VALIDATION_ERROR.BARCODE_REQUIRED], req.language))
            }
        }

        await db.stockdefineModel.create({
            ...req.body,
            Uuid: stockdefineuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: 'Stok Tanımları',
            role: 'stockdefinenotification',
            message: `${Name} ürün tanımı  ${username} tarafından Oluşturuldu.`,
            pushurl: `/Stockdefines`
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        next(sequelizeErrorCatcher(err))
    }
    GetStockdefines(req, res, next)
}

async function UpdateStockdefine(req, res, next) {

    let validationErrors = []
    const {
        Name,
        StocktypeID,
        UnitID,
        Barcode,
        Uuid
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isUUID(UnitID)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNITID_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKDEFINEID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKDEFINEID)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const stocktype = await db.stocktypeModel.findOne({ where: { Uuid: StocktypeID } });

        if (stocktype?.Isbarcodeneed) {
            if (!validator.isString(Barcode)) {
                next(createValidationError([messages.VALIDATION_ERROR.BARCODE_REQUIRED], req.language))
            }
        }

        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: Uuid } })
        if (!stockdefine) {
            return next(createNotfounderror([messages.ERROR.STOCKDEFINE_NOT_FOUND], req.language))
        }
        if (stockdefine.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STOCKDEFINE_NOT_ACTIVE], req.language))
        }

        await db.stockdefineModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Stok Tanımları',
            role: 'stockdefinenotification',
            message: `${Name} ürün tanımı  ${username} tarafından Güncellendi.`,
            pushurl: `/Stockdefines`
        })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetStockdefines(req, res, next)
}

async function DeleteStockdefine(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.stockdefineId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKDEFINEID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKDEFINEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: Uuid } })
        if (!stockdefine) {
            return next(createNotfounderror([messages.ERROR.STOCKDEFINE_NOT_FOUND], req.language))
        }
        if (stockdefine.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STOCKDEFINE_NOT_ACTIVE], req.language))
        }

        await db.stockdefineModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Create,
            service: 'Stok Tanımları',
            role: 'stockdefinenotification',
            message: `${stockdefine?.Name} ürün tanımı  ${username} tarafından Silindi.`,
            pushurl: `/Stockdefines`
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetStockdefines(req, res, next)
}

module.exports = {
    GetStockdefines,
    GetStockdefine,
    AddStockdefine,
    UpdateStockdefine,
    DeleteStockdefine,
}