const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetPeriods(req, res, next) {
    try {
        const periods = await db.periodModel.findAll()
        res.status(200).json(periods)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPeriod(req, res, next) {

    let validationErrors = []
    if (!req.params.periodId) {
        validationErrors.push(req.t('Periods.Error.PeriodIDRequired'))
    }
    if (!validator.isUUID(req.params.periodId)) {
        validationErrors.push(req.t('Periods.Error.UnsupportedPeriodID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Periods'), req.language))
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
        validationErrors.push(req.t('Periods.Error.NameRequired'))
    }
    if (!validator.isString(Occuredtime)) {
        validationErrors.push(req.t('Periods.Error.OccuredtimeRequired'))
    }
    if (!validator.isString(Checktime)) {
        validationErrors.push(req.t('Periods.Error.ChecktimeRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Periods'), req.language))
    }

    let perioduuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.periodModel.create({
            ...req.body,
            Uuid: perioduuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: req.t('Periods'),
            role: 'periodnotification',
            message: {
                en: `${Name} Period Created By ${username}.`,
                tr: `${Name} Periyodu ${username} Tarafından Oluşturuldu.`
            }[req.language],
            pushurl: '/Periods'
        })
        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetPeriods(req, res, next)
}

async function FastcreatePeriod(req, res, next) {
    let validationErrors = []
    const {
        Formatstringstart,
        Formatstringend,
        Starttime,
        Endtime,
        Period,
        Checktime
    } = req.body

    const timePattern = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

    if (!timePattern.test(Starttime)) {
        validationErrors.push(req.t('Periods.Error.StarttimeRequired'))
    }
    if (!timePattern.test(Endtime)) {
        validationErrors.push(req.t('Periods.Error.EndtimeRequired'))
    }
    if (!timePattern.test(Checktime)) {
        validationErrors.push(req.t('Periods.Error.ChecktimeRequired'))
    }
    if (!validator.isNumber(parseInt(Period)) || parseInt(Period) >= 61 || parseInt(Period) < 1) {
        validationErrors.push(req.t('Periods.Error.OccuredtimeRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Periods'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const parseTime = (timeStr) => {
            const [hours, minutes] = timeStr.split(':').map(Number);
            const currentDate = new Date();
            currentDate.setHours(hours);
            currentDate.setMinutes(minutes);
            currentDate.setSeconds(0);
            currentDate.setMilliseconds(0);
            return currentDate;
        };

        const startTime = parseTime(Starttime);
        const endTime = parseTime(Endtime);
        const period = parseInt(Period);

        let currentTime = startTime;

        while (currentTime < endTime) {
            let perioduuid = uuid()
            const formattedTime = `${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`;
            await db.periodModel.create({
                Name: `${Formatstringstart || ''} ${formattedTime} ${Formatstringend || ''}`,
                Occuredtime: formattedTime,
                Checktime: Checktime,
                Uuid: perioduuid,
                Createduser: username,
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
            const nextTime = new Date(currentTime.getTime() + period * 60000);
            currentTime = nextTime <= endTime ? nextTime : endTime;
        }

        await CreateNotification({
            type: types.Create,
            service: req.t('Periods'),
            role: 'periodnotification',
            message: {
                tr: `Periyotlar ${username} Tarafından Hızlı Şekilde Oluşturuldu.`,
                en: `Periods Fast Created By ${username}.`
            }[req.language],
            pushurl: '/Periods'
        })
        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
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
        validationErrors.push(req.t('Periods.Error.NameRequired'))
    }
    if (!Occuredtime || !validator.isString(Occuredtime)) {
        validationErrors.push(req.t('Periods.Error.OccuredtimeRequired'))
    }
    if (!Checktime || !validator.isString(Checktime)) {
        validationErrors.push(req.t('Periods.Error.ChecktimeRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Periods.Error.PeriodIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Periods.Error.UnsupportedPeriodID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Periods'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const period = await db.periodModel.findOne({ where: { Uuid: Uuid } })
        if (!period) {
            return next(createNotFoundError(req.t('Periods.Error.NotFound'), req.t('Periods'), req.language))
        }
        if (period.Isactive === false) {
            return next(createNotFoundError(req.t('Periods.Error.NotActive'), req.t('Periods'), req.language))
        }

        await db.periodModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Periods'),
            role: 'periodnotification',
            message: {
                en: `${Name} Period Updated By ${username}.`,
                tr: `${Name} Periyodu ${username} Tarafından Güncellendi.`
            }[req.language],
            pushurl: '/Periods'
        })

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
        validationErrors.push(req.t('Periods.Error.PeriodIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Periods.Error.UnsupportedPeriodID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Periods'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const period = await db.periodModel.findOne({ where: { Uuid: Uuid } })
        if (!period) {
            return next(createNotFoundError(req.t('Periods.Error.NotFound'), req.t('Periods'), req.language))
        }
        if (period.Isactive === false) {
            return next(createNotFoundError(req.t('Periods.Error.NotActive'), req.t('Periods'), req.language))
        }

        await db.periodModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Periods'),
            role: 'periodnotification',
            message: {
                en: `${period?.Name} Period Deleted By ${username}.`,
                tr: `${period?.Name} Periyodu ${username} Tarafından Silindi.`
            }[req.language],
            pushurl: '/Periods'
        })
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
    FastcreatePeriod
}