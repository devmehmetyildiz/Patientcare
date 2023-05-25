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
                const departmentresponse = axios({
                    method: 'GET',
                    url: config.services.Setting + 'Departments',
                    headers: {
                        session_key: config.session.secret
                    }
                })
                const unitresponse = axios({
                    method: 'GET',
                    url: config.services.Setting + 'Units',
                    headers: {
                        session_key: config.session.secret
                    }
                })
                await Promise.all([departmentresponse, unitresponse])
                departments = departmentresponse
                units = unitresponse
            } catch (err) {
                return next(requestErrorCatcher(err, 'Setting'))
            }
        }
        for (const warehouse of warehouses) {
            let stocks = await db.stockModel.findAll({ where: { WarehouseID: warehouse.Uuid } })
            for (const stock of stocks) {
                let amount = 0.0;
                let movements = await db.stockmovementModel.findAll({ where: { StockID: stock.Uuid } })
                for (const movement of movements) {
                    amount += (movement.Amount * movement.Movementtype);
                }
                stock.Amount = amount;
                stock.Stockdefine = await db.stockdefineModel.findAll({ where: { Uuid: stock.StockdefineID } })
                stock.Department = departments.find(u => u.Uuid === stock.DepartmentID)
                stock.Stockdefine && (stock.Stockdefine.Unit = units.find(u => u.Uuid === stock.Stockdefine.UnitID))
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
        validationErrors.push(messages.VALIDATION_ERROR.TODOGROUPDEFINEID_REQUIRED)
    }
    if (!validator.isUUID(req.params.warehouseId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_TODOGROUPDEFINEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const warehouse = await db.warehouseModel.findOne({ where: { Uuid: req.params.warehouseId } });
        if (!todogroupdefine) {
            return createNotfounderror([messages.ERROR.TODOGROUPDEFINE_NOT_FOUND], req.language)
        }
        if (!todogroupdefine.Isactive) {
            return createNotfounderror([messages.ERROR.TODOGROUPDEFINE_NOT_ACTIVE], req.language)
        }
        let tododefineuuids = await db.todogroupdefinetododefineModel.findAll({
            where: {
                GroupID: todogroupdefine.Uuid,
            }
        });
        todogroupdefine.Tododefines = await db.tododefineModel.findAll({
            where: {
                Uuid: tododefineuuids.map(u => { return u.TodoID })
            }
        })
        todogroupdefine.Department = await db.departmentModel.findOne({ where: { Uuid: todogroupdefine.DepartmentID } })
        res.status(200).json(todogroupdefine)
    } catch (error) {
        sequelizeErrorCatcher(error)
        next()
    }
}

async function AddWarehouse(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Tododefines,
        DepartmentID,
    } = req.body

    if (!Name || !validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
    }
    if (!DepartmentID || !validator.isUUID(DepartmentID)) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED, req.language)
    }
    if (!Tododefines || !Array.isArray(Tododefines) || Tododefines.length <= 0) {
        validationErrors.push(messages.VALIDATION_ERROR.TODODEFINES_REQUIRED, req.language)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let todogroupdefineuuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.todogroupdefineModel.create({
            ...req.body,
            Uuid: todogroupdefineuuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        for (const tododefine of Tododefines) {
            if (!tododefine.Uuid || !validator.isUUID(tododefine.Uuid)) {
                return next(createValidationError(messages.VALIDATION_ERROR.UNSUPPORTED_TODODEFINEID, req.language))
            }
            await db.todogroupdefinetododefineModel.create({
                GroupID: todogroupdefineuuid,
                TodoID: tododefine.Uuid
            }, { transaction: t });
        }

        await t.commit()
        const createdTodogroupdefine = await db.todogroupdefineModel.findOne({ where: { Uuid: todogroupdefineuuid } })
        let tododefineuuids = await db.todogroupdefinetododefineModel.findAll({
            where: {
                GroupID: todogroupdefine.Uuid,
            }
        });
        createdTodogroupdefine.Tododefines = await db.tododefineModel.findAll({
            where: {
                Uuid: tododefineuuids.map(u => { return u.TodoID })
            }
        })
        createdTodogroupdefine.Department = await db.departmentModel.findOne({ where: { Uuid: createdTodogroupdefine.DepartmentID } })
        res.status(200).json(createdTodogroupdefine)
    } catch (err) {
        await t.rollback()
        sequelizeErrorCatcher(err)
        next()
    }
}

async function UpdateWarehouse(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Tododefines,
        DepartmentID,
        Uuid
    } = req.body
    if (!Name || !validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.TODOGROUPDEFINEID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_TODOGROUPDEFINEID, req.language)
    }
    if (!DepartmentID || !validator.isUUID(DepartmentID)) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED, req.language)
    }
    if (!Tododefines || !Array.isArray(Tododefines) || Tododefines.length <= 0) {
        validationErrors.push(messages.VALIDATION_ERROR.TODODEFINES_REQUIRED, req.language)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const todogroupdefine = db.todogroupdefineModel.findOne({ where: { Uuid: Uuid } })
        if (!todogroupdefine) {
            return next(createNotfounderror([messages.ERROR.TODOGROUPDEFINE_NOT_FOUND], req.language))
        }
        if (todogroupdefine.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.TODOGROUPDEFINE_NOT_ACTIVE], req.language))
        }

        const t = await db.sequelize.transaction();

        await db.todogroupdefineModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await db.todogroupdefinetododefineModel.destroy({ where: { GroupID: Uuid }, transaction: t });
        for (const tododefine of Tododefines) {
            if (!tododefine.Uuid || !validator.isUUID(tododefine.Uuid)) {
                return next(createValidationError(messages.VALIDATION_ERROR.UNSUPPORTED_TODODEFINEID, req.language))
            }
            await db.todogroupdefinetododefineModel.create({
                GroupID: Uuid,
                TodoID: tododefine.Uuid
            }, { transaction: t });
        }
        await t.commit()
        const updateTodogroupdefine = await db.todogroupdefineModel.findOne({ where: { Uuid: Uuid } })
        let tododefineuuids = await db.todogroupdefinetododefineModel.findAll({
            where: {
                GroupID: todogroupdefine.Uuid,
            }
        });
        updateTodogroupdefine.Tododefines = await db.tododefineModel.findAll({
            where: {
                Uuid: tododefineuuids.map(u => { return u.TodoID })
            }
        })
        updateTodogroupdefine.Department = await db.departmentModel.findOne({ where: { Uuid: updateTodogroupdefine.DepartmentID } })
        res.status(200).json(updateTodogroupdefine)
    } catch (error) {
        sequelizeErrorCatcher(error)
        next()
    }


}

async function DeleteWarehouse(req, res, next) {

    let validationErrors = []
    const {
        Uuid
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.TODOGROUPDEFINEID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_TODOGROUPDEFINEID, req.language)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const todogroupdefine = db.todogroupdefineModel.findOne({ where: { Uuid: Uuid } })
        if (!todogroupdefine) {
            return next(createNotfounderror([messages.ERROR.TODOGROUPDEFINE_NOT_FOUND], req.language))
        }
        if (todogroupdefine.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.TODOGROUPDEFINE_NOT_ACTIVE], req.language))
        }
        const t = await db.sequelize.transaction();

        await db.todogroupdefinetododefineModel.destroy({ where: { GroupID: Uuid }, transaction: t });
        await db.tododefineModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();

        res.status(200).json({ messages: "deleted", Uuid: Uuid })
    } catch (error) {
        await t.rollback();
        sequelizeErrorCatcher(error)
        next()
    }

}

module.exports = {
    GetWarehouses,
    GetWarehouse,
    AddWarehouse,
    UpdateWarehouse,
    DeleteWarehouse,
}