const config = require("../Config")
const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')

async function GetStockdefines(req, res, next) {
    try {
        const stockdefines = await db.stockdefineModel.findAll({ where: { Isactive: true } })
        if (stockdefines && stockdefines.length > 0) {
            let departments = []
            let units = []
            try {
                const departmentsresponse = await axios({
                    method: 'GET',
                    url: config.services.Setting + `Departments`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                const unitsresponse = await axios({
                    method: 'GET',
                    url: config.services.Setting + `Units`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                departments = departmentsresponse.data
                units = unitsresponse.data
            } catch (error) {
                next(requestErrorCatcher(error, 'Setting'))
            }
            for (const stockdefine of stockdefines) {
                stockdefine.Department = departments.find(u => u.Uuid === stockdefine.DepartmentID)
                stockdefine.Unit = units.find(u => u.Uuid === stockdefine.UnitID)
            }
        }
        res.status(200).json(stockdefines)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function GetStockdefine(req, res, next) {

    let validationErrors = []
    if (!req.params.stockdefineId) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKDEFINEID_REQUIRED)
    }
    if (!validator.isUUID(req.params.stockdefineId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKDEFINEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: req.params.stockdefineId } });
        if (!stockdefine) {
            return createNotfounderror([messages.ERROR.STOCKDEFINE_NOT_FOUND], req.language)
        }
        if (!stockdefine.Isactive) {
            return createNotfounderror([messages.ERROR.STOCKDEFINE_NOT_ACTIVE], req.language)
        }

        try {
            const departmentsresponse = await axios({
                method: 'GET',
                url: config.services.Setting + `Departments/${stockdefine.DepartmentID}`,
                headers: {
                    session_key: config.session.secret
                }
            })
            const unitsresponse = await axios({
                method: 'GET',
                url: config.services.Setting + `Units/${stockdefine.UnitID}`,
                headers: {
                    session_key: config.session.secret
                }
            })
            stockdefine.Department = departmentsresponse.data
            stockdefine.Unit = unitsresponse.data
        } catch (error) {
            next(requestErrorCatcher(error, 'Setting'))
        }
        res.status(200).json(stockdefine)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function AddStockdefine(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Description,
        UnitID,
        DepartmentID,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
    }
    if (!validator.isString(Description)) {
        validationErrors.push(messages.VALIDATION_ERROR.DESCIRIPTION_REQUIRED, req.language)
    }
    if (!DepartmentID || !validator.isUUID(DepartmentID)) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED, req.language)
    }
    if (!UnitID || !validator.isUUID(UnitID)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNITID_REQUIRED, req.language)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let stockdefineuuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.stockdefineModel.create({
            ...req.body,
            Uuid: stockdefineuuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await t.commit()
        const stockdefines = await db.stockdefineModel.findAll({ where: { Isactive: true } })
        if (stockdefines && stockdefines.length > 0) {
            let departments = []
            let units = []
            try {
                const departmentsresponse = await axios({
                    method: 'GET',
                    url: config.services.Setting + `Departments`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                const unitsresponse = await axios({
                    method: 'GET',
                    url: config.services.Setting + `Units`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                departments = departmentsresponse.data
                units = unitsresponse.data
            } catch (error) {
                next(requestErrorCatcher(error, 'Setting'))
            }
            for (const stockdefine of stockdefines) {
                stockdefine.Department = departments.find(u => u.Uuid === stockdefine.DepartmentID)
                stockdefine.Unit = units.find(u => u.Uuid === stockdefine.UnitID)
            }
        }
        res.status(200).json(stockdefines)
    } catch (err) {
        await t.rollback()
        next(sequelizeErrorCatcher(err))
    }
}

async function UpdateStockdefine(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Uuid,
        Description,
        UnitID,
        DepartmentID,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
    }
    if (!validator.isString(Description)) {
        validationErrors.push(messages.VALIDATION_ERROR.DESCIRIPTION_REQUIRED, req.language)
    }
    if (!DepartmentID || !validator.isUUID(DepartmentID)) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED, req.language)
    }
    if (!UnitID || !validator.isUUID(UnitID)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNITID_REQUIRED, req.language)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKDEFINEID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKDEFINEID, req.language)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    try {
        const stockdefine = db.stockdefineModel.findOne({ where: { Uuid: Uuid } })
        if (!stockdefine) {
            return next(createNotfounderror([messages.ERROR.STOCKDEFINE_NOT_FOUND], req.language))
        }
        if (stockdefine.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STOCKDEFINE_NOT_ACTIVE], req.language))
        }

        const t = await db.sequelize.transaction();

        await db.stockdefineModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await t.commit()
        const stockdefines = await db.stockdefineModel.findAll({ where: { Isactive: true } })
        if (stockdefines && stockdefines.length > 0) {
            let departments = []
            let units = []
            try {
                const departmentsresponse = await axios({
                    method: 'GET',
                    url: config.services.Setting + `Departments`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                const unitsresponse = await axios({
                    method: 'GET',
                    url: config.services.Setting + `Units`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                departments = departmentsresponse.data
                units = unitsresponse.data
            } catch (error) {
                next(requestErrorCatcher(error, 'Setting'))
            }
            for (const stockdefine of stockdefines) {
                stockdefine.Department = departments.find(u => u.Uuid === stockdefine.DepartmentID)
                stockdefine.Unit = units.find(u => u.Uuid === stockdefine.UnitID)
            }
        }
        res.status(200).json(stockdefines)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }


}

async function DeleteStockdefine(req, res, next) {

    let validationErrors = []
    const {
        Uuid
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKDEFINEID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKDEFINEID, req.language)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const stockdefine = db.stockdefineModel.findOne({ where: { Uuid: Uuid } })
        if (!stockdefine) {
            return next(createNotfounderror([messages.ERROR.STOCKDEFINE_NOT_FOUND], req.language))
        }
        if (stockdefine.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STOCKDEFINE_NOT_ACTIVE], req.language))
        }
        const t = await db.sequelize.transaction();

        await db.stockdefineModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();

        const stockdefines = await db.stockdefineModel.findAll({ where: { Isactive: true } })
        if (stockdefines && stockdefines.length > 0) {
            let departments = []
            let units = []
            try {
                const departmentsresponse = await axios({
                    method: 'GET',
                    url: config.services.Setting + `Departments`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                const unitsresponse = await axios({
                    method: 'GET',
                    url: config.services.Setting + `Units`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                departments = departmentsresponse.data
                units = unitsresponse.data
            } catch (error) {
                next(requestErrorCatcher(error, 'Setting'))
            }
            for (const stockdefine of stockdefines) {
                stockdefine.Department = departments.find(u => u.Uuid === stockdefine.DepartmentID)
                stockdefine.Unit = units.find(u => u.Uuid === stockdefine.UnitID)
            }
        }
        res.status(200).json(stockdefines)
    } catch (error) {
        await t.rollback();
        next(sequelizeErrorCatcher(error))
    }

}

module.exports = {
    GetStockdefines,
    GetStockdefine,
    AddStockdefine,
    UpdateStockdefine,
    DeleteStockdefine,
}