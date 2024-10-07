const config = require("../Config")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const DoGet = require("../Utilities/DoGet")
const { types } = require('../Constants/Purchaseordermovementypes')
const { types: notificationtypes } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const DELIVERY_TYPE_PATIENT = 0
const DELIVERY_TYPE_WAREHOUSE = 1

async function GetPurchaseorders(req, res, next) {
    try {
        let data = null
        const purchaseorders = await db.purchaseorderModel.findAll()
        for (const purchaseorder of purchaseorders) {
            purchaseorder.Movements = await db.purchaseordermovementModel.findAll({ where: { PurchaseorderID: purchaseorder?.Uuid } });
        }
        if (req?.Uuid) {
            data = await db.purchaseorderModel.findOne({ where: { Uuid: req?.Uuid } });
        }
        res.status(200).json({ list: purchaseorders, data: data })
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
        res.status(200).json(purchaseorder)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddPurchaseorder(req, res, next) {

    let validationErrors = []
    const {
        Company,
        CaseID,
        Stocks
    } = req.body

    if (!validator.isString(Company)) {
        validationErrors.push(messages.VALIDATION_ERROR.COMPANY_REQUIRED)
    }
    if (!validator.isString(CaseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.CASEID_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let purchaseorderuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        const purchaseno = await Findnumeratorvalue();

        await db.purchaseordernumeratorModel.create({
            Purchaseordervalue: purchaseno,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await db.purchaseorderModel.create({
            ...req.body,
            Uuid: purchaseorderuuid,
            Purchaseno: purchaseno,
            CreateduserID: req?.identity?.user?.Uuid || username,
            Purchasecreatetime: new Date(),
            Isopened: true,
            Ischecked: false,
            Isapproved: false,
            Iscompleted: false,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await db.purchaseordermovementModel.create({
            Uuid: uuid(),
            PurchaseorderID: purchaseorderuuid,
            Type: types.Create,
            UserID: req?.identity?.user?.Uuid || username,
            Info: req?.body?.Info || '',
            Occureddate: new Date(),
        }, { transaction: t })

        for (const stock of Stocks) {
            let stockuuid = uuid()

            const {
                StockdefineID,
                Type,
                Amount,
                Skt
            } = stock

            if (!validator.isUUID(StockdefineID)) {
                validationErrors.push(messages.VALIDATION_ERROR.STOCKDEFINEID_REQUIRED)
            }
            if (!validator.isNumber(Type)) {
                validationErrors.push(messages.VALIDATION_ERROR.TYPE_REQUIRED)
            }
            if (!validator.isNumber(Number(Amount))) {
                validationErrors.push(messages.VALIDATION_ERROR.AMOUNT_REQUIRED)
            }

            if (validationErrors.length > 0) {
                return next(createValidationError(validationErrors, req.language))
            }

            const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: StockdefineID } });
            const stocktype = await db.stocktypeModel.findOne({ where: { Uuid: stockdefine?.StocktypeID } });

            if (stocktype?.Issktneed) {
                if (!validator.isString(Skt)) {
                    next(createValidationError([messages.VALIDATION_ERROR.SKT_REQUIRED], req.language))
                }
            }

            await db.stockModel.create({
                ...stock,
                Uuid: stockuuid,
                WarehouseID: purchaseorderuuid,
                Createduser: username,
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
        }

        await CreateNotification({
            type: notificationtypes.Create,
            service: messages.NOTIFICATION.PAGE_NAME,
            role: 'purchaseordernotification',
            message: {
                tr: `${purchaseno} Numaralı, Satın Alma Talebi ${username} Tarafından Oluşturuldu.`,
                en: `${purchaseno} Purhcaseorder, Created By ${username} `
            },
            pushurl: '/Purchaseorders'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    req.Uuid = purchaseorderuuid
    GetPurchaseorders(req, res, next)
}

async function UpdatePurchaseorder(req, res, next) {

    let validationErrors = []
    const {
        Company,
        CaseID,
        Stocks,
        Uuid
    } = req.body

    if (!validator.isString(Company)) {
        validationErrors.push(messages.VALIDATION_ERROR.COMPANY_REQUIRED)
    }
    if (!validator.isString(CaseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.CASEID_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PURCHASEORDERID)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.PURCHASEORDERID_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

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
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.purchaseordermovementModel.create({
            Uuid: uuid(),
            PurchaseorderID: Uuid,
            Type: types.Update,
            UserID: req?.identity?.user?.Uuid || username,
            Info: req?.body?.Info || '',
            Occureddate: new Date(),
        }, { transaction: t })

        await db.stockModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { WarehouseID: Uuid }, transaction: t })

        for (const stock of Stocks) {
            let stockuuid = uuid()

            const {
                StockdefineID,
                Type,
                Amount,
                Skt
            } = stock

            if (!validator.isUUID(StockdefineID)) {
                validationErrors.push(messages.VALIDATION_ERROR.STOCKDEFINEID_REQUIRED)
            }
            if (!validator.isNumber(Type)) {
                validationErrors.push(messages.VALIDATION_ERROR.TYPE_REQUIRED)
            }
            if (!validator.isNumber(Number(Amount))) {
                validationErrors.push(messages.VALIDATION_ERROR.AMOUNT_REQUIRED)
            }

            if (validationErrors.length > 0) {
                return next(createValidationError(validationErrors, req.language))
            }

            const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: StockdefineID } });
            const stocktype = await db.stocktypeModel.findOne({ where: { Uuid: stockdefine?.StocktypeID } });

            if (stocktype?.Issktneed) {
                if (!validator.isString(Skt)) {
                    next(createValidationError([messages.VALIDATION_ERROR.SKT_REQUIRED], req.language))
                }
            }

            await db.stockModel.create({
                ...stock,
                Uuid: stockuuid,
                WarehouseID: Uuid,
                Createduser: username,
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
        }

        await CreateNotification({
            type: notificationtypes.Update,
            service: messages.NOTIFICATION.PAGE_NAME,
            role: 'purchaseordernotification',
            message: {
                tr: `${purchaseorder?.Purchaseno} Numaralı, Satın Alma Talebi ${username} Tarafından Güncellendi.`,
                en: `${purchaseorder?.Purchaseno} Purhcaseorder, Updated By ${username} `
            },
            pushurl: '/Purchaseorders'
        })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    req.Uuid = Uuid
    GetPurchaseorders(req, res, next)
}

async function CheckPurchaseorder(req, res, next) {

    let validationErrors = []

    const {
        Uuid,
        CaseID,
        Checkinfo
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PURCHASEORDERID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PURCHASEORDERID)
    }
    if (!validator.isUUID(CaseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.CASEID_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const purchaseorder = await db.purchaseorderModel.findOne({ where: { Uuid: Uuid } })
        if (!purchaseorder) {
            return next(createNotfounderror([messages.ERROR.PURCHASEORDER_NOT_FOUND], req.language))
        }
        if (purchaseorder.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PURCHASEORDER_NOT_ACTIVE], req.language))
        }
        if (purchaseorder.Ischecked === true) {
            return next(createAccessDenied([messages.ERROR.PURCHASEORDER_IS_CHECKED], req.language))
        }
        if (purchaseorder.Isapproved === true) {
            return next(createAccessDenied([messages.ERROR.PURCHASEORDER_IS_APPROVED], req.language))
        }
        if (purchaseorder.Iscompleted === true) {
            return next(createAccessDenied([messages.ERROR.PURCHASEORDER_IS_COMPLETED], req.language))
        }

        const {
            Company,
            Delivereruser,
            ReceiveruserID,
            Deliverytype,
            DeliverypatientID,
            DeliverywarehouseID,
            Price,
        } = purchaseorder

        if (!validator.isString(Company)) {
            validationErrors.push(messages.VALIDATION_ERROR.COMPANY_REQUIRED)
        }
        if (!validator.isString(Delivereruser)) {
            validationErrors.push(messages.VALIDATION_ERROR.DELIVERERUSER_REQUIRED)
        }
        if (!validator.isUUID(ReceiveruserID)) {
            validationErrors.push(messages.VALIDATION_ERROR.RECEIVERUSERID_REQUIRED)
        }
        if (!validator.isNumber(Deliverytype)) {
            validationErrors.push(messages.VALIDATION_ERROR.DELIVERYTYPE_REQUIRED)
        }
        if (!validator.isNumber(Price)) {
            validationErrors.push(messages.VALIDATION_ERROR.PRICE_REQUIRED)
        }
        if (Deliverytype === DELIVERY_TYPE_PATIENT) {
            if (!validator.isUUID(DeliverypatientID)) {
                validationErrors.push(messages.VALIDATION_ERROR.DELIVERYPATIENTID_REQUIRED)
            }
        }
        if (Deliverytype === DELIVERY_TYPE_WAREHOUSE) {
            if (!validator.isUUID(DeliverywarehouseID)) {
                validationErrors.push(messages.VALIDATION_ERROR.DELIVERYWAREHOUSEID_REQUIRED)
            }
        }

        await db.purchaseorderModel.update({
            ...purchaseorder,
            CaseID: CaseID,
            Purchasechecktime: new Date(),
            CheckeduserID: req?.identity?.user?.Uuid || username,
            Isopened: true,
            Ischecked: true,
            Isapproved: false,
            Iscompleted: false,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.purchaseordermovementModel.create({
            Uuid: uuid(),
            PurchaseorderID: Uuid,
            Type: types.Check,
            UserID: req?.identity?.user?.Uuid || username,
            Info: Checkinfo || '',
            Occureddate: new Date()
        }, { transaction: t })

        await CreateNotification({
            type: notificationtypes.Update,
            service: messages.NOTIFICATION.PAGE_NAME,
            role: 'purchaseordernotification',
            message: {
                tr: `${purchaseorder?.Purchaseno} Numaralı, Satın Alma Talebi ${username} Tarafından Kontrol Edildi.`,
                en: `${purchaseorder?.Purchaseno} Purhcaseorder, Checked By ${username} `
            },
            pushurl: '/Purchaseorders'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    req.Uuid = Uuid
    GetPurchaseorders(req, res, next)
}

async function ApprovePurchaseorder(req, res, next) {

    let validationErrors = []

    const {
        Uuid,
        Approveinfo,
        CaseID
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PURCHASEORDERID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PURCHASEORDERID)
    }
    if (!validator.isUUID(CaseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.CASEID_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const purchaseorder = await db.purchaseorderModel.findOne({ where: { Uuid: Uuid } })
        if (!purchaseorder) {
            return next(createNotfounderror([messages.ERROR.PURCHASEORDER_NOT_FOUND], req.language))
        }
        if (purchaseorder.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PURCHASEORDER_NOT_ACTIVE], req.language))
        }
        if (purchaseorder.Ischecked === false) {
            return next(createAccessDenied([messages.ERROR.PURCHASEORDER_NOT_CHECKED], req.language))
        }
        if (purchaseorder.Isapproved === true) {
            return next(createAccessDenied([messages.ERROR.PURCHASEORDER_IS_APPROVED], req.language))
        }
        if (purchaseorder.Iscompleted === true) {
            return next(createAccessDenied([messages.ERROR.PURCHASEORDER_IS_COMPLETED], req.language))
        }

        const {
            Company,
            Delivereruser,
            ReceiveruserID,
            Deliverytype,
            DeliverypatientID,
            DeliverywarehouseID,
            Price,
        } = purchaseorder

        if (!validator.isString(Company)) {
            validationErrors.push(messages.VALIDATION_ERROR.COMPANY_REQUIRED)
        }
        if (!validator.isString(Delivereruser)) {
            validationErrors.push(messages.VALIDATION_ERROR.DELIVERERUSER_REQUIRED)
        }
        if (!validator.isUUID(ReceiveruserID)) {
            validationErrors.push(messages.VALIDATION_ERROR.RECEIVERUSERID_REQUIRED)
        }
        if (!validator.isNumber(Deliverytype)) {
            validationErrors.push(messages.VALIDATION_ERROR.DELIVERYTYPE_REQUIRED)
        }
        if (!validator.isNumber(Price)) {
            validationErrors.push(messages.VALIDATION_ERROR.PRICE_REQUIRED)
        }
        if (Deliverytype === DELIVERY_TYPE_PATIENT) {
            if (!validator.isUUID(DeliverypatientID)) {
                validationErrors.push(messages.VALIDATION_ERROR.DELIVERYPATIENTID_REQUIRED)
            }
        }
        if (Deliverytype === DELIVERY_TYPE_WAREHOUSE) {
            if (!validator.isUUID(DeliverywarehouseID)) {
                validationErrors.push(messages.VALIDATION_ERROR.DELIVERYWAREHOUSEID_REQUIRED)
            }
        }
        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.language))
        }

        await db.purchaseorderModel.update({
            ...purchaseorder,
            CaseID: CaseID,
            Purchaseapprovetime: new Date(),
            ApproveduserID: req?.identity?.user?.Uuid || username,
            Isopened: true,
            Ischecked: true,
            Isapproved: true,
            Iscompleted: false,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.purchaseordermovementModel.create({
            Uuid: uuid(),
            PurchaseorderID: Uuid,
            Type: types.Approve,
            UserID: req?.identity?.user?.Uuid || username,
            Info: Approveinfo || '',
            Occureddate: new Date(),
        }, { transaction: t })

        await CreateNotification({
            type: notificationtypes.Update,
            service: messages.NOTIFICATION.PAGE_NAME,
            role: 'purchaseordernotification',
            message: {
                tr: `${purchaseorder?.Purchaseno} Numaralı, Satın Alma Talebi ${username} Tarafından Onaylandı.`,
                en: `${purchaseorder?.Purchaseno} Purhcaseorder, Approved By ${username} `
            },
            pushurl: '/Purchaseorders'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    req.Uuid = Uuid
    GetPurchaseorders(req, res, next)
}

async function CompletePurchaseorder(req, res, next) {

    let validationErrors = []

    const {
        Uuid,
        Completeinfo,
        CaseID
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PURCHASEORDERID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PURCHASEORDERID)
    }
    if (!validator.isUUID(CaseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.CASEID_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        const purchaseorder = await db.purchaseorderModel.findOne({ where: { Uuid: Uuid } })
        if (!purchaseorder) {
            return next(createNotfounderror([messages.ERROR.PURCHASEORDER_NOT_FOUND], req.language))
        }
        if (purchaseorder.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PURCHASEORDER_NOT_ACTIVE], req.language))
        }
        if (purchaseorder.Ischecked === false) {
            return next(createAccessDenied([messages.ERROR.PURCHASEORDER_NOT_CHECKED], req.language))
        }
        if (purchaseorder.Isapproved === false) {
            return next(createAccessDenied([messages.ERROR.PURCHASEORDER_NOT_APPROVED], req.language))
        }
        if (purchaseorder.Iscompleted === true) {
            return next(createAccessDenied([messages.ERROR.PURCHASEORDER_IS_COMPLETED], req.language))
        }

        const {
            Company,
            Delivereruser,
            ReceiveruserID,
            Deliverytype,
            DeliverypatientID,
            DeliverywarehouseID,
            Price,
        } = purchaseorder

        if (!validator.isString(Company)) {
            validationErrors.push(messages.VALIDATION_ERROR.COMPANY_REQUIRED)
        }
        if (!validator.isString(Delivereruser)) {
            validationErrors.push(messages.VALIDATION_ERROR.DELIVERERUSER_REQUIRED)
        }
        if (!validator.isUUID(ReceiveruserID)) {
            validationErrors.push(messages.VALIDATION_ERROR.RECEIVERUSERID_REQUIRED)
        }

        if (!validator.isNumber(Deliverytype)) {
            validationErrors.push(messages.VALIDATION_ERROR.DELIVERYTYPE_REQUIRED)
        }
        if (!validator.isNumber(Price)) {
            validationErrors.push(messages.VALIDATION_ERROR.PRICE_REQUIRED)
        }
        if (Deliverytype === DELIVERY_TYPE_PATIENT) {
            if (!validator.isUUID(DeliverypatientID)) {
                validationErrors.push(messages.VALIDATION_ERROR.DELIVERYPATIENTID_REQUIRED)
            }
        }
        if (Deliverytype === DELIVERY_TYPE_WAREHOUSE) {
            if (!validator.isUUID(DeliverywarehouseID)) {
                validationErrors.push(messages.VALIDATION_ERROR.DELIVERYWAREHOUSEID_REQUIRED)
            }
        }
        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.language))
        }

        const cases = await DoGet(config.services.Setting, `Cases`)


        await db.purchaseorderModel.update({
            ...purchaseorder,
            Purchasecompletetime: new Date(),
            CompleteduserID: req?.identity?.user?.Uuid || username,
            CaseID: CaseID,
            Isopened: true,
            Ischecked: true,
            Isapproved: true,
            Iscompleted: true,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.purchaseordermovementModel.create({
            Uuid: uuid(),
            PurchaseorderID: Uuid,
            Type: types.Complete,
            UserID: req?.identity?.user?.Uuid || username,
            Info: Completeinfo || '',
            Occureddate: new Date(),
        }, { transaction: t })

        let stockparentId = null;
        let stockType = null
        if (Deliverytype === DELIVERY_TYPE_PATIENT) {
            stockparentId = DeliverypatientID
            stockType = 2
        }
        if (Deliverytype === DELIVERY_TYPE_WAREHOUSE) {
            stockparentId = DeliverywarehouseID
            stockType = 0
        }

        const Stocks = await db.stockModel.findAll({ where: { WarehouseID: Uuid } });

        for (const stock of Stocks) {
            let stockuuid = uuid()

            await db.stockModel.create({
                Uuid: stockuuid,
                Order: 0,
                WarehouseID: stockparentId,
                Type: stockType,
                StocktypeID: stock.StocktypeID,
                StockgrouptypeID: stock.StockgrouptypeID,
                StockdefineID: stock.StockdefineID,
                Isapproved: true,
                Isdeactivated: false,
                Deactivateinfo: "",
                Skt: stock.Skt,
                Info: stock.Info,
                Iscompleted: true,
                Createduser: username,
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })

            await db.stockmovementModel.create({
                Uuid: uuid(),
                StockID: stockuuid,
                Amount: stock?.Amount || 0,
                Movementdate: new Date(),
                Movementtype: 1,
                Isapproved: true,
                Createduser: username,
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
        }

        await CreateNotification({
            type: notificationtypes.Update,
            service: messages.NOTIFICATION.PAGE_NAME,
            role: 'purchaseordernotification',
            message: {
                tr: `${purchaseorder?.Purchaseno} Numaralı, Satın Alma Talebi ${username} Tarafından Completed.`,
                en: `${purchaseorder?.Purchaseno} Purhcaseorder, Completed By ${username} `
            },
            pushurl: '/Purchaseorders'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    req.Uuid = Uuid
    GetPurchaseorders(req, res, next)
}

async function CancelCheckPurchaseorder(req, res, next) {

    let validationErrors = []

    const {
        Uuid,
        CaseID,
        Cancelcheckinfo
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PURCHASEORDERID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PURCHASEORDERID)
    }
    if (!validator.isUUID(CaseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.CASEID_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const purchaseorder = await db.purchaseorderModel.findOne({ where: { Uuid: Uuid } })
        if (!purchaseorder) {
            return next(createNotfounderror([messages.ERROR.PURCHASEORDER_NOT_FOUND], req.language))
        }
        if (purchaseorder.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PURCHASEORDER_NOT_ACTIVE], req.language))
        }
        if (purchaseorder.Ischecked === false) {
            return next(createAccessDenied([messages.ERROR.PURCHASEORDER_IS_CHECKED], req.language))
        }
        if (purchaseorder.Isapproved === true) {
            return next(createAccessDenied([messages.ERROR.PURCHASEORDER_IS_APPROVED], req.language))
        }
        if (purchaseorder.Iscompleted === true) {
            return next(createAccessDenied([messages.ERROR.PURCHASEORDER_IS_COMPLETED], req.language))
        }

        await db.purchaseorderModel.update({
            ...purchaseorder,
            CaseID: CaseID,
            Purchasechecktime: new Date(),
            CheckeduserID: req?.identity?.user?.Uuid || username,
            Isopened: true,
            Ischecked: false,
            Isapproved: false,
            Iscompleted: false,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.purchaseordermovementModel.create({
            Uuid: uuid(),
            PurchaseorderID: Uuid,
            Type: types.Cancelcheck,
            UserID: req?.identity?.user?.Uuid || username,
            Info: Cancelcheckinfo || '',
            Occureddate: new Date()
        }, { transaction: t })

        await CreateNotification({
            type: notificationtypes.Update,
            service: messages.NOTIFICATION.PAGE_NAME,
            role: 'purchaseordernotification',
            message: {
                tr: `${purchaseorder?.Purchaseno} Numaralı, Satın Alma Talebi Kontrolü ${username} Tarafından İptal Edildi.`,
                en: `${purchaseorder?.Purchaseno} Purhcaseorder Check, Cancelled By ${username} `
            },
            pushurl: '/Purchaseorders'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }

    req.Uuid = Uuid
    GetPurchaseorders(req, res, next)
}

async function CancelApprovePurchaseorder(req, res, next) {

    let validationErrors = []

    const {
        Uuid,
        Cancelapproveinfo,
        CaseID
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PURCHASEORDERID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PURCHASEORDERID)
    }
    if (!validator.isUUID(CaseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.CASEID_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const purchaseorder = await db.purchaseorderModel.findOne({ where: { Uuid: Uuid } })
        if (!purchaseorder) {
            return next(createNotfounderror([messages.ERROR.PURCHASEORDER_NOT_FOUND], req.language))
        }
        if (purchaseorder.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PURCHASEORDER_NOT_ACTIVE], req.language))
        }
        if (purchaseorder.Ischecked === false) {
            return next(createAccessDenied([messages.ERROR.PURCHASEORDER_NOT_CHECKED], req.language))
        }
        if (purchaseorder.Isapproved === false) {
            return next(createAccessDenied([messages.ERROR.PURCHASEORDER_IS_APPROVED], req.language))
        }
        if (purchaseorder.Iscompleted === true) {
            return next(createAccessDenied([messages.ERROR.PURCHASEORDER_IS_COMPLETED], req.language))
        }

        await db.purchaseorderModel.update({
            ...purchaseorder,
            CaseID: CaseID,
            Purchaseapprovetime: new Date(),
            ApproveduserID: req?.identity?.user?.Uuid || username,
            Isopened: true,
            Ischecked: true,
            Isapproved: false,
            Iscompleted: false,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.purchaseordermovementModel.create({
            Uuid: uuid(),
            PurchaseorderID: Uuid,
            Type: types.Cancelapprove,
            UserID: req?.identity?.user?.Uuid || username,
            Info: Cancelapproveinfo || '',
            Occureddate: new Date(),
        }, { transaction: t })

        await CreateNotification({
            type: notificationtypes.Update,
            service: messages.NOTIFICATION.PAGE_NAME,
            role: 'purchaseordernotification',
            message: {
                tr: `${purchaseorder?.Purchaseno} Numaralı, Satın Alma Talebi Onayı ${username} Tarafından İptal Edildi.`,
                en: `${purchaseorder?.Purchaseno} Purhcaseorder Approve, Cancelled By ${username} `
            },
            pushurl: '/Purchaseorders'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    req.Uuid = Uuid
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

    const username = req?.identity?.user?.Username || 'System'
    const t = await db.sequelize.transaction();
    try {
        const purchaseorder = await db.purchaseorderModel.findOne({ where: { Uuid: Uuid } })
        if (!purchaseorder) {
            return next(createNotfounderror([messages.ERROR.PURCHASEORDER_NOT_FOUND], req.language))
        }
        if (purchaseorder.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PURCHASEORDER_NOT_ACTIVE], req.language))
        }

        await db.purchaseorderModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.purchaseordermovementModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { PurchaseorderID: Uuid }, transaction: t })

        await db.stockModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { WarehouseID: Uuid }, transaction: t })

        await CreateNotification({
            type: notificationtypes.Delete,
            service: messages.NOTIFICATION.PAGE_NAME,
            role: 'purchaseordernotification',
            message: {
                tr: `${purchaseorder?.Purchaseno} Numaralı, Satın Alma Talebi ${username} Tarafından Silindi.`,
                en: `${purchaseorder?.Purchaseno} Purhcaseorder, Deleted By ${username} `
            },
            pushurl: '/Purchaseorders'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    req.Uuid = Uuid
    GetPurchaseorders(req, res, next)
}

async function Findnumeratorvalue() {

    function zeroPad(number, length) {
        return number.toString().padStart(length, '0');
    }

    function getStartnumerator() {
        const currentDate = new Date()
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()
        const numeratorValue = zeroPad(1, 4)
        return `${year}-${month}-${numeratorValue}`
    }

    const current = await db.purchaseordernumeratorModel.findOne({
        order: [['Id', 'DESC']],
    });

    if (!current) {
        return getStartnumerator()
    }

    const currentValues = (current?.Purchaseordervalue || '').split('-')

    if (currentValues.length !== 3) {
        return getStartnumerator()
    }

    const currentYear = currentValues[0]
    const currentMonth = currentValues[1]
    const currentValue = currentValues[2]

    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    if (currentYear !== year.toString()) {
        return getStartnumerator()
    }
    if (currentMonth !== month.toString()) {
        return getStartnumerator()
    }
    if (!validator.isNumber(Number(currentValue))) {
        return getStartnumerator()
    }

    const currentNumerator = Number(currentValue)
    const newValue = currentNumerator + 1

    return `${currentYear}-${currentMonth}-${zeroPad(newValue, 4)}`
}


module.exports = {
    GetPurchaseorders,
    GetPurchaseorder,
    AddPurchaseorder,
    UpdatePurchaseorder,
    DeletePurchaseorder,
    CheckPurchaseorder,
    ApprovePurchaseorder,
    CompletePurchaseorder,
    CancelCheckPurchaseorder,
    CancelApprovePurchaseorder
}

const messages = {
    NOTIFICATION: {
        PAGE_NAME: {
            en: 'Purchase Orders',
            tr: 'Satın Almalar',
        },
    },
    ERROR: {
        PURCHASEORDER_NOT_FOUND: {
            code: 'PURCHASEORDER_NOT_FOUND', description: {
                en: 'Purchase order not found',
                tr: 'Satın alma bulunamadı',
            }
        },
        PURCHASEORDER_NOT_ACTIVE: {
            code: 'PURCHASEORDER_NOT_ACTIVE', description: {
                en: 'Purchase order not active',
                tr: 'Satın alma aktif değil',
            }
        },
        PURCHASEORDER_NOT_CHECKED: {
            code: 'PURCHASEORDER_NOT_CHECKED', description: {
                en: 'Purchase order not checked',
                tr: 'Satın alma aktif kontrol edilmemiş',
            }
        },
        PURCHASEORDER_NOT_APPROVED: {
            code: 'PURCHASEORDER_NOT_APPROVED', description: {
                en: 'Purchase order not approved',
                tr: 'Satın alma aktif onaylanmamış',
            }
        },
        PURCHASEORDER_IS_COMPLETED: {
            code: 'PURCHASEORDER_IS_COMPLETED', description: {
                en: 'Purchase order is completed',
                tr: 'Satın alma tamamlanmış',
            }
        },
        PURCHASEORDER_IS_APPROVED: {
            code: 'PURCHASEORDER_IS_APPROVED', description: {
                en: 'Purchase order is approved',
                tr: 'Satın alma onaylanmış',
            }
        },
        PURCHASEORDER_IS_CHECKED: {
            code: 'PURCHASEORDER_IS_CHECKED', description: {
                en: 'Purchase order is checked',
                tr: 'Satın alma kontrol edilmiş',
            }
        },
    },
    VALIDATION_ERROR: {
        DELIVERYWAREHOUSEID_REQUIRED: {
            code: 'DELIVERYWAREHOUSEID_REQUIRED', description: {
                en: 'The Delivery warehouse ID required',
                tr: 'Bu işlem için Teslim Edilecek Ambar gerekli',
            }
        },
        DELIVERYPATIENTID_REQUIRED: {
            code: 'DELIVERYPATIENTID_REQUIRED', description: {
                en: 'The Delivery patient ID required',
                tr: 'Bu işlem için Teslim Edilecek Hasta gerekli',
            }
        },
        DELIVERERUSER_REQUIRED: {
            code: 'DELIVERERUSER_REQUIRED', description: {
                en: 'The Deliverer user required',
                tr: 'Bu işlem için Teslim Eden Personel gerekli',
            }
        },
        DELIVERYTYPE_REQUIRED: {
            code: 'DELIVERYTYPE_REQUIRED', description: {
                en: 'The Delivery type required',
                tr: 'Bu işlem için Teslim Türü gerekli',
            }
        },
        RECEIVERUSERID_REQUIRED: {
            code: 'RECEIVERUSERID_REQUIRED', description: {
                en: 'The Receiver user ID required',
                tr: 'Bu işlem için Teslim Alan Personel gerekli',
            }
        },
        COMPANY_REQUIRED: {
            code: 'COMPANY_REQUIRED', description: {
                en: 'The company required',
                tr: 'Bu işlem için firma gerekli',
            }
        },
        AMOUNT_REQUIRED: {
            code: 'AMOUNT_REQUIRED', description: {
                en: 'The amount required',
                tr: 'Bu işlem için miktar gerekli',
            }
        },
        PRICE_REQUIRED: {
            code: 'PRICE_REQUIRED', description: {
                en: 'The price required',
                tr: 'Bu işlem için ücret gerekli',
            }
        },
        CASEID_REQUIRED: {
            code: 'CASEID_REQUIRED', description: {
                en: 'The case id required',
                tr: 'Bu işlem için durum gerekli',
            }
        },
        STOCKDEFINEID_REQUIRED: {
            code: 'STOCKDEFINEID_REQUIRED', description: {
                en: 'The stock define id required',
                tr: 'Bu işlem için stok tanımı gerekli',
            }
        },
        SKT_REQUIRED: {
            code: 'SKT_REQUIRED', description: {
                en: 'The skt required',
                tr: 'Bu işlem için skt gerekli',
            }
        },
        TYPE_REQUIRED: {
            code: 'TYPE_REQUIRED', description: {
                en: 'The type required',
                tr: 'Bu işlem için stok türü gerekli',
            }
        },
        PURCHASEORDERID_REQUIRED: {
            code: 'PURCHASEORDERID_REQUIRED', description: {
                en: 'The purchaseorderid required',
                tr: 'Bu işlem için satın alma id gerekli',
            }
        },
        UNSUPPORTED_PURCHASEORDERID: {
            code: 'UNSUPPORTED_PURCHASEORDERID', description: {
                en: 'The purchaseorderid is unsupported',
                tr: 'geçersiz satın alma id si',
            }
        },
    }

}
