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
        sequelizeErrorCatcher(error)
        next()
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
        sequelizeErrorCatcher(error)
        next()
    }
}


async function AddPeriod(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Occuredtime,
        Checktime
    } = req.body

    if (!Name || !validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
    }
    if (!Occuredtime || !validator.isString(Occuredtime)) {
        validationErrors.push(messages.VALIDATION_ERROR.OCCUREDTIME_REQUIRED, req.language)
    }
    if (!Checktime || !validator.isString(Checktime)) {
        validationErrors.push(messages.VALIDATION_ERROR.CHECKTIME_REQUIRED, req.language)
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
        const createdPeriod = await db.periodModel.findOne({ where: { Uuid: perioduuid } })
        res.status(200).json(createdPeriod)
    } catch (err) {
        await t.rollback()
        sequelizeErrorCatcher(err)
        next()
    }
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
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
    }
    if (!Occuredtime || !validator.isString(Occuredtime)) {
        validationErrors.push(messages.VALIDATION_ERROR.OCCUREDTIME_REQUIRED, req.language)
    }
    if (!Checktime || !validator.isString(Checktime)) {
        validationErrors.push(messages.VALIDATION_ERROR.CHECKTIME_REQUIRED, req.language)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PERIODID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PERIODID, req.language)
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

        await db.periodModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await t.commit()
        const updatedPeriod = await db.periodModel.findOne({ where: { Uuid: Uuid } })
        res.status(200).json(updatedPeriod)
    } catch (error) {
        sequelizeErrorCatcher(error)
        next()
    }


}

async function DeletePeriod(req, res, next) {

    let validationErrors = []
    const {
        Uuid
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PERIODID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PERIODID, req.language)
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

        res.status(200).json({ messages: "deleted", Uuid: Uuid })
    } catch (error) {
        await t.rollback();
        sequelizeErrorCatcher(error)
        next()
    }

}

module.exports = {
    GetPeriods,
    GetPeriod,
    AddPeriod,
    UpdatePeriod,
    DeletePeriod,
}