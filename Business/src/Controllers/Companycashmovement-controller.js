const config = require("../Config")
const { types } = require("../Constants/Defines")
const messages = require("../Constants/Messages")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')

async function GetCompanycashmovements(req, res, next) {
    try {
        const companycashmovements = await db.companycashmovementModel.findAll({ where: { Isactive: true } })
        res.status(200).json(companycashmovements)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetCompanycashmovement(req, res, next) {

    let validationErrors = []
    if (!req.params.movementId) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTID_REQUIRED)
    }
    if (!validator.isUUID(req.params.movementId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_MOVEMENTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const companycashmovement = await db.companycashmovementModel.findOne({ where: { Uuid: req.params.movementId } });
        res.status(200).json(companycashmovement)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}


async function AddCompanycashmovement(req, res, next) {

    let validationErrors = []
    const {
        Movementtype,
        Movementvalue,
        ReportID,
    } = req.body


    if (!validator.isNumber(Movementtype)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTTYPE_REQUIRED)
    }
    if (!validator.isString(ReportID)) {
        validationErrors.push(messages.VALIDATION_ERROR.REPORTID_REQUIRED)
    }


    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let movementuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.companycashmovementModel.create({
            ...req.body,
            Uuid: movementuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: 'Kurum Kasası',
            role: 'companycashmovementnotification',
            message: `${Movementvalue || 0} TL hasta kasasına ${username} tarafından Eklendi.`,
            pushurl: '/Companycashmovements'
        })
        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetCompanycashmovements(req, res, next)
}

async function UpdateCompanycashmovement(req, res, next) {

    let validationErrors = []
    const {
        Movementtype,
        Movementvalue,
        ReportID,
        Uuid
    } = req.body


    if (!validator.isNumber(Movementtype)) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTTYPE_REQUIRED)
    }
    if (!validator.isString(ReportID)) {
        validationErrors.push(messages.VALIDATION_ERROR.REPORTID_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_MOVEMENTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const companycashmovement = await db.companycashmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!companycashmovement) {
            return next(createNotfounderror([messages.ERROR.MOVEMENT_NOT_FOUND], req.language))
        }
        if (companycashmovement.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.MOVEMENT_NOT_ACTIVE], req.language))
        }

        await db.companycashmovementModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Kurum Kasası',
            role: 'companycashmovementnotification',
            message: `Kurum kasasındaki ${companycashmovement?.Movementvalue} TL ,  ${Movementvalue || 0} TL olarak ${username} tarafından Güncellendi.`,
            pushurl: '/Companycashmovements'
        })
        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetCompanycashmovements(req, res, next)

}

async function DeleteCompanycashmovement(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.movementId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.MOVEMENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_MOVEMENTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const companycashmovement = await db.companycashmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!companycashmovement) {
            return next(createNotfounderror([messages.ERROR.MOVEMENT_NOT_FOUND], req.language))
        }
        if (companycashmovement.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.MOVEMENT_NOT_ACTIVE], req.language))
        }

        await db.companycashmovementModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: 'Kurum Kasası',
            role: 'companycashmovementnotification',
            message: `Kurum kasasındaki ${companycashmovement?.Movementvalue} TL ${username} tarafından Silindi.`,
            pushurl: '/Companycashmovements'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetCompanycashmovements(req, res, next)
}

module.exports = {
    GetCompanycashmovements,
    GetCompanycashmovement,
    AddCompanycashmovement,
    UpdateCompanycashmovement,
    DeleteCompanycashmovement,
}