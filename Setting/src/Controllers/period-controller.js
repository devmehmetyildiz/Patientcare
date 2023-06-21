const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetPeriods(req, res, next) {
    try {
        const periods = await db.periodModel.findAll({ where: { Isactive: true } })
        res.status(200).json(periods)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPeriod(req, res, next) {

    let validationErrors = []
    if (!req.params.periodId) {
        validationErrors.push(messages.VALIDATION_ERROR.PERIODID_REQUIRED)
    }
    if (!validator.isUUID(req.params.periodId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PERIODID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const period = await db.periodModel.findOne({ where: { Uuid: req.params.periodId } });
        res.status(200).json(period)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddPeriod(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Occuredtime,
        Checktime
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isString(Occuredtime)) {
        validationErrors.push(messages.VALIDATION_ERROR.OCCUREDTIME_REQUIRED)
    }
    if (!validator.isString(Checktime)) {
        validationErrors.push(messages.VALIDATION_ERROR.CHECKTIME_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let perioduuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.periodModel.create({
            ...req.body,
            Uuid: perioduuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetPeriods(req, res, next)
}

async function UpdatePeriod(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Uuid,
        Occuredtime,
        Checktime
    } = req.body

    if (!Name || !validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!Occuredtime || !validator.isString(Occuredtime)) {
        validationErrors.push(messages.VALIDATION_ERROR.OCCUREDTIME_REQUIRED)
    }
    if (!Checktime || !validator.isString(Checktime)) {
        validationErrors.push(messages.VALIDATION_ERROR.CHECKTIME_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PERIODID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PERIODID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const period = db.periodModel.findOne({ where: { Uuid: Uuid } })
        if (!period) {
            return next(createNotfounderror([messages.ERROR.PERIOD_NOT_FOUND], req.language))
        }
        if (period.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PERIOD_NOT_ACTIVE], req.language))
        }

        await db.periodModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPeriods(req, res, next)
}

async function DeletePeriod(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.periodId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PERIODID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PERIODID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const period = db.periodModel.findOne({ where: { Uuid: Uuid } })
        if (!period) {
            return next(createNotfounderror([messages.ERROR.PERIOD_NOT_FOUND], req.language))
        }
        if (period.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PERIOD_NOT_ACTIVE], req.language))
        }
        const t = await db.sequelize.transaction();

        await db.periodModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetPeriods(req, res, next)
}

module.exports = {
    GetPeriods,
    GetPeriod,
    AddPeriod,
    UpdatePeriod,
    DeletePeriod,
}