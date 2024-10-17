const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetStocktypegroups(req, res, next) {
    try {
        const stocktypegroups = await db.stocktypegroupModel.findAll()
        res.status(200).json(stocktypegroups)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetStocktypegroup(req, res, next) {

    let validationErrors = []
    if (!req.params.stocktypegroupId) {
        validationErrors.push(req.t('Stocktypegroups.Error.StocktypegroupIDRequired'))
    }
    if (!validator.isUUID(req.params.stocktypegroupId)) {
        validationErrors.push(req.t('Stocktypegroups.Error.UnsupportedStocktypegroupID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stocktypegroups'), req.language))
    }

    try {
        const stocktypegroup = await db.stocktypegroupModel.findOne({ where: { Uuid: req.params.stocktypegroupId } });
        if (!stocktypegroup) {
            return next(createNotFoundError(req.t('Stocktypegroups.Error.NotFound'), req.t('Stocktypegroups'), req.language))
        }
        if (!stocktypegroup.Isactive) {
            return next(createNotFoundError(req.t('Stocktypegroups.Error.NotActive'), req.t('Stocktypegroups'), req.language))
        }
        res.status(200).json(stocktypegroup)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddStocktypegroup(req, res, next) {

    let validationErrors = []
    const {
        Name,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Stocktypegroups.Error.NameRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stocktypegroups'), req.language))
    }

    let stocktypegroupuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.stocktypegroupModel.create({
            ...req.body,
            Uuid: stocktypegroupuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: req.t('Stocktypegroups'),
            role: 'stocktypenotification',
            message: {
                tr: `${Name} Stok Tür Grubu ${username} Tarafından Eklendi.`,
                en: `${Name} Stock Type Group Created By ${username}.`,
            }[req.language],
            pushurl: '/Stocktypegroups'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetStocktypegroups(req, res, next)
}

async function UpdateStocktypegroup(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Uuid
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Stocktypegroups.Error.NameRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Stocktypegroups.Error.StocktypegroupIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Stocktypegroups.Error.UnsupportedStocktypegroupID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stocktypegroups'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const stocktypegroup = await db.stocktypegroupModel.findOne({ where: { Uuid: Uuid } })
        if (!stocktypegroup) {
            return next(createNotFoundError(req.t('Stocktypegroups.Error.NotFound'), req.t('Stocktypegroups'), req.language))
        }
        if (!stocktypegroup.Isactive) {
            return next(createNotFoundError(req.t('Stocktypegroups.Error.NotActive'), req.t('Stocktypegroups'), req.language))
        }

        await db.stocktypegroupModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Create,
            service: req.t('Stocktypegroups'),
            role: 'stocktypenotification',
            message: {
                tr: `${Name} Stok Tür Grubu ${username} Tarafından Güncellendi.`,
                en: `${Name} Stock Type Group Updated By ${username}.`,
            }[req.language],
            pushurl: '/Stocktypegroups'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetStocktypegroups(req, res, next)
}


async function DeleteStocktypegroup(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.stocktypegroupId

    if (!Uuid) {
        validationErrors.push(req.t('Stocktypegroups.Error.StocktypegroupIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Stocktypegroups.Error.UnsupportedStocktypegroupID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stocktypegroups'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const stocktypegroup = await db.stocktypegroupModel.findOne({ where: { Uuid: Uuid } })
        if (!stocktypegroup) {
            return next(createNotFoundError(req.t('Stocktypegroups.Error.NotFound'), req.t('Stocktypegroups'), req.language))
        }
        if (!stocktypegroup.Isactive) {
            return next(createNotFoundError(req.t('Stocktypegroups.Error.NotActive'), req.t('Stocktypegroups'), req.language))
        }

        await db.stocktypegroupModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Stocktypegroups'),
            role: 'stocktypenotification',
            message: {
                tr: `${stocktypegroup?.Name} Stok Tür Grubu ${username} Tarafından Silindi.`,
                en: `${stocktypegroup?.Name} Stock Type Group Silindi By ${username}.`,
            }[req.language],
            pushurl: '/Stocktypegroups'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetStocktypegroups(req, res, next)
}


module.exports = {
    GetStocktypegroups,
    GetStocktypegroup,
    AddStocktypegroup,
    UpdateStocktypegroup,
    DeleteStocktypegroup,
}
