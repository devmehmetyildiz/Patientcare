const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetTododefines(req, res, next) {
    try {
        const tododefines = await db.tododefineModel.findAll()
        for (const tododefine of tododefines) {
            tododefine.Perioduuids = await db.tododefineperiodModel.findAll({
                where: {
                    TododefineID: tododefine.Uuid,
                },
                attributes: ['PeriodID']
            });
        }
        res.status(200).json(tododefines)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetTododefine(req, res, next) {

    let validationErrors = []
    if (!req.params.tododefineId) {
        validationErrors.push(req.t('Tododefines.Error.TododefineIDRequired'))
    }
    if (!validator.isUUID(req.params.tododefineId)) {
        validationErrors.push(req.t('Tododefines.Error.UnsupportedTododefineID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Tododefines'), req.language))
    }

    try {
        const tododefine = await db.tododefineModel.findOne({ where: { Uuid: req.params.tododefineId } });
        tododefine.Perioduuids = await db.tododefineperiodModel.findAll({
            where: {
                TododefineID: tododefine.Uuid,
            },
            attributes: ['PeriodID']
        });
        res.status(200).json(tododefine)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddTododefine(req, res, next) {

    let validationErrors = []
    const {
        Name,
        IsRequired,
        IsNeedactivation,
        Dayperiod,
        Periods
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Tododefines.Error.NameRequired'))
    }
    if (!validator.isBoolean(IsRequired)) {
        validationErrors.push(req.t('Tododefines.Error.IsRequiredRequired'))
    }
    if (!validator.isNumber(Dayperiod)) {
        validationErrors.push(req.t('Tododefines.Error.DayPeriodRequired'))
    }
    if (!validator.isBoolean(IsNeedactivation)) {
        validationErrors.push(req.t('Tododefines.Error.IsNeedActivationRequired'))
    }
    if (!validator.isArray(Periods)) {
        validationErrors.push(req.t('Tododefines.Error.PeriodsRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Tododefines'), req.language))
    }

    let tododefineuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.tododefineModel.create({
            ...req.body,
            Uuid: tododefineuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        for (const period of Periods) {
            if (!period.Uuid || !validator.isUUID(period.Uuid)) {
                return next(createValidationError(req.t('Tododefines.Error.UnsupportedPeriodID'), req.t('Tododefines'), req.language))
            }
            await db.tododefineperiodModel.create({
                TododefineID: tododefineuuid,
                PeriodID: period.Uuid
            }, { transaction: t });
        }

        await CreateNotification({
            type: types.Create,
            service: req.t('Tododefines'),
            role: 'tododefinenotification',
            message: {
                en: `${Name} Routine Created By${username}.`,
                tr: `${Name} rutini ${username} tarafından Oluşturuldu.`
            }[req.language],
            pushurl: '/Tododefines'
        })
        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetTododefines(req, res, next)
}

async function UpdateTododefine(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Uuid,
        IsRequired,
        Dayperiod,
        IsNeedactivation,
        Periods
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Tododefines.Error.NameRequired'))
    }
    if (!validator.isNumber(Dayperiod)) {
        validationErrors.push(req.t('Tododefines.Error.DayPeriodRequired'))
    }
    if (!validator.isBoolean(IsRequired)) {
        validationErrors.push(req.t('Tododefines.Error.IsRequiredRequired'))
    }
    if (!validator.isBoolean(IsNeedactivation)) {
        validationErrors.push(req.t('Tododefines.Error.IsNeedActivationRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Tododefines.Error.TododefineIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Tododefines.Error.UnsupportedTododefineID'))
    }
    if (!validator.isArray(Periods)) {
        validationErrors.push(req.t('Tododefines.Error.PeriodsRequired'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Tododefines'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const tododefine = db.tododefineModel.findOne({ where: { Uuid: Uuid } })
        if (!tododefine) {
            return next(createNotFoundError(req.t('Tododefines.Error.NotFound'), req.t('Tododefines'), req.language))
        }
        if (tododefine.Isactive === false) {
            return next(createNotFoundError(req.t('Tododefines.Error.NotActive'), req.t('Tododefines'), req.language))
        }

        await db.tododefineModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.tododefineperiodModel.destroy({ where: { TododefineID: Uuid }, transaction: t });
        for (const period of Periods) {
            if (!period.Uuid || !validator.isUUID(period.Uuid)) {
                return next(createValidationError(req.t('Tododefines.Error.UnsupportedPeriodID'), req.t('Tododefines'), req.language))
            }
            await db.tododefineperiodModel.create({
                TododefineID: Uuid,
                PeriodID: period.Uuid
            }, { transaction: t });
        }

        await CreateNotification({
            type: types.Update,
            service: req.t('Tododefines'),
            role: 'tododefinenotification',
            message: {
                en: `${Name} Routine Updated By ${username}.`,
                tr: `${Name} rutini ${username} tarafından Güncellendi.`
            }[req.language],
            pushurl: '/Tododefines'
        })
        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetTododefines(req, res, next)
}

async function DeleteTododefine(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.tododefineId

    if (!Uuid) {
        validationErrors.push(req.t('Tododefines.Error.TododefineIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Tododefines.Error.UnsupportedTododefineID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Tododefines'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const tododefine = await db.tododefineModel.findOne({ where: { Uuid: Uuid } })
        if (!tododefine) {
            return next(createNotFoundError(req.t('Tododefines.Error.NotFound'), req.t('Tododefines'), req.language))
        }
        if (tododefine.Isactive === false) {
            return next(createNotFoundError(req.t('Tododefines.Error.NotActive'), req.t('Tododefines'), req.language))
        }

        await db.tododefineModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Tododefines'),
            role: 'tododefinenotification',
            message: {
                en: `${tododefine?.Name} Routine Deleted By ${username}.`,
                tr: `${tododefine?.Name} rutini ${username} tarafından Silindi.`
            }[req.language],
            pushurl: '/Tododefines'
        })
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetTododefines(req, res, next)
}

module.exports = {
    GetTododefines,
    GetTododefine,
    AddTododefine,
    UpdateTododefine,
    DeleteTododefine,
}