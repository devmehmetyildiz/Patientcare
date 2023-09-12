const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetCheckperiods(req, res, next) {
    try {
        const checkperiods = await db.checkperiodModel.findAll({ where: { Isactive: true } })
        for (const checkperiod of checkperiods) {
            checkperiod.Perioduuids = await db.checkperiodperiodModel.findAll({
                where: {
                    CheckperiodID: checkperiod.Uuid,
                },
                attributes: ['PeriodID']
            });
        }
        res.status(200).json(checkperiods)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetCheckperiod(req, res, next) {

    let validationErrors = []
    if (!req.params.checkperiodId) {
        validationErrors.push(messages.VALIDATION_ERROR.CHECKPERIODID_REQUIRED)
    }
    if (!validator.isUUID(req.params.checkperiodId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_CHECKPERIODID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const checkperiod = await db.checkperiodModel.findOne({ where: { Uuid: req.params.checkperiodId } });
        if (!checkperiod) {
            return createNotfounderror([messages.ERROR.CHECKPERIOD_NOT_FOUND])
        }
        if (!checkperiod.Isactive) {
            return createNotfounderror([messages.ERROR.CHECKPERIOD_NOT_ACTIVE])
        }
        checkperiod.Perioduuids = await db.checkperiodperiodModel.findAll({
            where: {
                CheckperiodID: checkperiod.Uuid,
            },
            attributes: ['PeriodID']
        });
        res.status(200).json(checkperiod)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}


async function AddCheckperiod(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Periodtype,
        Occureddays,
        Periods
    } = req.body
    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isNumber(Periodtype)) {
        validationErrors.push(messages.VALIDATION_ERROR.PERIODTYPE_REQUIRED)
    }
    if (!validator.isString(Occureddays)) {
        validationErrors.push(messages.VALIDATION_ERROR.OCCUREDDAYS_REQUIRED)
    }
    if (!validator.isArray(Periods)) {
        validationErrors.push(messages.VALIDATION_ERROR.PERIODS_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let checkperioduuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.checkperiodModel.create({
            ...req.body,
            Uuid: checkperioduuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        for (const period of Periods) {
            if (!period.Uuid || !validator.isUUID(period.Uuid)) {
                return next(createValidationError(messages.VALIDATION_ERROR.UNSUPPORTED_PERIODID, req.language))
            }
            await db.checkperiodperiodModel.create({
                CheckperiodID: checkperioduuid,
                PeriodID: period.Uuid
            }, { transaction: t });
        }

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetCheckperiods(req, res, next)
}

async function UpdateCheckperiod(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Periodtype,
        Occureddays,
        Uuid,
        Periods
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isNumber(Periodtype)) {
        validationErrors.push(messages.VALIDATION_ERROR.PERIODTYPE_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.CHECKPERIODID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_CHECKPERIODID)
    }
    if (!validator.isString(Occureddays)) {
        validationErrors.push(messages.VALIDATION_ERROR.OCCUREDDAYS_REQUIRED)
    }
    if (!validator.isArray(Periods)) {
        validationErrors.push(messages.VALIDATION_ERROR.PERIODS_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const checkperiod = db.checkperiodModel.findOne({ where: { Uuid: Uuid } })
        if (!checkperiod) {
            return next(createNotfounderror([messages.ERROR.CHECKPERIOD_NOT_FOUND], req.language))
        }
        if (checkperiod.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.CHECKPERIOD_NOT_ACTIVE], req.language))
        }


        await db.checkperiodModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await db.checkperiodperiodModel.destroy({ where: { CheckperiodID: Uuid }, transaction: t });
        for (const period of Periods) {
            if (!period.Uuid || !validator.isUUID(period.Uuid)) {
                return next(createValidationError(messages.VALIDATION_ERROR.UNSUPPORTED_PERIODID, req.language))
            }
            await db.checkperiodperiodModel.create({
                CheckperiodID: Uuid,
                PeriodID: period.Uuid
            }, { transaction: t });
        }

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetCheckperiods(req, res, next)

}

async function DeleteCheckperiod(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.checkperiodId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.CHECKPERIODID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_CHECKPERIODID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const checkperiod = db.checkperiodModel.findOne({ where: { Uuid: Uuid } })
        if (!checkperiod) {
            return next(createNotfounderror([messages.ERROR.CHECKPERIOD_NOT_FOUND], req.language))
        }
        if (checkperiod.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.CHECKPERIOD_NOT_ACTIVE], req.language))
        }

        await db.checkperiodperiodModel.destroy({ where: { CheckperiodID: Uuid }, transaction: t });
        await db.checkperiodModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetCheckperiods(req, res, next)
}


module.exports = {
    GetCheckperiods,
    GetCheckperiod,
    AddCheckperiod,
    UpdateCheckperiod,
    DeleteCheckperiod,
}