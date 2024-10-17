const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const { types, purchaseordermovementtypes } = require("../Constants/Defines")
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
        validationErrors.push(req.t('Purchaseorders.Error.PurchaseorderIDRequired'))
    }
    if (!validator.isUUID(req.params.purchaseorderId)) {
        validationErrors.push(req.t('Purchaseorders.Error.UnsupportedPurchaseorderID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Purchaseorders'), req.language))
    }

    try {
        const purchaseorder = await db.purchaseorderModel.findOne({ where: { Uuid: req.params.purchaseorderId } });
        if (!purchaseorder) {
            return next(createNotFoundError(req.t('Purchaseorders.Error.NotFound'), req.t('Purchaseorders'), req.language))
        }
        if (!purchaseorder.Isactive) {
            return next(createNotFoundError(req.t('Purchaseorders.Error.NotActive'), req.t('Purchaseorders'), req.language))
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
        validationErrors.push(req.t('Purchaseorders.Error.CompanyRequired'))
    }
    if (!validator.isString(CaseID)) {
        validationErrors.push(req.t('Purchaseorders.Error.CaseRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Purchaseorders'), req.language))
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
            Type: purchaseordermovementtypes.Create,
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
                validationErrors.push(req.t('Purchaseorders.Error.StockdefineRequired'))
            }
            if (!validator.isNumber(Type)) {
                validationErrors.push(req.t('Purchaseorders.Error.TypeRequired'))
            }
            if (!validator.isNumber(Number(Amount))) {
                validationErrors.push(req.t('Purchaseorders.Error.AmountRequired'))
            }

            if (validationErrors.length > 0) {
                return next(createValidationError(validationErrors, req.t('Purchaseorders'), req.language))
            }

            const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: StockdefineID } });
            const stocktype = await db.stocktypeModel.findOne({ where: { Uuid: stockdefine?.StocktypeID } });

            if (stocktype?.Issktneed) {
                if (!validator.isString(Skt)) {
                    return next(createValidationError(req.t('Purchaseorders.Error.SktRequired'), req.t('Purchaseorders'), req.language))
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
            type: types.Create,
            service: req.t('Purchaseorders'),
            role: 'purchaseordernotification',
            message: {
                tr: `${purchaseno} Satın Alma Talebi ${username} tarafından Oluşturuldu.`,
                en: `${purchaseno} Pruchase Order Created by ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Purchaseorders.Error.CompanyRequired'))
    }
    if (!validator.isString(CaseID)) {
        validationErrors.push(req.t('Purchaseorders.Error.CaseRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Purchaseorders.Error.PurchaseorderIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Purchaseorders.Error.UnsupportedPurchaseorderID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Purchaseorders'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const purchaseorder = await db.purchaseorderModel.findOne({ where: { Uuid: Uuid } });
        if (!purchaseorder) {
            return next(createNotFoundError(req.t('Purchaseorders.Error.NotFound'), req.t('Purchaseorders'), req.language))
        }
        if (!purchaseorder.Isactive) {
            return next(createNotFoundError(req.t('Purchaseorders.Error.NotActive'), req.t('Purchaseorders'), req.language))
        }

        await db.purchaseorderModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.purchaseordermovementModel.create({
            Uuid: uuid(),
            PurchaseorderID: Uuid,
            Type: purchaseordermovementtypes.Update,
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
                validationErrors.push(req.t('Purchaseorders.Error.StockdefineRequired'))
            }
            if (!validator.isNumber(Type)) {
                validationErrors.push(req.t('Purchaseorders.Error.TypeRequired'))
            }
            if (!validator.isNumber(Number(Amount))) {
                validationErrors.push(req.t('Purchaseorders.Error.AmountRequired'))
            }

            if (validationErrors.length > 0) {
                return next(createValidationError(validationErrors, req.t('Purchaseorders'), req.language))
            }

            const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: StockdefineID } });
            const stocktype = await db.stocktypeModel.findOne({ where: { Uuid: stockdefine?.StocktypeID } });

            if (stocktype?.Issktneed) {
                if (!validator.isString(Skt)) {
                    return next(createValidationError(req.t('Purchaseorders.Error.SktRequired'), req.t('Purchaseorders'), req.language))
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
            type: types.Update,
            service: req.t('Purchaseorders'),
            role: 'purchaseordernotification',
            message: {
                tr: `${purchaseorder?.Purchaseno} Satın Alma Talebi ${username} tarafından Güncelle.`,
                en: `${purchaseorder?.Purchaseno} Pruchase Order Updated by ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Purchaseorders.Error.PurchaseorderIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Purchaseorders.Error.UnsupportedPurchaseorderID'))
    }
    if (!validator.isUUID(CaseID)) {
        validationErrors.push(req.t('Purchaseorders.Error.CaseRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Purchaseorders'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const purchaseorder = await db.purchaseorderModel.findOne({ where: { Uuid: Uuid } })
        if (!purchaseorder) {
            return next(createNotFoundError(req.t('Purchaseorders.Error.NotFound'), req.t('Purchaseorders'), req.language))
        }
        if (purchaseorder.Isactive === false) {
            return next(createNotFoundError(req.t('Purchaseorders.Error.NotActive'), req.t('Purchaseorders'), req.language))
        }
        if (purchaseorder.Ischecked === true) {
            return next(createNotFoundError(req.t('Purchaseorders.Error.Checked'), req.t('Purchaseorders'), req.language))
        }
        if (purchaseorder.Isapproved === true) {
            return next(createNotFoundError(req.t('Purchaseorders.Error.Approved'), req.t('Purchaseorders'), req.language))
        }
        if (purchaseorder.Iscompleted === true) {
            return next(createNotFoundError(req.t('Purchaseorders.Error.Completed'), req.t('Purchaseorders'), req.language))
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
            validationErrors.push(req.t('Purchaseorders.Error.CompanyRequired'))
        }
        if (!validator.isString(Delivereruser)) {
            validationErrors.push(req.t('Purchaseorders.Error.DelivereruserRequired'))
        }
        if (!validator.isUUID(ReceiveruserID)) {
            validationErrors.push(req.t('Purchaseorders.Error.RevieveuserIDRequired'))
        }
        if (!validator.isNumber(Deliverytype)) {
            validationErrors.push(req.t('Purchaseorders.Error.DelivertypeRequired'))
        }
        if (!validator.isNumber(Price)) {
            validationErrors.push(req.t('Purchaseorders.Error.PriceRequired'))
        }
        if (Deliverytype === DELIVERY_TYPE_PATIENT) {
            if (!validator.isUUID(DeliverypatientID)) {
                validationErrors.push(req.t('Purchaseorders.Error.DeliveryPatientIDRequired'))
            }
        }
        if (Deliverytype === DELIVERY_TYPE_WAREHOUSE) {
            if (!validator.isUUID(DeliverywarehouseID)) {
                validationErrors.push(req.t('Purchaseorders.Error.DeliveryWarehouseIDRequired'))
            }
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Purchaseorders'), req.language))
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
            Type: purchaseordermovementtypes.Check,
            UserID: req?.identity?.user?.Uuid || username,
            Info: Checkinfo || '',
            Occureddate: new Date()
        }, { transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Purchaseorders'),
            role: 'purchaseordernotification',
            message: {
                tr: `${purchaseorder?.Purchaseno} Satın Alma Talebi ${username} tarafından Kontrol Edildi.`,
                en: `${purchaseorder?.Purchaseno} Pruchase Order Checked by ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Purchaseorders.Error.PurchaseorderIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Purchaseorders.Error.UnsupportedPurchaseorderID'))
    }
    if (!validator.isUUID(CaseID)) {
        validationErrors.push(req.t('Purchaseorders.Error.CaseRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Purchaseorders'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const purchaseorder = await db.purchaseorderModel.findOne({ where: { Uuid: Uuid } })
        if (!purchaseorder) {
            return next(createNotFoundError(req.t('Purchaseorders.Error.NotFound'), req.t('Purchaseorders'), req.language))
        }
        if (purchaseorder.Isactive === false) {
            return next(createNotFoundError(req.t('Purchaseorders.Error.NotActive'), req.t('Purchaseorders'), req.language))
        }
        if (purchaseorder.Ischecked === false) {
            return next(createNotFoundError(req.t('Purchaseorders.Error.NotChecked'), req.t('Purchaseorders'), req.language))
        }
        if (purchaseorder.Isapproved === true) {
            return next(createNotFoundError(req.t('Purchaseorders.Error.Approved'), req.t('Purchaseorders'), req.language))
        }
        if (purchaseorder.Iscompleted === true) {
            return next(createNotFoundError(req.t('Purchaseorders.Error.Completed'), req.t('Purchaseorders'), req.language))
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
            validationErrors.push(req.t('Purchaseorders.Error.CompanyRequired'))
        }
        if (!validator.isString(Delivereruser)) {
            validationErrors.push(req.t('Purchaseorders.Error.DelivereruserRequired'))
        }
        if (!validator.isUUID(ReceiveruserID)) {
            validationErrors.push(req.t('Purchaseorders.Error.RevieveuserIDRequired'))
        }
        if (!validator.isNumber(Deliverytype)) {
            validationErrors.push(req.t('Purchaseorders.Error.DelivertypeRequired'))
        }
        if (!validator.isNumber(Price)) {
            validationErrors.push(req.t('Purchaseorders.Error.PriceRequired'))
        }
        if (Deliverytype === DELIVERY_TYPE_PATIENT) {
            if (!validator.isUUID(DeliverypatientID)) {
                validationErrors.push(req.t('Purchaseorders.Error.DeliveryPatientIDRequired'))
            }
        }
        if (Deliverytype === DELIVERY_TYPE_WAREHOUSE) {
            if (!validator.isUUID(DeliverywarehouseID)) {
                validationErrors.push(req.t('Purchaseorders.Error.DeliveryWarehouseIDRequired'))
            }
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Purchaseorders'), req.language))
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
            Type: purchaseordermovementtypes.Approve,
            UserID: req?.identity?.user?.Uuid || username,
            Info: Approveinfo || '',
            Occureddate: new Date(),
        }, { transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Purchaseorders'),
            role: 'purchaseordernotification',
            message: {
                tr: `${purchaseorder?.Purchaseno} Satın Alma Talebi ${username} tarafından Onaylandı.`,
                en: `${purchaseorder?.Purchaseno} Pruchase Order Approved by ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Purchaseorders.Error.PurchaseorderIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Purchaseorders.Error.UnsupportedPurchaseorderID'))
    }
    if (!validator.isUUID(CaseID)) {
        validationErrors.push(req.t('Purchaseorders.Error.CaseRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Purchaseorders'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        const purchaseorder = await db.purchaseorderModel.findOne({ where: { Uuid: Uuid } })
        if (!purchaseorder) {
            return next(createNotFoundError(req.t('Purchaseorders.Error.NotFound'), req.t('Purchaseorders'), req.language))
        }
        if (purchaseorder.Isactive === false) {
            return next(createNotFoundError(req.t('Purchaseorders.Error.NotActive'), req.t('Purchaseorders'), req.language))
        }
        if (purchaseorder.Ischecked === false) {
            return next(createNotFoundError(req.t('Purchaseorders.Error.NotChecked'), req.t('Purchaseorders'), req.language))
        }
        if (purchaseorder.Isapproved === false) {
            return next(createNotFoundError(req.t('Purchaseorders.Error.NotApproved'), req.t('Purchaseorders'), req.language))
        }
        if (purchaseorder.Iscompleted === true) {
            return next(createNotFoundError(req.t('Purchaseorders.Error.Completed'), req.t('Purchaseorders'), req.language))
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
            validationErrors.push(req.t('Purchaseorders.Error.CompanyRequired'))
        }
        if (!validator.isString(Delivereruser)) {
            validationErrors.push(req.t('Purchaseorders.Error.DelivereruserRequired'))
        }
        if (!validator.isUUID(ReceiveruserID)) {
            validationErrors.push(req.t('Purchaseorders.Error.RevieveuserIDRequired'))
        }
        if (!validator.isNumber(Deliverytype)) {
            validationErrors.push(req.t('Purchaseorders.Error.DelivertypeRequired'))
        }
        if (!validator.isNumber(Price)) {
            validationErrors.push(req.t('Purchaseorders.Error.PriceRequired'))
        }
        if (Deliverytype === DELIVERY_TYPE_PATIENT) {
            if (!validator.isUUID(DeliverypatientID)) {
                validationErrors.push(req.t('Purchaseorders.Error.DeliveryPatientIDRequired'))
            }
        }
        if (Deliverytype === DELIVERY_TYPE_WAREHOUSE) {
            if (!validator.isUUID(DeliverywarehouseID)) {
                validationErrors.push(req.t('Purchaseorders.Error.DeliveryWarehouseIDRequired'))
            }
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Purchaseorders'), req.language))
        }

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
            Type: purchaseordermovementtypes.Complete,
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
            type: types.Update,
            service: req.t('Purchaseorders'),
            role: 'purchaseordernotification',
            message: {
                tr: `${purchaseorder?.Purchaseno} Satın Alma Talebi ${username} tarafından Tamamlandı.`,
                en: `${purchaseorder?.Purchaseno} Pruchase Order Completed by ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Purchaseorders.Error.PurchaseorderIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Purchaseorders.Error.UnsupportedPurchaseorderID'))
    }
    if (!validator.isUUID(CaseID)) {
        validationErrors.push(req.t('Purchaseorders.Error.CaseRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Purchaseorders'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const purchaseorder = await db.purchaseorderModel.findOne({ where: { Uuid: Uuid } })
        if (!purchaseorder) {
            return next(createNotFoundError(req.t('Purchaseorders.Error.NotFound'), req.t('Purchaseorders'), req.language))
        }
        if (purchaseorder.Isactive === false) {
            return next(createNotFoundError(req.t('Purchaseorders.Error.NotActive'), req.t('Purchaseorders'), req.language))
        }
        if (purchaseorder.Ischecked === false) {
            return next(createNotFoundError(req.t('Purchaseorders.Error.NotChecked'), req.t('Purchaseorders'), req.language))
        }
        if (purchaseorder.Isapproved === true) {
            return next(createNotFoundError(req.t('Purchaseorders.Error.Approved'), req.t('Purchaseorders'), req.language))
        }
        if (purchaseorder.Iscompleted === true) {
            return next(createNotFoundError(req.t('Purchaseorders.Error.Completed'), req.t('Purchaseorders'), req.language))
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
            Type: purchaseordermovementtypes.Cancelcheck,
            UserID: req?.identity?.user?.Uuid || username,
            Info: Cancelcheckinfo || '',
            Occureddate: new Date()
        }, { transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Purchaseorders'),
            role: 'purchaseordernotification',
            message: {
                tr: `${purchaseorder?.Purchaseno} Satın Alma Talebi ${username} tarafından Kontrol İptali Yapıldı.`,
                en: `${purchaseorder?.Purchaseno} Pruchase Order Cancel Checked by ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Purchaseorders.Error.PurchaseorderIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Purchaseorders.Error.UnsupportedPurchaseorderID'))
    }
    if (!validator.isUUID(CaseID)) {
        validationErrors.push(req.t('Purchaseorders.Error.CaseRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Purchaseorders'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const purchaseorder = await db.purchaseorderModel.findOne({ where: { Uuid: Uuid } })
        if (!purchaseorder) {
            return next(createNotFoundError(req.t('Purchaseorders.Error.NotFound'), req.t('Purchaseorders'), req.language))
        }
        if (purchaseorder.Isactive === false) {
            return next(createNotFoundError(req.t('Purchaseorders.Error.NotActive'), req.t('Purchaseorders'), req.language))
        }
        if (purchaseorder.Ischecked === false) {
            return next(createNotFoundError(req.t('Purchaseorders.Error.NotChecked'), req.t('Purchaseorders'), req.language))
        }
        if (purchaseorder.Isapproved === false) {
            return next(createNotFoundError(req.t('Purchaseorders.Error.NotApproved'), req.t('Purchaseorders'), req.language))
        }
        if (purchaseorder.Iscompleted === true) {
            return next(createNotFoundError(req.t('Purchaseorders.Error.Completed'), req.t('Purchaseorders'), req.language))
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
            Type: purchaseordermovementtypes.Cancelapprove,
            UserID: req?.identity?.user?.Uuid || username,
            Info: Cancelapproveinfo || '',
            Occureddate: new Date(),
        }, { transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Purchaseorders'),
            role: 'purchaseordernotification',
            message: {
                tr: `${purchaseorder?.Purchaseno} Satın Alma Talebi ${username} tarafından Onay İptali Yapıldı.`,
                en: `${purchaseorder?.Purchaseno} Pruchase Order Cancel Approved by ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Purchaseorders.Error.PurchaseorderIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Purchaseorders.Error.UnsupportedPurchaseorderID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Purchaseorders'), req.language))
    }

    const username = req?.identity?.user?.Username || 'System'
    const t = await db.sequelize.transaction();
    try {
        const purchaseorder = await db.purchaseorderModel.findOne({ where: { Uuid: Uuid } })
        if (!purchaseorder) {
            return next(createNotFoundError(req.t('Purchaseorders.Error.NotFound'), req.t('Purchaseorders'), req.language))
        }
        if (purchaseorder.Isactive === false) {
            return next(createNotFoundError(req.t('Purchaseorders.Error.NotActive'), req.t('Purchaseorders'), req.language))
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
            type: types.Delete,
            service: req.t('Purchaseorders'),
            role: 'purchaseordernotification',
            message: {
                tr: `${purchaseorder?.Purchaseno} Satın Alma Talebi ${username} tarafından Silindi.`,
                en: `${purchaseorder?.Purchaseno} Pruchase Order Deleted by ${username}`
            }[req.language],
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