const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

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
        validationErrors.push(req.t('Warehouses.Error.WarehouseIDRequired'))
    }
    if (!validator.isUUID(req.params.warehouseId)) {
        validationErrors.push(req.t('Warehouses.Error.UnsupportedWarehouseID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Warehouses'), req.language))
    }

    try {
        const warehouse = await db.warehouseModel.findOne({ where: { Uuid: req.params.warehouseId } });
        if (!warehouse) {
            return next(createNotFoundError(req.t('Warehouses.Error.NotFound'), req.t('Warehouses'), req.language))
        }
        if (!warehouse.Isactive) {
            return next(createNotFoundError(req.t('Warehouses.Error.NotActive'), req.t('Warehouses'), req.language))
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
        validationErrors.push(req.t('Warehouses.Error.NameRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Warehouses'), req.language))
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
            service: req.t('Warehouses'),
            role: 'warehousenotification',
            message: {
                tr: `${Name} Deposu ${username} Tarafından Eklendi.`,
                en: `${Name} Warehouse Created By ${username}.`,
            }[req.language],
            pushurl: '/Warehouses'
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
        validationErrors.push(req.t('Warehouses.Error.NameRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Warehouses.Error.WarehouseIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Warehouses.Error.UnsupportedWarehouseID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Warehouses'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const warehouse = await db.warehouseModel.findOne({ where: { Uuid: Uuid } })
        if (!warehouse) {
            return next(createNotFoundError(req.t('Warehouses.Error.NotFound'), req.t('Warehouses'), req.language))
        }
        if (!warehouse.Isactive) {
            return next(createNotFoundError(req.t('Warehouses.Error.NotActive'), req.t('Warehouses'), req.language))
        }

        await db.warehouseModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Warehouses'),
            role: 'warehousenotification',
            message: {
                tr: `${Name} Deposu ${username} Tarafından Güncellendi.`,
                en: `${Name} Warehouse Updated By ${username}.`,
            }[req.language],
            pushurl: '/Warehouses'
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
        validationErrors.push(req.t('Warehouses.Error.WarehouseIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Warehouses.Error.UnsupportedWarehouseID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Warehouses'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const warehouse = await db.warehouseModel.findOne({ where: { Uuid: Uuid } })
        if (!warehouse) {
            return next(createNotFoundError(req.t('Warehouses.Error.NotFound'), req.t('Warehouses'), req.language))
        }
        if (!warehouse.Isactive) {
            return next(createNotFoundError(req.t('Warehouses.Error.NotActive'), req.t('Warehouses'), req.language))
        }


        await db.warehouseModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false,
        }, { where: { Uuid: Uuid }, transaction: t })


        await CreateNotification({
            type: types.Delete,
            service: req.t('Warehouses'),
            role: 'warehousenotification',
            message: {
                tr: `${warehouse?.Name} Deposu ${username} Tarafından Silindi.`,
                en: `${warehouse?.Name} Warehouse Deleted By ${username}.`,
            }[req.language],
            pushurl: '/Warehouses'
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
