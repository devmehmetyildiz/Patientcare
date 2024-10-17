const config = require("../Config")
const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const DoGet = require("../Utilities/DoGet")
const { sequelizeErrorCatcher, } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetStockmovements(req, res, next) {
    try {
        const stockmovements = await db.stockmovementModel.findAll()
        res.status(200).json(stockmovements)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetStockmovement(req, res, next) {

    let validationErrors = []
    if (!req.params.stockmovementId) {
        validationErrors.push(req.t('Stockmovements.Error.StockmovementIDRequired'))
    }
    if (!validator.isUUID(req.params.stockmovementId)) {
        validationErrors.push(req.t('Stockmovements.Error.UnsupportedStockmovementID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stockmovements'), req.language))
    }

    try {
        const stockmovement = await db.stockmovementModel.findOne({ where: { Uuid: req.params.stockmovementId } });
        if (!stockmovement) {
            return next(createNotFoundError(req.t('Stockmovements.Error.NotFound'), req.t('Stockdefines'), req.language))
        }
        if (!stockmovement.Isactive) {
            return next(createNotFoundError(req.t('Stockmovements.Error.NotActive'), req.t('Stockdefines'), req.language))
        }
        res.status(200).json(stockmovement)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddStockmovement(req, res, next) {

    let validationErrors = []
    const {
        StockID,
        Movementtype,
        Amount,
        Movementdate,
        Approved
    } = req.body

    if (!validator.isUUID(StockID)) {
        validationErrors.push(req.t('Stockmovements.Error.StockIDRequired'))
    }
    if (!validator.isNumber(Movementtype)) {
        validationErrors.push(req.t('Stockmovements.Error.MovementtypeRequired'))
    }
    if (!validator.isNumber(Amount)) {
        validationErrors.push(req.t('Stockmovements.Error.AmountRequired'))
    }
    if (!validator.isISODate(Movementdate)) {
        validationErrors.push(req.t('Stockmovements.Error.MovementdateRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stockmovements'), req.language))
    }

    let stockmovementuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        let amount = 0.0;
        let movements = await db.stockmovementModel.findAll({ where: { StockID: StockID, Isactive: true, Isapproved: true } })
        movements.forEach(movement => {
            amount += (movement.Amount * movement.Movementtype);
        });

        if (Movementtype === -1 && Amount > amount) {
            return next(createValidationError(req.t('Stockmovements.Error.AmountlimitRequired'), req.t('Stockmovements'), req.language))
        }

        await db.stockmovementModel.create({
            ...req.body,
            Uuid: stockmovementuuid,
            Isapproved: Approved ? Approved : false,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })


        const stock = await db.stockModel.findOne({ where: { Uuid: StockID } });
        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: stock?.StockdefineID } });
        const unit = await DoGet(config.services.Setting, `Units/${stockdefine?.UnitID}`)

        await CreateNotification({
            type: types.Create,
            service: req.t('Stockmovements'),
            role: 'stockmovementnotification',
            message: {
                tr: `${Amount} ${unit?.Name} ${stockdefine?.Name} Ürünü  ${username} Tarafından Eklendi.`,
                en: `${Amount} ${unit?.Name} ${stockdefine?.Name} Stock  Created By ${username}.`,
            }[req.language],
            pushurl: '/Stockmovements'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetStockmovements(req, res, next)
}

async function AddStockmovements(req, res, next) {

    let validationErrors = []

    const {
        Stockmovements
    } = req.body

    if (!validator.isArray(Stockmovements)) {
        validationErrors.push(req.t('Stockmovements.Error.StockmovementsRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stockmovements'), req.language))
    }

    for (const movement of Stockmovements) {
        const {
            StockID,
            Movementtype,
            Amount,
            Movementdate,
        } = movement

        if (!validator.isUUID(StockID)) {
            validationErrors.push(req.t('Stockmovements.Error.StockIDRequired'))
        }
        if (!validator.isNumber(Movementtype)) {
            validationErrors.push(req.t('Stockmovements.Error.MovementtypeRequired'))
        }
        if (!validator.isNumber(Amount)) {
            validationErrors.push(req.t('Stockmovements.Error.AmountRequired'))
        }
        if (!validator.isISODate(Movementdate)) {
            validationErrors.push(req.t('Stockmovements.Error.MovementdateRequired'))
        }
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stockmovements'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        for (const movement of Stockmovements) {
            const {
                StockID,
            } = movement

            let stockmovementuuid = uuid()
            let amount = 0.0;
            let movements = await db.stockmovementModel.findAll({ where: { StockID: StockID, Isactive: true } })
            movements.forEach(movement => {
                amount += (movement.Amount * movement.Movementtype);
            });
            await db.stockmovementModel.create({
                ...movement,
                Uuid: stockmovementuuid,
                Isapproved: false,
                Createduser: username,
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })

        }

        await CreateNotification({
            type: types.Create,
            service: req.t('Stockmovements'),
            role: 'stockmovementnotification',
            message: {
                tr: `Toplu Stok Hareket Eklemesi  ${username} Tarafından Yapıldı.`,
                en: `Total Stock Movement Created By ${username}.`,
            }[req.language],
            pushurl: '/Stockmovements'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetStockmovements(req, res, next)
}

async function UpdateStockmovement(req, res, next) {

    let validationErrors = []
    const {
        StockID,
        Movementtype,
        Amount,
        Movementdate,
        Uuid
    } = req.body

    if (!validator.isUUID(StockID)) {
        validationErrors.push(req.t('Stockmovements.Error.StockIDRequired'))
    }
    if (!validator.isNumber(Movementtype)) {
        validationErrors.push(req.t('Stockmovements.Error.MovementtypeRequired'))
    }
    if (!validator.isNumber(Amount)) {
        validationErrors.push(req.t('Stockmovements.Error.AmountRequired'))
    }
    if (!validator.isISODate(Movementdate)) {
        validationErrors.push(req.t('Stockmovements.Error.MovementdateRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Stockmovements.Error.StockmovementIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Stockmovements.Error.UnsupportedStockmovementID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stockmovements'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const stockmovement = await db.stockmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!stockmovement) {
            return next(createNotFoundError(req.t('Stockmovements.Error.NotFound'), req.t('Stockdefines'), req.language))
        }
        if (!stockmovement.Isactive) {
            return next(createNotFoundError(req.t('Stockmovements.Error.NotActive'), req.t('Stockdefines'), req.language))
        }

        await db.stockmovementModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        const stock = await db.stockModel.findOne({ where: { Uuid: StockID } });
        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: stock?.StockdefineID } });

        await CreateNotification({
            type: types.Update,
            service: req.t('Stockmovements'),
            role: 'stockmovementnotification',
            message: {
                tr: `${stockdefine?.Name} Ürünü Ait Stok Hareketi ${username} Tarafından Güncellendi.`,
                en: `${stockdefine?.Name}'s Stock Movement Updated By ${username}.`,
            }[req.language],
            pushurl: '/Stockmovements'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetStockmovements(req, res, next)
}

async function ApproveStockmovement(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.stockmovementId

    if (!Uuid) {
        validationErrors.push(req.t('Stockmovements.Error.StockmovementIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Stockmovements.Error.UnsupportedStockmovementID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stockmovements'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const stockmovement = await db.stockmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!stockmovement) {
            return next(createNotFoundError(req.t('Stockmovements.Error.NotFound'), req.t('Stockdefines'), req.language))
        }
        if (!stockmovement.Isactive) {
            return next(createNotFoundError(req.t('Stockmovements.Error.NotActive'), req.t('Stockdefines'), req.language))
        }

        await db.stockmovementModel.update({
            ...stockmovement,
            Isapproved: true,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        const stock = await db.stockModel.findOne({ where: { Uuid: stockmovement?.StockID } });
        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: stock?.StockdefineID } });

        await CreateNotification({
            type: types.Update,
            service: req.t('Stockmovements'),
            role: 'stockmovementnotification',
            message: {
                tr: `${stockdefine?.Name} Ürünü Ait Stok Hareketi ${username} Tarafından Onaylandı.`,
                en: `${stockdefine?.Name}'s Stock Movement Approved By ${username}.`,
            }[req.language],
            pushurl: '/Stockmovements'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetStockmovements(req, res, next)
}

async function ApproveStockmovements(req, res, next) {

    let validationErrors = []
    const body = req.body

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        for (const data of (body || [])) {
            if (!data) {
                validationErrors.push(req.t('Stockmovements.Error.StockmovementIDRequired'))
            }
            if (!validator.isUUID(data)) {
                validationErrors.push(req.t('Stockmovements.Error.UnsupportedStockmovementID'))
            }
            if (validationErrors.length > 0) {
                return next(createValidationError(validationErrors, req.t('Stockmovements'), req.language))
            }

            const stockmovement = await db.stockmovementModel.findOne({ where: { Uuid: data } })
            if (!stockmovement) {
                return next(createNotFoundError(req.t('Stockmovements.Error.NotFound'), req.t('Stockdefines'), req.language))
            }
            if (!stockmovement.Isactive) {
                return next(createNotFoundError(req.t('Stockmovements.Error.NotActive'), req.t('Stockdefines'), req.language))
            }

            await db.stockmovementModel.update({
                ...stockmovement,
                Isapproved: true,
                Updateduser: username,
                Updatetime: new Date(),
            }, { where: { Uuid: data }, transaction: t })
        }

        await CreateNotification({
            type: types.Update,
            service: req.t('Stockmovements'),
            role: 'stockmovementnotification',
            message: {
                tr: `Toplu Stok Hareketleri ${username} Tarafından Onaylandı.`,
                en: `Total Stock Movements Approved By ${username}.`,
            }[req.language],
            pushurl: '/Stockmovements'
        })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetStockmovements(req, res, next)
}

async function DeleteStockmovement(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.stockmovementId

    if (!Uuid) {
        validationErrors.push(req.t('Stockmovements.Error.StockmovementIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Stockmovements.Error.UnsupportedStockmovementID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stockmovements'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const stockmovement = await db.stockmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!stockmovement) {
            return next(createNotFoundError(req.t('Stockmovements.Error.NotFound'), req.t('Stockdefines'), req.language))
        }
        if (!stockmovement.Isactive) {
            return next(createNotFoundError(req.t('Stockmovements.Error.NotActive'), req.t('Stockdefines'), req.language))
        }

        await db.stockmovementModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        const stock = await db.stockModel.findOne({ where: { Uuid: stockmovement?.StockID } });
        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: stock?.StockdefineID } });

        await CreateNotification({
            type: types.Delete,
            service: req.t('Stockmovements'),
            role: 'stockmovementnotification',
            message: {
                tr: `${stockdefine?.Name} Ürünü Ait Stok Hareketi ${username} Tarafından Silindi.`,
                en: `${stockdefine?.Name}'s Stock Movement Deleted By ${username}.`,
            }[req.language],
            pushurl: '/Stockmovements'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetStockmovements(req, res, next)
}


module.exports = {
    GetStockmovements,
    GetStockmovement,
    AddStockmovement,
    UpdateStockmovement,
    DeleteStockmovement,
    ApproveStockmovement,
    ApproveStockmovements,
    AddStockmovements
}