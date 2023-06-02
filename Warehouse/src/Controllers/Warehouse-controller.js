const config = require("../Config")
const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require("axios")

async function GetWarehouses(req, res, next) {
    try {
        const warehouses = await db.warehouseModel.findAll({ where: { Isactive: true } })
        let departments = null
        let units = null
        if (warehouses && Array.isArray(warehouses) && warehouses.length > 0) {
            try {
                const departmentresponse = await axios({
                    method: 'GET',
                    url: config.services.Setting + 'Departments',
                    headers: {
                        session_key: config.session.secret
                    }
                })
                const unitresponse = await axios({
                    method: 'GET',
                    url: config.services.Setting + 'Units',
                    headers: {
                        session_key: config.session.secret
                    }
                })
                departments = departmentresponse.data
                units = unitresponse.data
            } catch (err) {
                return next(requestErrorCatcher(err, 'Setting'))
            }
        }
        for (const warehouse of warehouses) {
            warehouse.Stocks = await db.stockModel.findAll({ where: { WarehouseID: warehouse.Uuid } })
            for (const stock of warehouse.Stocks) {
                let amount = 0.0;
                let movements = await db.stockmovementModel.findAll({ where: { StockID: stock.Uuid } })
                for (const movement of movements) {
                    amount += (movement.Amount * movement.Movementtype);
                }
                stock.Amount = amount;
                stock.Stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: stock.StockdefineID } })
                stock.Department = departments.find(u => u.Uuid === stock.DepartmentID)
                stock.Stockdefine && (stock.Stockdefine.Unit = units.find(u => u.Uuid === stock.Stockdefine.UnitID))
                stock.Stockdefine && (stock.Stockdefine.Department = departments.find(u => u.Uuid === stock.Stockdefine.DepartmentID))
            }
        }
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
        let departments = null
        let units = null
        try {
            const departmentresponse = await axios({
                method: 'GET',
                url: config.services.Setting + 'Departments',
                headers: {
                    session_key: config.session.secret
                }
            })
            const unitresponse = await axios({
                method: 'GET',
                url: config.services.Setting + 'Units',
                headers: {
                    session_key: config.session.secret
                }
            })
            departments = departmentresponse.data
            units = unitresponse.data
        } catch (err) {
            return next(requestErrorCatcher(err, 'Setting'))
        }
        warehouse.Stocks = await db.stockModel.findAll({ where: { WarehouseID: warehouse.Uuid } })
        for (const stock of warehouse.Stocks) {
            let amount = 0.0;
            let movements = await db.stockmovementModel.findAll({ where: { StockID: stock.Uuid } })
            for (const movement of movements) {
                amount += (movement.Amount * movement.Movementtype);
            }
            stock.Amount = amount;
            stock.Stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: stock.StockdefineID } })
            stock.Department = departments.find(u => u.Uuid === stock.DepartmentID)
            stock.Stockdefine && (stock.Stockdefine.Unit = units.find(u => u.Uuid === stock.Stockdefine.UnitID))
            stock.Stockdefine && (stock.Stockdefine.Department = departments.find(u => u.Uuid === stock.Stockdefine.DepartmentID))
        }
        res.status(200).json(warehouse)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function AddWarehouse(req, res, next) {

    let validationErrors = []
    const {
        Name,
    } = req.body

    if (!Name || !validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let warehouseuuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.warehouseModel.create({
            ...req.body,
            Uuid: warehouseuuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

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
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.WAREHOUSEID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.WAREHOUSEID_REQUIRED, req.language)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const warehouse =await db.warehouseModel.findOne({ where: { Uuid: Uuid } })
        if (!warehouse) {
            return next(createNotfounderror([messages.ERROR.WAREHOUSE_NOT_FOUND], req.language))
        }
        if (warehouse.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.WAREHOUSE_NOT_ACTIVE], req.language))
        }

        await db.warehouseModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetWarehouses(req, res, next)
}

async function DeleteWarehouse(req, res, next) {

    let validationErrors = []
    const {
        Uuid
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.WAREHOUSEID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_WAREHOUSEID, req.language)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const warehouse =await db.warehouseModel.findOne({ where: { Uuid: Uuid } })
        if (!warehouse) {
            return next(createNotfounderror([messages.ERROR.WAREHOUSE_NOT_FOUND], req.language))
        }
        if (warehouse.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.WAREHOUSE_NOT_ACTIVE], req.language))
        }

        await db.warehouseModel.destroy({ where: { Uuid: Uuid }, transaction: t });
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