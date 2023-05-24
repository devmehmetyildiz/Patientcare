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
            let perioduuids = await db.checkperiodperiodModel.findAll({
                where: {
                    CheckperiodID: checkperiod.Uuid,
                }
            });
            checkperiod.Periods = await db.periodModel.findAll({
                where: {
                    Uuid: perioduuids.map(u => { return u.PeriodID })
                }
            })
        }
        res.status(200).json(checkperiods)
    } catch (error) {
        sequelizeErrorCatcher(error)
        next()
    }
}

async function GetCheckperiod(req, res, next) {

    let validationErrors = []
    if (!req.params.CheckperiodId) {
        validationErrors.push(messages.VALIDATION_ERROR.CHECKPERIODID_REQUIRED)
    }
    if (!validator.isUUID(req.params.CheckperiodId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_CHECKPERIODID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const checkperiod = await db.checkperiodModel.findOne({ where: { Uuid: req.params.CheckperiodId } });
        if (!checkperiod) {
            return createNotfounderror([messages.ERROR.CHECKPERIOD_NOT_FOUND], req.language)
        }
        if (!checkperiod.Isactive) {
            return createNotfounderror([messages.ERROR.CHECKPERIOD_NOT_ACTIVE], req.language)
        }
        let perioduuids = await db.checkperiodperiodModel.findAll({
            where: {
                CheckperiodID: checkperioduuid,
            }
        });
        checkperiod.Periods = await db.periodModel.findAll({
            where: {
                Uuid: perioduuids.map(u => { return u.PeriodID })
            }
        })
        res.status(200).json(checkperiod)
    } catch (error) {
        sequelizeErrorCatcher(error)
        next()
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
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
    }
    if (!validator.isNumber(Periodtype)) {
        validationErrors.push(messages.VALIDATION_ERROR.PERIODTYPE_REQUIRED, req.language)
    }
    if (!validator.isString(Occureddays)) {
        validationErrors.push(messages.VALIDATION_ERROR.OCCUREDDAYS_REQUIRED, req.language)
    }
    if (!validator.isArray(Periods)) {
        validationErrors.push(messages.VALIDATION_ERROR.PERIODS_REQUIRED, req.language)
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
        const createdCheckperiod = await db.checkperiodModel.findOne({ where: { Uuid: checkperioduuid } })
        let perioduuids = await db.checkperiodperiodModel.findAll({
            where: {
                CheckperiodID: checkperioduuid,
            }
        });
        createdCheckperiod.Periods = await db.periodModel.findAll({
            where: {
                Uuid: perioduuids.map(u => { return u.PeriodID })
            }
        })
        res.status(200).json(createdCheckperiod)
    } catch (err) {
        await t.rollback()
        sequelizeErrorCatcher(err)
        next()
    }
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
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
    }
    if (!validator.isNumber(Periodtype)) {
        validationErrors.push(messages.VALIDATION_ERROR.PERIODTYPE_REQUIRED, req.language)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.CHECKPERIODID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_CHECKPERIODID, req.language)
    }
    if (!validator.isString(Occureddays)) {
        validationErrors.push(messages.VALIDATION_ERROR.OCCUREDDAYS_REQUIRED, req.language)
    }
    if (!validator.isArray(Periods)) {
        validationErrors.push(messages.VALIDATION_ERROR.PERIODS_REQUIRED, req.language)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const checkperiod = db.checkperiodModel.findOne({ where: { Uuid: Uuid } })
        if (!checkperiod) {
            return next(createNotfounderror([messages.ERROR.CHECKPERIOD_NOT_FOUND], req.language))
        }
        if (checkperiod.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.CHECKPERIOD_NOT_ACTIVE], req.language))
        }

        const t = await db.sequelize.transaction();

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
        const updatedCheckperiod = await db.checkperiodModel.findOne({ where: { Uuid: Uuid } })
        let perioduuids = await db.checkperiodperiodModel.findAll({
            where: {
                CheckperiodID: Uuid,
            }
        });
        updatedCheckperiod.Periods = await db.periodModel.findAll({
            where: {
                Uuid: perioduuids.map(u => { return u.PeriodID })
            }
        })
        res.status(200).json(updatedCheckperiod)
    } catch (error) {
        sequelizeErrorCatcher(error)
        next()
    }


}

async function DeleteCheckperiod(req, res, next) {

    let validationErrors = []
    const {
        Uuid
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.CHECKPERIODID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_CHECKPERIODID, req.language)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const checkperiod = db.checkperiodModel.findOne({ where: { Uuid: Uuid } })
        if (!checkperiod) {
            return next(createNotfounderror([messages.ERROR.CHECKPERIOD_NOT_FOUND], req.language))
        }
        if (checkperiod.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.CHECKPERIOD_NOT_ACTIVE], req.language))
        }
        const t = await db.sequelize.transaction();

        await db.checkperiodperiodModel.destroy({ where: { CheckperiodID: Uuid }, transaction: t });
        await db.checkperiodModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();

        res.status(200).json({ messages: "deleted", Uuid: Uuid })
    } catch (error) {
        await t.rollback();
        sequelizeErrorCatcher(error)
        next()
    }

}


module.exports = {
    GetCheckperiods,
    GetCheckperiod,
    AddCheckperiod,
    UpdateCheckperiod,
    DeleteCheckperiod,
}