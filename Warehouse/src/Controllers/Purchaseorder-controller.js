const config = require("../Config")
const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require("axios")

async function GetPurchaseorders(req, res, next) {
    try {
        const purchaseorders = await db.purchaseorderModel.findAll({ where: { Isactive: true } })
        let departments = []
        let units = []
        let cases = []
        if (purchaseorders && Array.isArray(purchaseorders) && purchaseorders.length > 0) {
            try {
                const departmentresponse = await axios({
                    method: 'GET',
                    url: config.services.Setting + 'Departments',
                    headers: {
                        session_key: config.session.secret
                    }
                })
                const caseresponse = await axios({
                    method: 'GET',
                    url: config.services.Setting + 'Cases',
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
                cases = caseresponse.data
            } catch (err) {
                return next(requestErrorCatcher(err, 'Setting'))
            }
        }
        for (const purchaseorder of purchaseorders) {
            purchaseorder.Case = cases.find(u => u.Uuid === purchaseorder.CaseID)
            purchaseorder.Stocks = await db.purchaseorderstockModel.findAll({ where: { PurchaseorderID: purchaseorder.Uuid } })
            for (const purchaseorderstock of purchaseorder.Stocks) {
                let amount = 0.0;
                let movements = await db.purchaseorderstockmovementModel.findAll({ where: { StockID: purchaseorderstock.Uuid } })
                for (const movement of movements) {
                    amount += (movement.Amount * movement.Movementtype);
                }
                purchaseorderstock.Amount = amount;
                purchaseorderstock.Stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: purchaseorderstock.StockdefineID } })
                purchaseorderstock.Department = departments.find(u => u.Uuid === purchaseorderstock.DepartmentID)
                if (purchaseorderstock.Stockdefine) {
                    purchaseorderstock.Stockdefine.Unit = units.find(u => u.Uuid === purchaseorderstock.Stockdefine.UnitID)
                    purchaseorderstock.Stockdefine.Department = departments.find(u => u.Uuid === purchaseorderstock.Stockdefine.DepartmentID)
                }
            }
        }
        res.status(200).json(purchaseorders)
    }
    catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function GetPurchaseorder(req, res, next) {

    let validationErrors = []
    if (!req.params.purchaseorderId) {
        validationErrors.push(messages.VALIDATION_ERROR.PURCHASEORDERID_REQUIRED)
    }
    if (!validator.isUUID(req.params.purchaseorderId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PURCHASEORDERID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const purchaseorder = await db.purchaseorderModel.findOne({ where: { Uuid: req.params.purchaseorderId } });
        if (!purchaseorder) {
            return createNotfounderror([messages.ERROR.PURCHASEORDER_NOT_FOUND])
        }
        if (!purchaseorder.Isactive) {
            return createNotfounderror([messages.ERROR.PURCHASEORDER_NOT_ACTIVE])
        }
        try {
            const departmentresponse = await axios({
                method: 'GET',
                url: config.services.Setting + 'Departments',
                headers: {
                    session_key: config.session.secret
                }
            })
            const caseresponse = await axios({
                method: 'GET',
                url: config.services.Setting + `Cases/${purchaseorder.CaseID}`,
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
            purchaseorder.Case = caseresponse.data
        } catch (err) {
            return next(requestErrorCatcher(err, 'Setting'))
        }
        purchaseorder.Stocks = await db.purchaseorderstockModel.findAll({ where: { PurchaseorderID: purchaseorder.Uuid } })
        for (const purchaseorderstock of purchaseorder.Stocks) {
            let amount = 0.0;
            let movements = await db.purchaseorderstockmovementModel.findAll({ where: { StockID: purchaseorderstock.Uuid } })
            for (const movement of movements) {
                amount += (movement.Amount * movement.Movementtype);
            }
            purchaseorderstock.Amount = amount;
            purchaseorderstock.Stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: purchaseorderstock.StockdefineID } })
            purchaseorderstock.Department = departments.find(u => u.Uuid === purchaseorderstock.DepartmentID)
            if (purchaseorderstock.Stockdefine) {
                purchaseorderstock.Stockdefine.Unit = units.find(u => u.Uuid === purchaseorderstock.Stockdefine.UnitID)
                purchaseorderstock.Stockdefine.Department = departments.find(u => u.Uuid === purchaseorderstock.Stockdefine.DepartmentID)
            }
        }
        res.status(200).json(purchaseorder)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddPurchaseorder(req, res, next) {

    let validationErrors = []
    const {
        Stocks,
        Info,
        Company,
        Username,
        Purchaseprice,
        Purchasenumber,
        Companypersonelname,
        Personelname,
        Purchasedate,
        WarehouseID,
        CaseID,
    } = req.body

    if (!validator.isArray(Stocks)) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKS_REQUIRED)
    }
    if (!validator.isString(Info)) {
        validationErrors.push(messages.VALIDATION_ERROR.INFO_REQUIRED)
    }
    if (!validator.isString(Company)) {
        validationErrors.push(messages.VALIDATION_ERROR.COMPANY_REQUIRED)
    }
    if (!validator.isString(Username)) {
        validationErrors.push(messages.VALIDATION_ERROR.USERNAME_REQUIRED)
    }
    if (!validator.isNumber(Purchaseprice)) {
        validationErrors.push(messages.VALIDATION_ERROR.PURHCASEPRICE_REQUIRED)
    }
    if (!validator.isString(Purchasenumber)) {
        validationErrors.push(messages.VALIDATION_ERROR.PURHCASENUMBER_REQUIRED)
    }
    if (!validator.isString(Companypersonelname)) {
        validationErrors.push(messages.VALIDATION_ERROR.COMPANYPERSONELNAME_REQUIRED)
    }
    if (!validator.isString(Personelname)) {
        validationErrors.push(messages.VALIDATION_ERROR.PERSONELNAME_REQUIRED)
    }
    if (!validator.isISODate(Purchasedate)) {
        validationErrors.push(messages.VALIDATION_ERROR.PURCHASEDATE_REQUIRED)
    }
    if (!validator.isString(WarehouseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.WAREHOUSEID_REQUIRED)
    }
    if (!validator.isString(CaseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.CASEID_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let purchaseorderuuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.purchaseorderModel.create({
            ...req.body,
            Uuid: purchaseorderuuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        for (const stock of Stocks) {
            let body = DataCleaner(stock)
            let stockuuid = uuid()
            await db.purchaseorderstockModel.create({
                ...body,
                Uuid: stockuuid,
                PurchaseorderID: purchaseorderuuid,
                Createduser: "System",
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
            await db.purchaseorderstockmovementModel.create({
                StockID: stockuuid,
                Amount: stock.Amount,
                Movementdate: new Date(),
                Movementtype: 1,
                Prevvalue: 0,
                Newvalue: stock.Amount,
                Uuid: uuid(),
                Createduser: "System",
                Createtime: new Date(),
                Isactive: true
            }, { transation: t })
        }
        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetPurchaseorders(req, res, next)
}

async function UpdatePurchaseorder(req, res, next) {

    let validationErrors = []
    const {
        Stocks,
        Info,
        Company,
        Username,
        Purchaseprice,
        Purchasenumber,
        Companypersonelname,
        Personelname,
        Purchasedate,
        WarehouseID,
        CaseID,
        Uuid
    } = req.body

    if (!validator.isArray(Stocks)) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKS_REQUIRED)
    }
    if (!validator.isString(Info)) {
        validationErrors.push(messages.VALIDATION_ERROR.INFO_REQUIRED)
    }
    if (!validator.isString(Company)) {
        validationErrors.push(messages.VALIDATION_ERROR.COMPANY_REQUIRED)
    }
    if (!validator.isString(Username)) {
        validationErrors.push(messages.VALIDATION_ERROR.USERNAME_REQUIRED)
    }
    if (!validator.isNumber(Purchaseprice)) {
        validationErrors.push(messages.VALIDATION_ERROR.PURHCASEPRICE_REQUIRED)
    }
    if (!validator.isString(Purchasenumber)) {
        validationErrors.push(messages.VALIDATION_ERROR.PURHCASENUMBER_REQUIRED)
    }
    if (!validator.isString(Companypersonelname)) {
        validationErrors.push(messages.VALIDATION_ERROR.COMPANYPERSONELNAME_REQUIRED)
    }
    if (!validator.isString(Personelname)) {
        validationErrors.push(messages.VALIDATION_ERROR.PERSONELNAME_REQUIRED)
    }
    if (!validator.isISODate(Purchasedate)) {
        validationErrors.push(messages.VALIDATION_ERROR.PURCHASEDATE_REQUIRED)
    }
    if (!validator.isString(WarehouseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.WAREHOUSEID_REQUIRED)
    }
    if (!validator.isString(CaseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.CASEID_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PURCHASEORDERID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PURCHASEORDERID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    const t = await db.sequelize.transaction();
    try {
        const purchaseorder = await db.purchaseorderModel.findOne({ where: { Uuid: Uuid } });
        if (!purchaseorder) {
            return next(createNotfounderror([messages.ERROR.PURCHASEORDER_NOT_FOUND], req.language))
        }
        if (!purchaseorder.Isactive) {
            return next(createNotfounderror([messages.ERROR.PURCHASEORDER_NOT_ACTIVE], req.language))
        }

        await db.purchaseorderModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        for (const stock of Stocks) {
            if (!stock.Uuid || !validator.isUUID(stock.Uuid)) {
                let body = DataCleaner(stock)
                let stockuuid = uuid()
                await db.purchaseorderstockModel.create({
                    ...body,
                    Uuid: stockuuid,
                    PurchaseorderID: Uuid,
                    Createduser: "System",
                    Createtime: new Date(),
                    Isactive: true
                }, { transaction: t })
                await db.purchaseorderstockmovementModel.create({
                    StockID: stockuuid,
                    Amount: stock.Amount,
                    Movementdate: new Date(),
                    Movementtype: 1,
                    Prevvalue: 0,
                    Newvalue: stock.Amount,
                    Uuid: uuid(),
                    Createduser: "System",
                    Createtime: new Date(),
                    Isactive: true
                }, { transation: t })
            } else {
                let body = DataCleaner(stock)
                await db.purchaseorderstockModel.update({
                    ...body,
                    Updateduser: "System",
                    Updatetime: new Date(),
                }, { where: { Uuid: stock.Uuid } }, { transaction: t })
            }
        }
        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetPurchaseorders(req, res, next)
}

async function CompletePurchaseorder(req, res, next) {

    let validationErrors = []
    const {
        Stocks,
        Info,
        Company,
        Username,
        Purchaseprice,
        Purchasenumber,
        Companypersonelname,
        Personelname,
        Purchasedate,
        WarehouseID,
        CaseID,
        Uuid
    } = req.body

    if (!validator.isArray(Stocks)) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKS_REQUIRED)
    }
    if (!validator.isString(Info)) {
        validationErrors.push(messages.VALIDATION_ERROR.INFO_REQUIRED)
    }
    if (!validator.isString(Company)) {
        validationErrors.push(messages.VALIDATION_ERROR.COMPANY_REQUIRED)
    }
    if (!validator.isString(Username)) {
        validationErrors.push(messages.VALIDATION_ERROR.USERNAME_REQUIRED)
    }
    if (!validator.isNumber(Purchaseprice)) {
        validationErrors.push(messages.VALIDATION_ERROR.PURHCASEPRICE_REQUIRED)
    }
    if (!validator.isString(Purchasenumber)) {
        validationErrors.push(messages.VALIDATION_ERROR.PURHCASENUMBER_REQUIRED)
    }
    if (!validator.isString(Companypersonelname)) {
        validationErrors.push(messages.VALIDATION_ERROR.COMPANYPERSONELNAME_REQUIRED)
    }
    if (!validator.isString(Personelname)) {
        validationErrors.push(messages.VALIDATION_ERROR.PERSONELNAME_REQUIRED)
    }
    if (!validator.isISODate(Purchasedate)) {
        validationErrors.push(messages.VALIDATION_ERROR.PURCHASEDATE_REQUIRED)
    }
    if (!validator.isString(WarehouseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.WAREHOUSEID_REQUIRED)
    }
    if (!validator.isString(CaseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.CASEID_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PURCHASEORDERID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PURCHASEORDERID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const purchaseorder = await db.purchaseorderModel.findOne({ where: { Uuid: Uuid } });
        if (!purchaseorder) {
            return next(createNotfounderror([messages.ERROR.PURCHASEORDER_NOT_FOUND], req.language))
        }
        if (!purchaseorder.Isactive) {
            return next(createNotfounderror([messages.ERROR.PURCHASEORDER_NOT_ACTIVE], req.language))
        }
        try {
            const caseresponse = await axios({
                method: 'GET',
                url: config.services.Setting + `Cases/GetCompleteCase`,
                headers: {
                    session_key: config.session.secret
                }
            })
            let completeCase = caseresponse.data
            req.body.CaseID = completeCase.Uuid
        } catch (error) {
            return next(requestErrorCatcher(error, 'Setting'))
        }


        await db.purchaseorderModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        for (const purchaseorderstock of Stocks) {

            let amount = 0;
            let movements = await db.purchaseorderstockmovementModel.findAll({ where: { StockID: purchaseorderstock.Uuid } })
            for (const movement of movements) {
                amount += (movement.Amount * movement.Movementtype);
            }
            let foundedstock = await db.stockModel.findOne({
                where: {
                    Skt: purchaseorderstock.Skt,
                    Barcodeno: purchaseorderstock.Barcodeno,
                    StockdefineID: purchaseorderstock.StockdefineID,
                    DepartmentID: purchaseorderstock.DepartmentID,
                    WarehouseID: WarehouseID
                }
            })

            if (!foundedstock) {
                let newstockUuid = uuid()
                await db.stockModel.create({
                    Uuid: newstockUuid,
                    Barcodeno: purchaseorderstock.Barcodeno,
                    DepartmentID: purchaseorderstock.DepartmentID,
                    Info: purchaseorderstock.Info,
                    Skt: purchaseorderstock.Skt,
                    StockdefineID: purchaseorderstock.StockdefineID,
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

            let body = DataCleaner(purchaseorderstock)
            await db.purchaseorderstockModel.update({
                ...body,
                Status: 1,
                Updateduser: "System",
                Updatetime: new Date(),
            }, { where: { Uuid: purchaseorderstock.Uuid } }, { transaction: t })
        }
        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetPurchaseorders(req, res, next)
}

async function DeactivePurchaseorder(req, res, next) {

    let validationErrors = []
    const {
        Stocks,
        Info,
        Company,
        Username,
        Purchaseprice,
        Purchasenumber,
        Companypersonelname,
        Personelname,
        Purchasedate,
        WarehouseID,
        CaseID,
        Uuid
    } = req.body

    if (!validator.isArray(Stocks)) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKS_REQUIRED)
    }
    if (!validator.isString(Info)) {
        validationErrors.push(messages.VALIDATION_ERROR.INFO_REQUIRED)
    }
    if (!validator.isString(Company)) {
        validationErrors.push(messages.VALIDATION_ERROR.COMPANY_REQUIRED)
    }
    if (!validator.isString(Username)) {
        validationErrors.push(messages.VALIDATION_ERROR.USERNAME_REQUIRED)
    }
    if (!validator.isNumber(Purchaseprice)) {
        validationErrors.push(messages.VALIDATION_ERROR.PURHCASEPRICE_REQUIRED)
    }
    if (!validator.isString(Purchasenumber)) {
        validationErrors.push(messages.VALIDATION_ERROR.PURHCASENUMBER_REQUIRED)
    }
    if (!validator.isString(Companypersonelname)) {
        validationErrors.push(messages.VALIDATION_ERROR.COMPANYPERSONELNAME_REQUIRED)
    }
    if (!validator.isString(Personelname)) {
        validationErrors.push(messages.VALIDATION_ERROR.PERSONELNAME_REQUIRED)
    }
    if (!validator.isISODate(Purchasedate)) {
        validationErrors.push(messages.VALIDATION_ERROR.PURCHASEDATE_REQUIRED)
    }
    if (!validator.isString(WarehouseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.WAREHOUSEID_REQUIRED)
    }
    if (!validator.isString(CaseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.CASEID_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PURCHASEORDERID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PURCHASEORDERID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const purchaseorder = await db.purchaseorderModel.findOne({ where: { Uuid: Uuid } });
        if (!purchaseorder) {
            return next(createNotfounderror([messages.ERROR.PURCHASEORDER_NOT_FOUND], req.language))
        }
        if (!purchaseorder.Isactive) {
            return next(createNotfounderror([messages.ERROR.PURCHASEORDER_NOT_ACTIVE], req.language))
        }
        try {
            const caseresponse = await axios({
                method: 'GET',
                url: config.services.Setting + `Cases/GetDeactivateCase`,
                headers: {
                    session_key: config.session.secret
                }
            })
            let completeCase = caseresponse.data
            req.body.CaseID = completeCase.Uuid
        } catch (error) {
            return next(requestErrorCatcher(error, 'Setting'))
        }

        await db.purchaseorderModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        for (const purchaseorderstock of Stocks) {
            let body = DataCleaner(purchaseorderstock)
            await db.purchaseorderstockModel.update({
                ...body,
                Status: 3,
                Updateduser: "System",
                Updatetime: new Date(),
            }, { where: { Uuid: purchaseorderstock.Uuid } }, { transaction: t })
            let movements = await db.purchaseorderstockmovementModel.findAll({ where: { StockID: purchaseorderstock.Uuid } })
            for (const movement of movements) {
                await db.purchaseorderstockmovementModel.update({
                    ...movement,
                    Status: 3,
                    Updateduser: "System",
                    Updatetime: new Date(),
                }, { where: { Uuid: movement.Uuid } }, { transaction: t })
            }
        }
        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetPurchaseorders(req, res, next)
}

async function DeletePurchaseorder(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.purchaseorderId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PURCHASEORDERID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PURCHASEORDERID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const purchaseorder = await db.purchaseorderModel.findOne({ where: { Uuid: Uuid } })
        if (!purchaseorder) {
            return next(createNotfounderror([messages.ERROR.PURCHASEORDER_NOT_FOUND], req.language))
        }
        if (purchaseorder.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PURCHASEORDER_NOT_ACTIVE], req.language))
        }

        await db.purchaseorderModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetPurchaseorders(req, res, next)
}

function DataCleaner(data) {
    if (data.Id !== undefined) {
        delete data.Id;
    }
    if (data.Createduser !== undefined) {
        delete data.Createduser;
    }
    if (data.Createtime !== undefined) {
        delete data.Createtime;
    }
    if (data.Updateduser !== undefined) {
        delete data.Updateduser;
    }
    if (data.Updatetime !== undefined) {
        delete data.Updatetime;
    }
    if (data.Deleteduser !== undefined) {
        delete data.Deleteduser;
    }
    if (data.Deletetime !== undefined) {
        delete data.Deletetime;
    }
    return data
}


module.exports = {
    GetPurchaseorders,
    GetPurchaseorder,
    AddPurchaseorder,
    UpdatePurchaseorder,
    DeletePurchaseorder,
    CompletePurchaseorder,
    DeactivePurchaseorder
}