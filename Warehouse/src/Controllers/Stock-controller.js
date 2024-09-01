const config = require("../Config")
const { types } = require("../Constants/Defines")
const messages = require("../Constants/StockMessages")
const CreateNotification = require("../Utilities/CreateNotification")
const DoGet = require("../Utilities/DoGet")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')

async function GetStocks(req, res, next) {
    try {
        const stocks = await db.stockModel.findAll()
        res.status(200).json(stocks)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetStocksByWarehouseID(req, res, next) {
    let validationErrors = []
    if (!req.params.warehouseId) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKID_REQUIRED)
    }
    if (!validator.isUUID(req.params.warehouseId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    try {
        const stocks = await db.stockModel.findAll({ where: { WarehouseID: req.params.warehouseId } })
        res.status(200).json(stocks)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetStock(req, res, next) {

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
        const stock = await db.stockModel.findOne({ where: { Uuid: req.params.stockId } });
        if (!stock) {
            return next(createNotfounderror([messages.ERROR.STOCK_NOT_FOUND], req.language))
        }
        if (!stock.Isactive) {
            return next(createNotfounderror([messages.ERROR.STOCK_NOT_ACTIVE], req.language))
        }
        res.status(200).json(stock)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function AddStock(req, res, next) {

    let validationErrors = []
    const {
        WarehouseID,
        StockdefineID,
        Type,
        Skt,
        Amount
    } = req.body

    if (!validator.isUUID(WarehouseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.WAREHOUSEID_REQUIRED)
    }
    if (!validator.isUUID(StockdefineID)) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKDEFINEID_REQUIRED)
    }
    if (!validator.isNumber(Type)) {
        validationErrors.push(messages.VALIDATION_ERROR.TYPE_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let stockuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {

        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: StockdefineID } });
        const stocktype = await db.stocktypeModel.findOne({ where: { Uuid: stockdefine?.StocktypeID } });

        if (stocktype?.Issktneed) {
            if (!validator.isString(Skt)) {
                next(createValidationError([messages.VALIDATION_ERROR.SKT_REQUIRED], req.language))
            }
        }

        await db.stockModel.create({
            ...req.body,
            Uuid: stockuuid,
            Createduser: username,
            Iscompleted: true,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await db.stockmovementModel.create({
            Uuid: uuid(),
            StockID: stockuuid,
            Amount: Amount,
            Movementdate: new Date(),
            Movementtype: 1,
            Isapproved: true,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        const unit = await DoGet(config.services.Setting, `Units/${stockdefine?.UnitID}`)

        await CreateNotification({
            type: types.Create,
            service: 'Stoklar',
            role: 'stocknotification',
            message: `${req.body.Amount} ${unit?.Name} ${stockdefine?.Name} ürünü ${username} tarafından eklendi.`,
            pushurl: '/Stocks'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetStocks(req, res, next)
}

async function AddStockWithoutMovement(req, res, next) {

    let validationErrors = []
    const {
        WarehouseID,
        StockdefineID,
        Type,
        Skt,
    } = req.body

    if (!validator.isUUID(WarehouseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.WAREHOUSEID_REQUIRED)
    }
    if (!validator.isUUID(StockdefineID)) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKDEFINEID_REQUIRED)
    }
    if (!validator.isNumber(Type)) {
        validationErrors.push(messages.VALIDATION_ERROR.TYPE_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let stockuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {

        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: StockdefineID } });
        const stocktype = await db.stocktypeModel.findOne({ where: { Uuid: stockdefine?.StocktypeID } });

        if (stocktype?.Issktneed) {
            if (!validator.isString(Skt)) {
                next(createValidationError([messages.VALIDATION_ERROR.SKT_REQUIRED], req.language))
            }
        }

        await db.stockModel.create({
            ...req.body,
            Uuid: stockuuid,
            Createduser: username,
            Iscompleted: true,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        const unit = await DoGet(config.services.Setting, `Units/${stockdefine?.UnitID}`)

        await CreateNotification({
            type: types.Create,
            service: 'Stoklar',
            role: 'stocknotification',
            message: `${req.body.Amount} ${unit?.Name} ${stockdefine?.Name} ürünü ${username} tarafından eklendi.`,
            pushurl: '/Stocks'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetStocks(req, res, next)
}

async function UpdateStock(req, res, next) {

    let validationErrors = []
    const {
        WarehouseID,
        StockdefineID,
        Type,
        Skt,
        Uuid
    } = req.body

    if (!validator.isUUID(WarehouseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.WAREHOUSEID_REQUIRED)
    }
    if (!validator.isUUID(StockdefineID)) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKDEFINEID_REQUIRED)
    }
    if (!validator.isNumber(Type)) {
        validationErrors.push(messages.VALIDATION_ERROR.TYPE_REQUIRED)
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
    const username = req?.identity?.user?.Username || 'System'

    try {

        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: StockdefineID } });
        const stocktype = await db.stocktypeModel.findOne({ where: { Uuid: stockdefine?.StocktypeID } });

        if (stocktype?.Issktneed) {
            if (!validator.isString(Skt)) {
                next(createValidationError([messages.VALIDATION_ERROR.SKT_REQUIRED], req.language))
            }
        }

        const stock = await db.stockModel.findOne({ where: { Uuid: Uuid } })
        if (!stock) {
            return next(createNotfounderror([messages.ERROR.STOCK_NOT_FOUND], req.language))
        }
        if (stock.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STOCK_NOT_ACTIVE], req.language))
        }

        await db.stockModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })


        await CreateNotification({
            type: types.Update,
            service: 'Stoklar',
            role: 'stocknotification',
            message: `${stockdefine?.Name} ${username} tarafından güncellendi.`,
            pushurl: '/Stocks'
        })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetStocks(req, res, next)
}

async function ApproveStock(req, res, next) {

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
    const username = req?.identity?.user?.Username || 'System'

    try {
        const stock = await db.stockModel.findOne({ where: { Uuid: Uuid } })
        if (!stock) {
            return next(createNotfounderror([messages.ERROR.STOCK_NOT_FOUND], req.language))
        }
        if (stock.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STOCK_NOT_ACTIVE], req.language))
        }

        await db.stockModel.update({
            ...stock,
            Isapproved: true,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: stock?.StockdefineID } });

        await CreateNotification({
            type: types.Update,
            service: 'Stoklar',
            role: 'stocknotification',
            message: `${stockdefine?.Name} ürünü  ${username} tarafından Onaylandı.`,
            pushurl: '/Stocks'
        })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetStocks(req, res, next)
}

async function ApproveStocks(req, res, next) {

    let validationErrors = []
    const body = req.body

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

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

            const stock = await db.stockModel.findOne({ where: { Uuid: data } })
            if (!stock) {
                return next(createNotfounderror([messages.ERROR.STOCK_NOT_FOUND], req.language))
            }
            if (stock.Isactive === false) {
                return next(createAccessDenied([messages.ERROR.STOCK_NOT_ACTIVE], req.language))
            }

            await db.stockModel.update({
                ...stock,
                Isapproved: true,
                Updateduser: username,
                Updatetime: new Date(),
            }, { where: { Uuid: data } }, { transaction: t })
        }

        await CreateNotification({
            type: types.Update,
            service: 'Stoklar',
            role: 'stocknotification',
            message: `${username} toplu stok güncelleme yapıldı.`,
            pushurl: '/Stocks'
        })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetStocks(req, res, next)
}

async function DeleteStock(req, res, next) {

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
    const username = req?.identity?.user?.Username || 'System'

    try {
        const stock = await db.stockModel.findOne({ where: { Uuid: req.params.stockId } });
        if (!stock) {
            return createNotfounderror([messages.ERROR.STOCK_NOT_FOUND])
        }
        if (!stock.Isactive) {
            return createNotfounderror([messages.ERROR.STOCK_NOT_ACTIVE])
        }

        await db.stockModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await db.stockmovementModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { StockID: Uuid } }, { transaction: t })

        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: stock?.Uuid } })

        await CreateNotification({
            type: types.Delete,
            service: 'Stoklar',
            role: 'stocknotification',
            message: `${stockdefine?.Name}  ${username} tarafından silindi.`,
            pushurl: '/Stocks'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetStocks(req, res, next)
}

async function DeleteStockByWarehouseID(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.warehouseId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.WAREHOUSEID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_WAREHOUSEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const stocks = await db.stockModel.findAll({ where: { WarehouseID: Uuid } });

        if ((stocks || []).length > 0) {
            for (const stock of stocks) {
                await db.stockModel.update({
                    Deleteduser: username,
                    Deletetime: new Date(),
                    Isactive: false
                }, { where: { Uuid: stock?.Uuid } }, { transaction: t })

                await db.stockmovementModel.update({
                    Deleteduser: username,
                    Deletetime: new Date(),
                    Isactive: false
                }, { where: { StockID: stock?.Uuid } }, { transaction: t })
            }
        }

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetStocks(req, res, next)
}

module.exports = {
    GetStocks,
    GetStock,
    AddStock,
    UpdateStock,
    DeleteStock,
    ApproveStock,
    ApproveStocks,
    DeleteStockByWarehouseID,
    GetStocksByWarehouseID,
    AddStockWithoutMovement
}