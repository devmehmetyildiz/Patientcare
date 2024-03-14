const config = require("../Config")
const { types } = require("../Constants/Defines")
const messages = require("../Constants/Messages")
const CreateNotification = require("../Utilities/CreateNotification")
const DoGet = require("../Utilities/DoGet")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')

async function GetPatientstockmovements(req, res, next) {
    try {
        const patientstockmovements = await db.patientstockmovementModel.findAll({ where: { Isactive: true } })
        res.status(200).json(patientstockmovements)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPatientstockmovement(req, res, next) {

    let validationErrors = []
    if (!req.params.stockmovementId) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKMOVEMENTID_REQUIRED)
    }
    if (!validator.isUUID(req.params.stockmovementId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKMOVEMENTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const patientstockmovement = await db.patientstockmovementModel.findOne({ where: { Uuid: req.params.stockmovementId } });
        if (!patientstockmovement) {
            return next(createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language))
        }
        if (!patientstockmovement.Isactive) {
            return next(createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language))
        }
        res.status(200).json(patientstockmovement)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddPatientstockmovement(req, res, next) {

    let validationErrors = []
    const {
        StockID,
        Movementtype,
        Amount,
        Prevvalue,
        Newvalue,
        Movementdate,
    } = req.body

    if (!validator.isUUID(StockID)) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKID_REQUIRED)
    }
    if (!validator.isNumber(Movementtype)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTTYPE_REQUIRED)
    }
    if (!validator.isNumber(Amount)) {
        validationErrors.push(messages.VALIDATION_ERROR.AMOUNT_REQUIRED)
    }
    if (!validator.isNumber(Prevvalue)) {
        validationErrors.push(messages.VALIDATION_ERROR.PREVVALUE_REQUIRED)
    }
    if (!validator.isNumber(Newvalue)) {
        validationErrors.push(messages.VALIDATION_ERROR.NEWVALUE_REQUIRED)
    }
    if (!validator.isISODate(Movementdate)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTDATE_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let stockmovementuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        let amount = 0.0;
        let movements = await db.patientstockmovementModel.findAll({ where: { StockID: StockID } })
        movements.forEach(movement => {
            amount += (movement.Amount * movement.Movementtype);
        });
        await db.patientstockmovementModel.create({
            ...req.body,
            Prevvalue: amount,
            Newvalue: Amount + amount,
            Uuid: stockmovementuuid,
            Createduser: username,
            Createtime: new Date(),
            Isapproved: false,
            Isactive: true
        }, { transaction: t })

        const patientstock = await db.patientstockModel.findOne({ where: { Uuid: StockID } });
        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: patientstock?.StockdefineID } });
        const patient = await DoGet(config.services.Business, `Patients/${patientstock?.PatientID}`)
        const patientdefine = await DoGet(config.services.Business, `Patientdefines/${patient?.PatientdefineID}`)
        const unit = await DoGet(config.services.Setting, `Units/${stockdefine?.UnitID}`)

        await CreateNotification({
            type: types.Create,
            service: 'Hasta Stok Hareketleri',
            role: 'patientstockmovementnotification',
            message: `${Amount} ${unit?.Name} ${stockdefine?.Name} ürünü ${patientdefine?.Firstname} ${patientdefine?.Lastname} hastasının stoklarına ${username} tarafından eklendi.`,
            pushurl: '/Patientstockmovements'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetPatientstockmovements(req, res, next)
}

async function UpdatePatientstockmovement(req, res, next) {

    let validationErrors = []
    const {
        StockID,
        Movementtype,
        Amount,
        Prevvalue,
        Newvalue,
        Movementdate,
        Uuid
    } = req.body

    if (!validator.isUUID(StockID)) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKID_REQUIRED)
    }
    if (!validator.isNumber(Movementtype)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTTYPE_REQUIRED)
    }
    if (!validator.isNumber(Amount)) {
        validationErrors.push(messages.VALIDATION_ERROR.AMOUNT_REQUIRED)
    }
    if (!validator.isNumber(Prevvalue)) {
        validationErrors.push(messages.VALIDATION_ERROR.PREVVALUE_REQUIRED)
    }
    if (!validator.isNumber(Newvalue)) {
        validationErrors.push(messages.VALIDATION_ERROR.NEWVALUE_REQUIRED)
    }
    if (!validator.isISODate(Movementdate)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTDATE_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKMOVEMENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKMOVEMENTID)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patientstockmovement = await db.patientstockmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!patientstockmovement) {
            return next(createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_FOUND], req.language))
        }
        if (patientstockmovement.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language))
        }

        await db.patientstockmovementModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        const patientstock = await db.patientstockModel.findOne({ where: { Uuid: StockID } });
        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: patientstock?.StockdefineID } });
        const patient = await DoGet(config.services.Business, `Patients/${patientstock?.PatientID}`)
        const patientdefine = await DoGet(config.services.Business, `Patientdefines/${patient?.PatientdefineID}`)

        await CreateNotification({
            type: types.Update,
            service: 'Hasta Stok Hareketleri',
            role: 'patientstockmovementnotification',
            message: `${patientdefine?.Firstname} ${patientdefine?.Lastname} hastasının ${stockdefine?.Name} ürününe ait hareket ${username} tarafından güncellendi.`,
            pushurl: '/Patientstockmovements'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPatientstockmovements(req, res, next)
}

async function ApprovePatientstockmovement(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.stockmovementId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKMOVEMENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKMOVEMENTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patientstockmovement = await db.patientstockmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!patientstockmovement) {
            return next(createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_FOUND], req.language))
        }
        if (patientstockmovement.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language))
        }

        await db.patientstockmovementModel.update({
            ...patientstockmovement,
            Isapproved: true,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        const patientstock = await db.patientstockModel.findOne({ where: { Uuid: patientstockmovement?.StockID } });
        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: patientstock?.StockdefineID } });
        const patient = await DoGet(config.services.Business, `Patients/${patientstock?.PatientID}`)
        const patientdefine = await DoGet(config.services.Business, `Patientdefines/${patient?.PatientdefineID}`)

        await CreateNotification({
            type: types.Update,
            service: 'Hasta Stok Hareketleri',
            role: 'patientstockmovementnotification',
            message: `${patientdefine?.Firstname} ${patientdefine?.Lastname} hastasının ${stockdefine?.Name} ürününe ait hareket ${username} tarafından onaylandı.`,
            pushurl: '/Patientstockmovements'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPatientstockmovements(req, res, next)
}

async function ApprovePatientstockmovements(req, res, next) {

    let validationErrors = []
    const body = req.body

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        for (const data of (body || [])) {
            if (!data) {
                validationErrors.push(messages.VALIDATION_ERROR.STOCKMOVEMENTID_REQUIRED)
            }
            if (!validator.isUUID(data)) {
                validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKMOVEMENTID)
            }
            if (validationErrors.length > 0) {
                return next(createValidationError(validationErrors, req.language))
            }
            const patientstockmovement = await db.patientstockmovementModel.findOne({ where: { Uuid: data } })
            if (!patientstockmovement) {
                return next(createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_FOUND], req.language))
            }
            if (patientstockmovement.Isactive === false) {
                return next(createAccessDenied([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language))
            }

            await db.patientstockmovementModel.update({
                ...patientstockmovement,
                Isapproved: true,
                Updateduser: username,
                Updatetime: new Date(),
            }, { where: { Uuid: data } }, { transaction: t })
        }

        await CreateNotification({
            type: types.Update,
            service: 'Hasta Stok Hareketleri',
            role: 'patientstockmovementnotification',
            message: `Toplu ürünler ${username} tarafından onaylandı.`,
            pushurl: '/Patientstockmovements'
        })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetPatientstockmovements(req, res, next)
}

async function DeletePatientstockmovement(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.stockmovementId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.STOCKMOVEMENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STOCKMOVEMENTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patientstockmovement = await db.patientstockmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!patientstockmovement) {
            return next(createNotfounderror([messages.ERROR.STOCKMOVEMENT_NOT_FOUND], req.language))
        }
        if (patientstockmovement.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STOCKMOVEMENT_NOT_ACTIVE], req.language))
        }

        await db.patientstockmovementModel.destroy({ where: { Uuid: Uuid }, transaction: t });

        const patientstock = await db.patientstockModel.findOne({ where: { Uuid: patientstockmovement?.StockID } });
        const stockdefine = await db.stockdefineModel.findOne({ where: { Uuid: patientstock?.StockdefineID } });
        const patient = await DoGet(config.services.Business, `Patients/${patientstock?.PatientID}`)
        const patientdefine = await DoGet(config.services.Business, `Patientdefines/${patient?.PatientdefineID}`)

        await CreateNotification({
            type: types.Delete,
            service: 'Hasta Stok Hareketleri',
            role: 'patientstockmovementnotification',
            message: `${patientdefine?.Firstname} ${patientdefine?.Lastname} hastasının ${stockdefine?.Name} ürününe ait hareket ${username} tarafından Silindi.`,
            pushurl: '/Patientstockmovements'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetPatientstockmovements(req, res, next)
}

module.exports = {
    GetPatientstockmovements,
    GetPatientstockmovement,
    AddPatientstockmovement,
    UpdatePatientstockmovement,
    DeletePatientstockmovement,
    ApprovePatientstockmovement,
    ApprovePatientstockmovements
}