const config = require("../Config")
const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const DoGet = require("../Utilities/DoGet")
const { sequelizeErrorCatcher, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')

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
        validationErrors.push(messages.VALIDATION_ERROR.STOCKMOVEMENTID_REQUIRED)
    }
    if (!validator.isUUID(req.params.stockmovementId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKMOVEMENTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const stockmovement = await db.stockmovementModel.findOne({ where: { Uuid: req.params.stockmovementId } });
        if (!stockmovement) {
            return next(createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language))
        }
        if (!stockmovement.Isactive) {
            return next(createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language))
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
        validationErrors.push(messages.VALIDATION_ERROR.STOCKID_REQUIRED)
    }
    if (!validator.isNumber(Movementtype)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTTYPE_REQUIRED)
    }
    if (!validator.isNumber(Amount)) {
        validationErrors.push(messages.VALIDATION_ERROR.AMOUNT_REQUIRED)
    }
    if (!validator.isISODate(Movementdate)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTDATE_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
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
            return next(createValidationError([messages.VALIDATION_ERROR.AMOUNT_LIMIT_ERROR], req.language))
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
            service: 'Stok Hareketleri',
            role: 'stockmovementnotification',
            message: `${Amount} ${unit?.Name} ${stockdefine?.Name} ürünü  ${username} tarafından eklendi.`,
            pushurl: `/Stockmovements`
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
        validationErrors.push(messages.VALIDATION_ERROR.STOCKMOVEMENTS_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    for (const movement of Stockmovements) {
        const {
            StockID,
            Movementtype,
            Amount,
            Movementdate,
        } = movement

        if (!validator.isUUID(StockID)) {
            validationErrors.push(messages.VALIDATION_ERROR.STOCKID_REQUIRED)
        }
        if (!validator.isNumber(Movementtype)) {
            validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTTYPE_REQUIRED)
        }
        if (!validator.isNumber(Amount)) {
            validationErrors.push(messages.VALIDATION_ERROR.AMOUNT_REQUIRED)
        }
        if (!validator.isISODate(Movementdate)) {
            validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTDATE_REQUIRED)
        }
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
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
            service: 'Stok Hareketleri',
            role: 'stockmovementnotification',
            message: `Stok hareketleri ${username} tarafından eklendi.`,
            pushurl: `/Stockmovements`
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
        validationErrors.push(messages.VALIDATION_ERROR.STOCKID_REQUIRED)
    }
    if (!validator.isNumber(Movementtype)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTTYPE_REQUIRED)
    }
    if (!validator.isNumber(Amount)) {
        validationErrors.push(messages.VALIDATION_ERROR.AMOUNT_REQUIRED)
    }
    if (!validator.isISODate(Movementdate)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTDATE_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKMOVEMENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKMOVEMENTID)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const stockmovement = await db.stockmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!stockmovement) {
            return next(createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_FOUND], req.language))
        }
        if (stockmovement.Isactive === false) {
            return next(createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language))
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
            service: 'Stok Hareketleri',
            role: 'stockmovementnotification',
            message: `${stockdefine?.Name} ürüne ait hareket  ${username} tarafından Güncellendi.`,
            pushurl: `/Stockmovements`
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
        validationErrors.push(messages.VALIDATION_ERROR.STOCKMOVEMENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKMOVEMENTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const stockmovement = await db.stockmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!stockmovement) {
            return next(createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_FOUND], req.language))
        }
        if (stockmovement.Isactive === false) {
            return next(createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language))
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
            service: 'Stok Hareketleri',
            role: 'stockmovementnotification',
            message: `${stockdefine?.Name} ürününe ait hareket ${username} tarafından onaylandı.`,
            pushurl: `/Stockmovements`
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
                validationErrors.push(messages.VALIDATION_ERROR.STOCKMOVEMENTID_REQUIRED)
            }
            if (!validator.isUUID(data)) {
                validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKMOVEMENTID)
            }
            if (validationErrors.length > 0) {
                return next(createValidationError(validationErrors, req.language))
            }
            const stockmovement = await db.stockmovementModel.findOne({ where: { Uuid: data } })
            if (!stockmovement) {
                return next(createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_FOUND], req.language))
            }
            if (stockmovement.Isactive === false) {
                return next(createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language))
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
            service: 'Stok Hareketleri',
            role: 'stockmovementnotification',
            message: `Toplu Stok hareketi  ${username} tarafından onaylandı.`,
            pushurl: `/Stockmovements`
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
        validationErrors.push(messages.VALIDATION_ERROR.STOCKMOVEMENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKMOVEMENTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const stockmovement = await db.stockmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!stockmovement) {
            return next(createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_FOUND], req.language))
        }
        if (stockmovement.Isactive === false) {
            return next(createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language))
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
            service: 'Stok Hareketleri',
            role: 'stockmovementnotification',
            message: `${stockdefine?.Name} ürününe ait hareket  ${username} tarafından silindif.`,
            pushurl: `/Stockmovements`
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

const messages = {
    ERROR: {
        STOCKMOVEMENT_NOT_FOUND: {
            code: 'STOCKMOVEMENT_NOT_FOUND', description: {
                en: 'Stockmovement not found',
                tr: 'Stok hareketi bulunamadı',
            }
        },
        STOCKMOVEMENT_NOT_ACTIVE: {
            code: 'STOCKMOVEMENT_NOT_ACTIVE', description: {
                en: 'Stockmovement not active',
                tr: 'Stok hareketi aktif değil',
            }
        },
    },
    VALIDATION_ERROR: {
        STOCKMOVEMENTS_REQUIRED: {
            code: 'STOCKMOVEMENTS_REQUIRED', description: {
                en: 'The stock movements required',
                tr: 'Bu işlem için stok hareketleri gerekli',
            }
        },
        NAME_REQUIRED: {
            code: 'NAME_REQUIRED', description: {
                en: 'The name required',
                tr: 'Bu işlem için isim gerekli',
            }
        },
        DESCIRIPTION_REQUIRED: {
            code: 'DESCIRIPTION_REQUIRED', description: {
                en: 'The description required',
                tr: 'Bu işlem için açıklama gerekli',
            }
        },
        MOVEMENTTYPE_REQUIRED: {
            code: 'MOVEMENTTYPE_REQUIRED', description: {
                en: 'The movement type required',
                tr: 'Bu işlem için hareket tipi gerekli',
            }
        },
        AMOUNT_REQUIRED: {
            code: 'AMOUNT_REQUIRED', description: {
                en: 'The amount required',
                tr: 'Bu işlem için miktar gerekli',
            }
        },
        AMOUNT_LIMIT_ERROR: {
            code: 'AMOUNT_LIMIT_ERROR', description: {
                en: 'The amount is too low',
                tr: 'Bu işlem yeterli ürün yok',
            }
        },
        MOVEMENTDATE_REQUIRED: {
            code: 'MOVEMENTDATE_REQUIRED', description: {
                en: 'The movement date required',
                tr: 'Bu işlem için hareket tarihi gerekli',
            }
        },
        STOCKID_REQUIRED: {
            code: 'STOCKID_REQUIRED', description: {
                en: 'The stockid required',
                tr: 'Bu işlem için stockid gerekli',
            }
        },
        STOCKMOVEMENTID_REQUIRED: {
            code: 'STOCKMOVEMENTID_REQUIRED', description: {
                en: 'The stockmovementid required',
                tr: 'Bu işlem için stockmovementid gerekli',
            }
        },
        UNSUPPORTED_STOCKMOVEMENTID: {
            code: 'UNSUPPORTED_STOCKMOVEMENTID', description: {
                en: 'The stockmovementid is unsupported',
                tr: 'Geçersiz stockmovementid',
            }
        },
    }

}
