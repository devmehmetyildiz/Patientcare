const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

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
        validationErrors.push(req.t('Companycashmovements.Error.CompanycashmovementIDRequired'))
    }
    if (!validator.isUUID(req.params.movementId)) {
        validationErrors.push(req.t('Companycashmovements.Error.UnsupportedCompanycashmovementID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Companycashmovements'), req.language))
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
        validationErrors.push(req.t('Companycashmovements.Error.MovementtypeRequired'))
    }
    if (!validator.isString(ReportID)) {
        validationErrors.push(req.t('Companycashmovements.Error.ReportIDRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Companycashmovements'), req.language))
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
            service: req.t('Companycashmovements'),
            role: 'companycashmovementnotification',
            message: {
                tr: `${Movementvalue} Değerinde Kurum Para Hareketi ${username} tarafından Oluşturuldu.`,
                en: `${Movementvalue} Value CompanyCashMovement Created By ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Companycashmovements.Error.MovementtypeRequired'))
    }
    if (!validator.isString(ReportID)) {
        validationErrors.push(req.t('Companycashmovements.Error.ReportIDRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Companycashmovements.Error.CompanycashmovementIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Companycashmovements.Error.UnsupportedCompanycashmovementID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Companycashmovements'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const companycashmovement = await db.companycashmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!companycashmovement) {
            return next(createNotFoundError(req.t('Companycashmovements.Error.NotFound'), req.t('Companycashmovements'), req.language))
        }
        if (companycashmovement.Isactive === false) {
            return next(createNotFoundError(req.t('Companycashmovements.Error.NotActive'), req.t('Companycashmovements'), req.language))
        }

        await db.companycashmovementModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Companycashmovements'),
            role: 'companycashmovementnotification',
            message: {
                tr: `${Movementvalue} Değerinde Kurum Para Hareketi ${username} tarafından Güncellendi.`,
                en: `${Movementvalue} Value CompanyCashMovement Updated By ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Companycashmovements.Error.CompanycashmovementIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Companycashmovements.Error.UnsupportedCompanycashmovementID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Companycashmovements'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const companycashmovement = await db.companycashmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!companycashmovement) {
            return next(createNotFoundError(req.t('Companycashmovements.Error.NotFound'), req.t('Companycashmovements'), req.language))
        }
        if (companycashmovement.Isactive === false) {
            return next(createNotFoundError(req.t('Companycashmovements.Error.NotActive'), req.t('Companycashmovements'), req.language))
        }

        await db.companycashmovementModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Companycashmovements'),
            role: 'companycashmovementnotification',
            message: {
                tr: `${companycashmovement?.Movementvalue} Değerinde Kurum Para Hareketi ${username} tarafından Silindi.`,
                en: `${companycashmovement?.Movementvalue} Value CompanyCashMovement Deleted By ${username}`
            }[req.language],
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