const config = require("../Config")
const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')


async function Transferpatientstock(req, res, next) {
    let validationErrors = []
    const {
        Uuid,
        WarehouseID,
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isUUID(WarehouseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.WAREHOUSEID_REQUIRED)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const patient = req.body
    const t = await db.sequelize.transaction();
    try {
        const patientstocks = await db.patientstockModel.findAll({ where: { PatientID: patient.Uuid } });
        if (!patientstocks) {
            return next(createNotfounderror([messages.ERROR.STOCK_NOT_FOUND], req.language))
        }
        if (!patientstocks.Isactive) {
            return next(createNotfounderror([messages.ERROR.STOCK_NOT_ACTIVE], req.language))
        }
        for (const patientstock of patientstocks) {

            let amount = 0;
            let movements = await db.patientstockmovementModel.findAll({ where: { StockID: patientstock.Uuid } })
            for (const movement of movements) {
                amount += (movement.Amount * movement.Movementtype);
                await patientstockmovementModel.update({
                    ...movement,
                    Status: 1,
                    Updateduser: "System",
                    Updatetime: new Date(),
                }, { where: { Uuid: movement.Uuid } }, { transaction: t })
            }
            let foundedstock = await db.stockModel.findOne({
                where: {
                    Skt: patientstock.Skt,
                    Barcodeno: patientstock.Barcodeno,
                    StockdefineID: patientstock.StockdefineID,
                    DepartmentID: patientstock.DepartmentID,
                    WarehouseID: WarehouseID
                }
            })

            if (!foundedstock) {
                let newstockUuid = uuid()
                await db.stockModel.create({
                    Uuid: newstockUuid,
                    Barcodeno: patientstock.Barcodeno,
                    DepartmentID: patientstock.DepartmentID,
                    Info: patientstock.Info,
                    Skt: patientstock.Skt,
                    StockdefineID: patientstock.StockdefineID,
                    WarehouseID: WarehouseID,
                    CreatedUser: 'System',
                    CreateTime: new Date(),
                    IsActive: true,
                }, { transaction: t })
                await db.stockmovementModel.create({
                    Uuid: uuid(),
                    StockID: newstockUuid,
                    Amount: amount,
                    Movementdate: new Date(),
                    Movementtype: 1,
                    Prevvalue: 0,
                    Newvalue: amount,
                    CreatedUser: 'System',
                    CreateTime: new Date(),
                    IsActive: true
                }, { transaction: t })
            } else {
                let previousamount = 0;
                let oldmovements = await db.stockmovementModel.findAll({ where: { StockID: foundedstock.Uuid } })
                for (const oldmovement of oldmovements) {
                    previousamount += (oldmovement.Amount * oldmovement.Movementtype);
                }
                await db.stockmovementModel.create({
                    Uuid: uuid(),
                    StockID: foundedstock.Uuid,
                    Amount: amount,
                    Movementdate: new Date(),
                    Movementtype: 1,
                    Prevvalue: previousamount,
                    Newvalue: previousamount + amount,
                    CreatedUser: 'System',
                    CreateTime: new Date(),
                    IsActive: true
                }, { transaction: t })
            }

            let body = DataCleaner(patientstock)
            await db.patientstockModel.update({
                ...body,
                Status: 1,
                Updateduser: "System",
                Updatetime: new Date(),
            }, { where: { Uuid: patientstock.Uuid } }, { transaction: t })
        }
        t.commit()
    } catch (error) {
        t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    res.status(200)
}

async function GetPatientstocks(req, res, next) {
    try {
        const patientstocks = await db.patientstockModel.findAll({ where: { Isactive: true } })
        if (patientstocks && patientstocks.length > 0) {
            let departments = []
            let units = []
            let patients = []
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
                const patientsresponse = await axios({
                    method: 'GET',
                    url: config.services.Business + `Patients/GetFullpatients`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                departments = departmentsresponse.data
                units = unitsresponse.data
                patients = patientsresponse.data
            } catch (error) {
                return next(requestErrorCatcher(error, 'Setting'))
            }
            for (const patientstock of patientstocks) {
                let amount = 0.0;
                let movements = await db.patientstockmovementModel.findAll({ where: { StockID: patientstock.Uuid } })
                movements.forEach(movement => {
                    amount += (movement.Amount * movement.Movementtype);
                });
                patientstock.Amount = amount
                patientstock.Stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: patientstock.StockdefineID } })
                if (patientstock.Stockdefine) {
                    patientstock.Stockdefine.Unit = units.find(u => u.Uuid === patientstock.Stockdefine.UnitID)
                    patientstock.Stockdefine.Department = departments.find(u => u.Uuid === patientstock.Stockdefine.DepartmentID)
                }
                patientstock.Department = departments.find(u => u.Uuid === patientstock.DepartmentID)
                patientstock.Patient = patients.find(u => u.Uuid === patientstock.PatientID)
            }
        }
        res.status(200).json(patientstocks)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPatientstock(req, res, next) {

    let validationErrors = []
    if (!req.params.stockId) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKID_REQUIRED)
    }
    if (!validator.isUUID(req.params.stockId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const patientstock = await db.patientstockModel.findOne({ where: { Uuid: req.params.stockId } });
        if (!patientstock) {
            return next(createNotfounderror([messages.ERROR.STOCK_NOT_FOUND], req.language))
        }
        if (!patientstock.Isactive) {
            return next(createNotfounderror([messages.ERROR.STOCK_NOT_ACTIVE], req.language))
        }
        try {
            patientstock.Stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: patientstock.StockdefineID } })
            let amount = 0.0;
            let movements = await db.patientstockmovementModel.findAll({ where: { StockID: patientstock.Uuid } })
            movements.forEach(movement => {
                amount += (movement.Amount * movement.Movementtype);
            });
            patientstock.Amount = amount
            if (patientstock.Stockdefine) {
                const departmentsresponse = await axios({
                    method: 'GET',
                    url: config.services.Setting + `Departments/${patientstock.Stockdefine.DepartmentID}`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                const unitsresponse = await axios({
                    method: 'GET',
                    url: config.services.Setting + `Units/${patientstock.Stockdefine.UnitID}`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                const patientresponse = await axios({
                    method: 'GET',
                    url: config.services.Business + `Patients/${patientstock.PatientID}`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                patientstock.Patient = patientresponse.data
                patientstock.Stockdefine.Department = departmentsresponse.data
                patientstock.Stockdefine.Unit = unitsresponse.data
            }

        } catch (error) {
            return next(requestErrorCatcher(error, 'Setting'))
        }
        res.status(200).json(patientstock)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddPatientstock(req, res, next) {

    let validationErrors = []
    const {
        PatientID,
        Isonusage,
        Source,
        StockdefineID,
        DepartmentID,
        Skt,
        Barcodeno,
        Status,
        Order,
    } = req.body

    if (!validator.isUUID(PatientID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isBoolean(Isonusage)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISONUSAGE_REQUIRED)
    }
    if (!validator.isString(Source)) {
        validationErrors.push(messages.VALIDATION_ERROR.SOURCE_REQUIRED)
    }
    if (!validator.isUUID(StockdefineID)) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKDEFINEID_REQUIRED)
    }
    if (!validator.isUUID(DepartmentID)) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED)
    }
    if (!validator.isISODate(Skt)) {
        validationErrors.push(messages.VALIDATION_ERROR.SKT_REQUIRED)
    }
    if (!validator.isString(Barcodeno)) {
        validationErrors.push(messages.VALIDATION_ERROR.BARCODENO_REQUIRED)
    }
    if (!validator.isNumber(Status)) {
        validationErrors.push(messages.VALIDATION_ERROR.STATUS_REQUIRED)
    }
    if (!validator.isNumber(Order)) {
        validationErrors.push(messages.VALIDATION_ERROR.ORDER_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let stockuuid = uuid()

    const t = await db.sequelize.transaction();
    try {
        await db.patientstockModel.create({
            ...req.body,
            Uuid: stockuuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await db.patientstockmovementModel.create({
            Uuid: uuid(),
            StockID: stockuuid,
            Amount: req.body.Amount,
            Movementdate: new Date(),
            Movementtype: 1,
            Prevvalue: 0,
            Newvalue: req.body.Amount,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })
        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetPatientstocks(req, res, next)
}

async function UpdatePatientstock(req, res, next) {

    let validationErrors = []
    const {
        PatientID,
        StockdefineID,
        DepartmentID,
        Skt,
        Barcodeno,
        Status,
        Order,
        Uuid
    } = req.body

    if (!validator.isUUID(PatientID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PATIENTID_REQUIRED)
    }
    if (!validator.isUUID(StockdefineID)) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKDEFINEID_REQUIRED)
    }
    if (!validator.isUUID(DepartmentID)) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED)
    }
    if (!validator.isISODate(Skt)) {
        validationErrors.push(messages.VALIDATION_ERROR.SKT_REQUIRED)
    }
    if (!validator.isString(Barcodeno)) {
        validationErrors.push(messages.VALIDATION_ERROR.BARCODENO_REQUIRED)
    }
    if (!validator.isNumber(Status)) {
        validationErrors.push(messages.VALIDATION_ERROR.STATUS_REQUIRED)
    }
    if (!validator.isNumber(Order)) {
        validationErrors.push(messages.VALIDATION_ERROR.ORDER_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKID)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKID_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    const t = await db.sequelize.transaction();
    try {
        const stock = db.patientstockModel.findOne({ where: { Uuid: Uuid } })
        if (!stock) {
            return next(createNotfounderror([messages.ERROR.STOCK_NOT_FOUND], req.language))
        }
        if (stock.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STOCK_NOT_ACTIVE], req.language))
        }

        await db.patientstockModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPatientstocks(req, res, next)
}

async function DeletePatientstock(req, res, next) {

    let validationErrors = []
    const {
        Uuid
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const patientstock = await db.patientstockModel.findOne({ where: { Uuid: req.params.stockId } });
        if (!patientstock) {
            return createNotfounderror([messages.ERROR.STOCK_NOT_FOUND])
        }
        if (!patientstock.Isactive) {
            return createNotfounderror([messages.ERROR.STOCK_NOT_ACTIVE])
        }

        await db.patientstockmovementModel.destroy({ where: { StockID: Uuid } })
        await db.patientstockModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetPurchaseorderstocks(req, res, next)
}

module.exports = {
    GetPatientstocks,
    GetPatientstock,
    AddPatientstock,
    UpdatePatientstock,
    DeletePatientstock,
    Transferpatientstock
}