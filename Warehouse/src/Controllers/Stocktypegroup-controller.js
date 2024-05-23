const config = require("../Config")
const { types } = require("../Constants/Defines")
const messages = require("../Constants/StocktypegroupMessages")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')

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
        validationErrors.push(messages.VALIDATION_ERROR.STOCKTYPEGROUPID_REQUIRED)
    }
    if (!validator.isUUID(req.params.stocktypegroupId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKTYPEGROUPID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const stocktypegroup = await db.stocktypegroupModel.findOne({ where: { Uuid: req.params.stocktypegroupId } });
        if (!stocktypegroup) {
            return next(createNotfounderror([messages.ERROR.STOCKTYPEGROUP_NOT_FOUND], req.language))
        }
        if (!stocktypegroup.Isactive) {
            return next(createNotfounderror([messages.ERROR.STOCKTYPEGROUP_NOT_ACTIVE], req.language))
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
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
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
            service: 'Stok Tür Grupları',
            role: 'stocktypegroupnotification',
            message: `${Name} stok tür grubu  ${username} tarafından eklendi.`,
            pushurl: `/Stocktypegroups`
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
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKTYPEGROUPID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKTYPEGROUPID)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const stocktypegroup = await db.stocktypegroupModel.findOne({ where: { Uuid: Uuid } })
        if (!stocktypegroup) {
            return next(createNotfounderror([messages.ERROR.STOCKTYPEGROUP_NOT_FOUND], req.language))
        }
        if (stocktypegroup.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STOCKTYPEGROUP_NOT_ACTIVE], req.language))
        }

        await db.stocktypegroupModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })


        await CreateNotification({
            type: types.Update,
            service: 'Stok Tür Grupları',
            role: 'stocktypegroupnotification',
            message: `${stocktypegroup?.Name} stok tür grubu  ${username} tarafından Güncellendi.`,
            pushurl: `/Stocktypegroups`
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
        validationErrors.push(messages.VALIDATION_ERROR.STOCKTYPEGROUPID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKTYPEGROUPID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const stocktypegroup = await db.stocktypegroupModel.findOne({ where: { Uuid: Uuid } })
        if (!stocktypegroup) {
            return next(createNotfounderror([messages.ERROR.STOCKTYPEGROUP_NOT_FOUND], req.language))
        }
        if (stocktypegroup.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STOCKTYPEGROUP_NOT_ACTIVE], req.language))
        }
        await db.stocktypegroupModel.destroy({ where: { Uuid: Uuid }, transaction: t });

        await CreateNotification({
            type: types.Delete,
            service: 'Stok Tür Grupları',
            role: 'stocktypegroupnotification',
            message: `${stocktypegroup?.Name} stok tür grubu  ${username} tarafından silindi.`,
            pushurl: `/Stocktypegroups`
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