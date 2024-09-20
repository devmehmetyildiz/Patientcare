const config = require("../Config")
const { types } = require("../Constants/Defines")
const messages = require("../Constants/StocktypeMessages")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')

async function GetStocktypes(req, res, next) {
    try {
        const stocktypes = await db.stocktypeModel.findAll()
        res.status(200).json(stocktypes)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetStocktype(req, res, next) {

    let validationErrors = []
    if (!req.params.stocktypeId) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKTYPEID_REQUIRED)
    }
    if (!validator.isUUID(req.params.stocktypeId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKTYPEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const stocktype = await db.stocktypeModel.findOne({ where: { Uuid: req.params.stocktypeId } });
        if (!stocktype) {
            return next(createNotfounderror([messages.ERROR.STOCKTYPE_NOT_FOUND], req.language))
        }
        if (!stocktype.Isactive) {
            return next(createNotfounderror([messages.ERROR.STOCKTYPE_NOT_ACTIVE], req.language))
        }
        res.status(200).json(stocktype)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddStocktype(req, res, next) {

    let validationErrors = []
    const {
        Name,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let stocktypeuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.stocktypeModel.create({
            ...req.body,
            Uuid: stocktypeuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: 'Stok Türleri',
            role: 'stocktypenotification',
            message: `${Name} stok türü  ${username} tarafından eklendi.`,
            pushurl: `/Stocktypes`
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetStocktypes(req, res, next)
}

async function UpdateStocktype(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Uuid
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKTYPEID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKTYPEID)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const stocktype = await db.stocktypeModel.findOne({ where: { Uuid: Uuid } })
        if (!stocktype) {
            return next(createNotfounderror([messages.ERROR.STOCKTYPE_NOT_FOUND], req.language))
        }
        if (stocktype.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STOCKTYPE_NOT_ACTIVE], req.language))
        }

        await db.stocktypeModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })


        await CreateNotification({
            type: types.Update,
            service: 'Stok Türleri',
            role: 'stocktypenotification',
            message: `${stocktype?.Name} stok türü  ${username} tarafından Güncellendi.`,
            pushurl: `/Stocktypes`
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetStocktypes(req, res, next)
}


async function DeleteStocktype(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.stocktypeId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKTYPEID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKTYPEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const stocktype = await db.stocktypeModel.findOne({ where: { Uuid: Uuid } })
        if (!stocktype) {
            return next(createNotfounderror([messages.ERROR.STOCKTYPE_NOT_FOUND], req.language))
        }
        if (stocktype.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STOCKTYPE_NOT_ACTIVE], req.language))
        }

        await db.stocktypeModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: 'Stok Türleri',
            role: 'stocktypenotification',
            message: `${stocktype?.Name} stok türü  ${username} tarafından silindi.`,
            pushurl: `/Stocktypes`
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetStocktypes(req, res, next)
}


module.exports = {
    GetStocktypes,
    GetStocktype,
    AddStocktype,
    UpdateStocktype,
    DeleteStocktype,
}