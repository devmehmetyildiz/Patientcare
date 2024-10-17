const config = require("../Config")
const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const DoGet = require("../Utilities/DoGet")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

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
        validationErrors.push(req.t('Stocks.Error.WarehouseIDRequired'))
    }
    if (!validator.isUUID(req.params.warehouseId)) {
        validationErrors.push(req.t('Stocks.Error.UnsupportedWarehouseID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stocks'), req.language))
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
        validationErrors.push(req.t('Stocks.Error.StockIDRequired'))
    }
    if (!validator.isUUID(req.params.stockId)) {
        validationErrors.push(req.t('Stocks.Error.UnsupportedStockID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stocks'), req.language))
    }

    try {
        const stock = await db.stockModel.findOne({ where: { Uuid: req.params.stockId } });
        if (!stock) {
            return next(createNotFoundError(req.t('Stocks.Error.NotFound'), req.t('Stocks'), req.language))
        }
        if (!stock.Isactive) {
            return next(createNotFoundError(req.t('Stocks.Error.NotActive'), req.t('Stocks'), req.language))
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
        validationErrors.push(req.t('Stocks.Error.WarehouseIDRequired'))
    }
    if (!validator.isUUID(StockdefineID)) {
        validationErrors.push(req.t('Stocks.Error.StockdefineIDRequired'))
    }
    if (!validator.isNumber(Type)) {
        validationErrors.push(req.t('Stocks.Error.TypeRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stocks'), req.language))
    }

    let stockuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {

        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: StockdefineID } });
        const stocktype = await db.stocktypeModel.findOne({ where: { Uuid: stockdefine?.StocktypeID } });

        if (stocktype?.Issktneed) {
            if (!validator.isString(Skt)) {
                return next(createValidationError(req.t('Stocks.Error.SktRequired'), req.t('Stocks'), req.language))
            }
        }

        await db.stockModel.create({
            ...req.body,
            Uuid: stockuuid,
            Createduser: username,
            Isapproved: true,
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
            Isapproved: false,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        const unit = await DoGet(config.services.Setting, `Units/${stockdefine?.UnitID}`)

        await CreateNotification({
            type: types.Create,
            service: req.t('Stocks'),
            role: 'stocknotification',
            message: {
                tr: `${req.body.Amount} ${unit?.Name} ${stockdefine?.Name} Ürünü ${username} Tarafından Eklendi.`,
                en: `${req.body.Amount} ${unit?.Name} ${stockdefine?.Name} Product Created By ${username}.`,
            }[req.language],
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
        validationErrors.push(req.t('Stocks.Error.WarehouseIDRequired'))
    }
    if (!validator.isUUID(StockdefineID)) {
        validationErrors.push(req.t('Stocks.Error.StockdefineIDRequired'))
    }
    if (!validator.isNumber(Type)) {
        validationErrors.push(req.t('Stocks.Error.TypeRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stocks'), req.language))
    }

    let stockuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {

        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: StockdefineID } });
        const stocktype = await db.stocktypeModel.findOne({ where: { Uuid: stockdefine?.StocktypeID } });

        if (stocktype?.Issktneed) {
            if (!validator.isString(Skt)) {
                return next(createValidationError(req.t('Stocks.Error.SktRequired'), req.t('Stocks'), req.language))
            }
        }

        await db.stockModel.create({
            ...req.body,
            Uuid: stockuuid,
            Createduser: username,
            Isapproved: true,
            Iscompleted: true,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        const unit = await DoGet(config.services.Setting, `Units/${stockdefine?.UnitID}`)

        await CreateNotification({
            type: types.Create,
            service: req.t('Stocks'),
            role: 'stocknotification',
            message: {
                tr: `${req.body.Amount} ${unit?.Name} ${stockdefine?.Name} Ürünü ${username} Tarafından Eklendi.`,
                en: `${req.body.Amount} ${unit?.Name} ${stockdefine?.Name} Product Created By ${username}.`,
            }[req.language],
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
        validationErrors.push(req.t('Stocks.Error.WarehouseIDRequired'))
    }
    if (!validator.isUUID(StockdefineID)) {
        validationErrors.push(req.t('Stocks.Error.StockdefineIDRequired'))
    }
    if (!validator.isNumber(Type)) {
        validationErrors.push(req.t('Stocks.Error.TypeRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Stocks.Error.StockIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Stocks.Error.UnsupportedStockID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stocks'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {

        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: StockdefineID } });
        const stocktype = await db.stocktypeModel.findOne({ where: { Uuid: stockdefine?.StocktypeID } });

        if (stocktype?.Issktneed) {
            if (!validator.isString(Skt)) {
                return next(createValidationError(req.t('Stocks.Error.SktRequired'), req.t('Stocks'), req.language))
            }
        }

        const stock = await db.stockModel.findOne({ where: { Uuid: Uuid } })
        if (!stock) {
            return next(createNotFoundError(req.t('Stocks.Error.NotFound'), req.t('Stocks'), req.language))
        }
        if (!stock.Isactive) {
            return next(createNotFoundError(req.t('Stocks.Error.NotActive'), req.t('Stocks'), req.language))
        }

        await db.stockModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })


        await CreateNotification({
            type: types.Update,
            service: req.t('Stocks'),
            role: 'stocknotification',
            message: {
                tr: `${stockdefine?.Name} Ürünü ${username} tarafından Güncellendi.`,
                en: `${stockdefine?.Name} Stock Updated By ${username}.`,
            }[req.language],
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
        validationErrors.push(req.t('Stocks.Error.StockIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Stocks.Error.UnsupportedStockID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stocks'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const stock = await db.stockModel.findOne({ where: { Uuid: Uuid } })
        if (!stock) {
            return next(createNotFoundError(req.t('Stocks.Error.NotFound'), req.t('Stocks'), req.language))
        }
        if (!stock.Isactive) {
            return next(createNotFoundError(req.t('Stocks.Error.NotActive'), req.t('Stocks'), req.language))
        }

        await db.stockModel.update({
            ...stock,
            Isapproved: true,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: stock?.StockdefineID } });

        await CreateNotification({
            type: types.Update,
            service: req.t('Stocks'),
            role: 'stocknotification',
            message: {
                tr: `${stockdefine?.Name} Ürünü ${username} tarafından Onaylandı.`,
                en: `${stockdefine?.Name} Stock Approved By ${username}.`,
            }[req.language],
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
                validationErrors.push(req.t('Stocks.Error.StockIDRequired'))
            }
            if (!validator.isUUID(data)) {
                validationErrors.push(req.t('Stocks.Error.UnsupportedStockID'))
            }
            if (validationErrors.length > 0) {
                return next(createValidationError(validationErrors, req.t('Stocks'), req.language))
            }

            const stock = await db.stockModel.findOne({ where: { Uuid: data } })
            if (!stock) {
                return next(createNotFoundError(req.t('Stocks.Error.NotFound'), req.t('Stocks'), req.language))
            }
            if (!stock.Isactive) {
                return next(createNotFoundError(req.t('Stocks.Error.NotActive'), req.t('Stocks'), req.language))
            }

            await db.stockModel.update({
                ...stock,
                Isapproved: true,
                Updateduser: username,
                Updatetime: new Date(),
            }, { where: { Uuid: data }, transaction: t })
        }

        await CreateNotification({
            type: types.Update,
            service: req.t('Stocks'),
            role: 'stocknotification',
            message: {
                tr: `Toplu Ürün Onaylaması ${username} tarafından Yapıldı.`,
                en: `Total Stock Approved By ${username}.`,
            }[req.language],
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
        validationErrors.push(req.t('Stocks.Error.StockIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Stocks.Error.UnsupportedStockID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stocks'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const stock = await db.stockModel.findOne({ where: { Uuid: req.params.stockId } });
        if (!stock) {
            return next(createNotFoundError(req.t('Stocks.Error.NotFound'), req.t('Stocks'), req.language))
        }
        if (!stock.Isactive) {
            return next(createNotFoundError(req.t('Stocks.Error.NotActive'), req.t('Stocks'), req.language))
        }

        await db.stockModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.stockmovementModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { StockID: Uuid }, transaction: t })

        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: stock?.Uuid } })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Stocks'),
            role: 'stocknotification',
            message: {
                tr: `${stockdefine?.Name} Ürünü ${username} tarafından Silindi.`,
                en: `${stockdefine?.Name} Stock Deleted By ${username}.`,
            }[req.language],
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
        validationErrors.push(req.t('Stocks.Error.WarehouseIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Stocks.Error.UnsupportedWarehouseID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stocks'), req.language))
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
                }, { where: { Uuid: stock?.Uuid }, transaction: t })

                await db.stockmovementModel.update({
                    Deleteduser: username,
                    Deletetime: new Date(),
                    Isactive: false
                }, { where: { StockID: stock?.Uuid }, transaction: t })
            }
        }

        await t.commit();

        const warehouse = await db.warehouseModel.findOne({ where: { Uuid: Uuid } })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Stocks'),
            role: 'stocknotification',
            message: {
                tr: `${warehouse?.Name} Ambarına Ait Ürünler ${username} tarafından Silindi.`,
                en: `${warehouse?.Name} Warehouse Stocks Deleted By ${username}.`,
            }[req.language],
            pushurl: '/Stocks'
        })

    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetStocks(req, res, next)
}

async function CreateStockFromStock(req, res, next) {

    let validationErrors = []
    const {
        ParentID,
        Stocks,
        Type
    } = req.body

    if (!validator.isUUID(ParentID)) {
        validationErrors.push(req.t('Stocks.Error.ParentIDRequired'))
    }
    if (!validator.isArray(Stocks)) {
        validationErrors.push(req.t('Stocks.Error.StocksRequired'))
    }
    if (!validator.isNumber(Type)) {
        validationErrors.push(req.t('Stocks.Error.TypeRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stocks'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {

        for (const stock of Stocks) {

            const sourcestock = await db.stockModel.findOne({ where: { Uuid: stock?.Uuid } });

            let amount = 0.0;
            let fullamount = 0.0;
            const movements = await db.stockmovementModel.findAll({ where: { StockID: sourcestock?.Uuid, Isactive: true } });
            movements.forEach(movement => {
                if (movement?.Isapproved) {
                    amount += (movement.Amount * movement.Movementtype);
                }
                fullamount += (movement.Amount * movement.Movementtype);
            });

            if (stock?.Value > amount) {
                return next(createValidationError(req.t('Stocks.Error.AmountlimitRequired'), req.t('Stocks'), req.language))
            } else {

                let stockuuid = uuid()
                await db.stockModel.create({
                    Type: Type,
                    StocktypeID: sourcestock?.StocktypeID,
                    StockgrouptypeID: sourcestock?.StockgrouptypeID,
                    StockdefineID: sourcestock?.StockdefineID,
                    Isapproved: true,
                    Skt: sourcestock?.Skt,
                    Info: sourcestock?.Info,
                    WarehouseID: ParentID,
                    Amount: 0,
                    Uuid: stockuuid,
                    Createduser: username,
                    Iscompleted: false,
                    Createtime: new Date(),
                    Isactive: true
                }, { transaction: t })

                await db.stockmovementModel.create({
                    Uuid: uuid(),
                    StockID: stockuuid,
                    Amount: stock?.Value,
                    Movementdate: new Date(),
                    Movementtype: 1,
                    Isapproved: false,
                    Createduser: username,
                    Createtime: new Date(),
                    Isactive: true
                }, { transaction: t })

                await db.stockmovementModel.create({
                    Uuid: uuid(),
                    StockID: sourcestock?.Uuid,
                    Amount: stock?.Value,
                    Movementdate: new Date(),
                    Movementtype: -1,
                    Isapproved: false,
                    Createduser: username,
                    Createtime: new Date(),
                    Isactive: true
                }, { transaction: t })
            }
        }

        await t.commit()

        await CreateNotification({
            type: types.Create,
            service: req.t('Stocks'),
            role: 'stocknotification',
            message: {
                tr: `Stok Transfer İşlemi ${username} tarafından Gerçekleştirildi.`,
                en: `Stocks Transfer Created By ${username}.`,
            }[req.language],
            pushurl: '/Stocks'
        })

    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
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
    AddStockWithoutMovement,
    CreateStockFromStock
}
