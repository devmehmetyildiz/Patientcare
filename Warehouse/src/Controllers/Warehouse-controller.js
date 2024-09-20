const config = require("../Config")
const { types } = require("../Constants/Defines")
const messages = require("../Constants/Messages")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require("axios")

async function GetWarehouses(req, res, next) {
    try {
        const warehouses = await db.warehouseModel.findAll()
        res.status(200).json(warehouses)
    }
    catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetWarehouse(req, res, next) {

    let validationErrors = []
    if (!req.params.warehouseId) {
        validationErrors.push(messages.VALIDATION_ERROR.WAREHOUSEID_REQUIRED)
    }
    if (!validator.isUUID(req.params.warehouseId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_WAREHOUSEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const warehouse = await db.warehouseModel.findOne({ where: { Uuid: req.params.warehouseId } });
        if (!warehouse) {
            return next(createNotfounderror([messages.ERROR.WAREHOUSE_NOT_FOUND], req.language))
        }
        if (!warehouse.Isactive) {
            return next(createNotfounderror([messages.ERROR.WAREHOUSE_NOT_ACTIVE], req.language))
        }
        res.status(200).json(warehouse)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddWarehouse(req, res, next) {

    let validationErrors = []
    const {
        Name,
    } = req.body

    if (!Name || !validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    let warehouseuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.warehouseModel.create({
            ...req.body,
            Uuid: warehouseuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: 'Ambarlar',
            role: 'warehousenotification',
            message: `${Name} ambarı  ${username} tarafından oluşturuldu.`,
            pushurl: `/Warehouses`
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetWarehouses(req, res, next)
}

async function UpdateWarehouse(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Uuid
    } = req.body
    if (!Name || !validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.WAREHOUSEID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.WAREHOUSEID_REQUIRED)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const warehouse = await db.warehouseModel.findOne({ where: { Uuid: Uuid } })
        if (!warehouse) {
            return next(createNotfounderror([messages.ERROR.WAREHOUSE_NOT_FOUND], req.language))
        }
        if (warehouse.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.WAREHOUSE_NOT_ACTIVE], req.language))
        }

        await db.warehouseModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Ambarlar',
            role: 'warehousenotification',
            message: `${Name} ambarı  ${username} tarafından Güncellendi.`,
            pushurl: `/Warehouses`
        })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetWarehouses(req, res, next)
}

async function DeleteWarehouse(req, res, next) {

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
        const warehouse = await db.warehouseModel.findOne({ where: { Uuid: Uuid } })
        if (!warehouse) {
            return next(createNotfounderror([messages.ERROR.WAREHOUSE_NOT_FOUND], req.language))
        }
        if (warehouse.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.WAREHOUSE_NOT_ACTIVE], req.language))
        }

        await db.warehouseModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false,
        }, { where: { Uuid: Uuid }, transaction: t })


        await CreateNotification({
            type: types.Delete,
            service: 'Ambarlar',
            role: 'warehousenotification',
            message: `${warehouse?.Name} ambarı  ${username} tarafından silindi.`,
            pushurl: `/Warehouses`
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetWarehouses(req, res, next)
}

module.exports = {
    GetWarehouses,
    GetWarehouse,
    AddWarehouse,
    UpdateWarehouse,
    DeleteWarehouse,
}