const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

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
        validationErrors.push(req.t('Stocktypes.Error.StocktypeIDRequired'))
    }
    if (!validator.isUUID(req.params.stocktypeId)) {
        validationErrors.push(req.t('Stocktypes.Error.UnsupportedStocktypeID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stocktypes'), req.language))
    }

    try {
        const stocktype = await db.stocktypeModel.findOne({ where: { Uuid: req.params.stocktypeId } });
        if (!stocktype) {
            return next(createNotFoundError(req.t('Stocktypes.Error.NotFound'), req.t('Stocktypes'), req.language))
        }
        if (!stocktype.Isactive) {
            return next(createNotFoundError(req.t('Stocktypes.Error.NotFound'), req.t('Stocktypes'), req.language))
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
        validationErrors.push(req.t('Stocktypes.Error.NameRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stocktypes'), req.language))
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
            service: req.t('Stocktypes'),
            role: 'stocktypenotification',
            message: {
                tr: `${Name} Stok Türü ${username} Tarafından Eklendi.`,
                en: `${Name} Stock Type Created By ${username}.`,
            }[req.language],
            pushurl: '/Stocktypes'
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
        validationErrors.push(req.t('Stocktypes.Error.NameRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Stocktypes.Error.StocktypeIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Stocktypes.Error.UnsupportedStocktypeID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stocktypes'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const stocktype = await db.stocktypeModel.findOne({ where: { Uuid: Uuid } })
        if (!stocktype) {
            return next(createNotFoundError(req.t('Stocktypes.Error.NotFound'), req.t('Stocktypes'), req.language))
        }
        if (!stocktype.Isactive) {
            return next(createNotFoundError(req.t('Stocktypes.Error.NotFound'), req.t('Stocktypes'), req.language))
        }

        await db.stocktypeModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })


        await CreateNotification({
            type: types.Update,
            service: req.t('Stocktypes'),
            role: 'stocktypenotification',
            message: {
                tr: `${Name} Stok Türü ${username} Tarafından Güncellendi.`,
                en: `${Name} Stock Type Updated By ${username}.`,
            }[req.language],
            pushurl: '/Stocktypes'
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
        validationErrors.push(req.t('Stocktypes.Error.StocktypeIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Stocktypes.Error.UnsupportedStocktypeID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stocktypes'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const stocktype = await db.stocktypeModel.findOne({ where: { Uuid: Uuid } })
        if (!stocktype) {
            return next(createNotFoundError(req.t('Stocktypes.Error.NotFound'), req.t('Stocktypes'), req.language))
        }
        if (!stocktype.Isactive) {
            return next(createNotFoundError(req.t('Stocktypes.Error.NotFound'), req.t('Stocktypes'), req.language))
        }

        await db.stocktypeModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Stocktypes'),
            role: 'stocktypenotification',
            message: {
                tr: `${stocktype?.Name} Stok Türü ${username} Tarafından Silindi.`,
                en: `${stocktype?.Name} Stock Type Deleted By ${username}.`,
            }[req.language],
            pushurl: '/Stocktypes'
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