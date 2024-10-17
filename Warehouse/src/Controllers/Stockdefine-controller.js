const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

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
        validationErrors.push(req.t('Stockdefines.Error.StockdefineIDRequired'))
    }
    if (!validator.isUUID(req.params.stockdefineId)) {
        validationErrors.push(req.t('Stockdefines.Error.UnsupportedStockdefineID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stockdefines'), req.language))
    }

    try {
        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: req.params.stockdefineId } });
        if (!stockdefine) {
            return next(createNotFoundError(req.t('Stockdefines.Error.NotFound'), req.t('Stockdefines'), req.language))
        }
        if (!stockdefine.Isactive) {
            return next(createNotFoundError(req.t('Stockdefines.Error.NotFound'), req.t('Stockdefines'), req.language))
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
        validationErrors.push(req.t('Stockdefines.Error.NameRequired'))
    }
    if (!validator.isUUID(UnitID)) {
        validationErrors.push(req.t('Stockdefines.Error.UnitIDRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stockdefines'), req.language))
    }

    let stockdefineuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {

        const stocktype = await db.stocktypeModel.findOne({ where: { Uuid: StocktypeID } });

        if (stocktype?.Isbarcodeneed) {
            if (!validator.isString(Barcode)) {
                return next(createValidationError(req.t('Stockdefines.Error.BarcodeRequired'), req.t('Stockdefines'), req.language))
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
            service: req.t('Stockdefines'),
            role: 'stockdefinenotification',
            message: {
                tr: `${Name} Ürünü Tanımı ${username} Tarafından Eklendi.`,
                en: `${Name} Stockdefine Created By ${username}.`,
            }[req.language],
            pushurl: '/Stockdefines'
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
        validationErrors.push(req.t('Stockdefines.Error.NameRequired'))
    }
    if (!validator.isUUID(UnitID)) {
        validationErrors.push(req.t('Stockdefines.Error.UnitIDRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Stockdefines.Error.StockdefineIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Stockdefines.Error.UnsupportedStockdefineID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stockdefines'), req.language))
    }
    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const stocktype = await db.stocktypeModel.findOne({ where: { Uuid: StocktypeID } });

        if (stocktype?.Isbarcodeneed) {
            if (!validator.isString(Barcode)) {
                return next(createValidationError(req.t('Stockdefines.Error.BarcodeRequired'), req.t('Stockdefines'), req.language))
            }
        }

        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: Uuid } })
        if (!stockdefine) {
            return next(createNotFoundError(req.t('Stockdefines.Error.NotFound'), req.t('Stockdefines'), req.language))
        }
        if (!stockdefine.Isactive) {
            return next(createNotFoundError(req.t('Stockdefines.Error.NotFound'), req.t('Stockdefines'), req.language))
        }

        await db.stockdefineModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Stockdefines'),
            role: 'stockdefinenotification',
            message: {
                tr: `${Name} Ürünü Tanımı ${username} Tarafından Güncellendi.`,
                en: `${Name} Stockdefine Updated By ${username}.`,
            }[req.language],
            pushurl: '/Stockdefines'
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
        validationErrors.push(req.t('Stockdefines.Error.StockdefineIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Stockdefines.Error.UnsupportedStockdefineID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stockdefines'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: Uuid } })
        if (!stockdefine) {
            return next(createNotFoundError(req.t('Stockdefines.Error.NotFound'), req.t('Stockdefines'), req.language))
        }
        if (!stockdefine.Isactive) {
            return next(createNotFoundError(req.t('Stockdefines.Error.NotFound'), req.t('Stockdefines'), req.language))
        }

        await db.stockdefineModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Stockdefines'),
            role: 'stockdefinenotification',
            message: {
                tr: `${stockdefine?.Name} Ürünü Tanımı ${username} Tarafından Silindi.`,
                en: `${stockdefine?.Name} Stockdefine Deleted By ${username}.`,
            }[req.language],
            pushurl: '/Stockdefines'
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
