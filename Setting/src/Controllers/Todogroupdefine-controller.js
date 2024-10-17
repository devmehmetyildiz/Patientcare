const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetTodogroupdefines(req, res, next) {
    try {
        const todogroupdefines = await db.todogroupdefineModel.findAll()
        for (const todogroupdefine of todogroupdefines) {
            todogroupdefine.Tododefineuuids = await db.todogroupdefinetododefineModel.findAll({
                where: {
                    GroupID: todogroupdefine.Uuid,
                },
                attributes: ['TodoID']
            });
        }
        res.status(200).json(todogroupdefines)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetTodogroupdefine(req, res, next) {

    let validationErrors = []
    if (!req.params.todogroupdefineId) {
        validationErrors.push(req.t('Todogroupdefines.Error.TodogroupdefineIDRequired'))
    }
    if (!validator.isUUID(req.params.todogroupdefineId)) {
        validationErrors.push(req.t('Todogroupdefines.Error.UnsupportedTodogroupdefineID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Todogroupdefines'), req.language))
    }

    try {
        const todogroupdefine = await db.todogroupdefineModel.findOne({ where: { Uuid: req.params.todogroupdefineId } });
        todogroupdefine.Tododefineuuids = await db.todogroupdefinetododefineModel.findAll({
            where: {
                GroupID: todogroupdefine.Uuid,
            },
            attributes: ['TodoID']
        });
        res.status(200).json(todogroupdefine)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddTodogroupdefine(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Tododefines,
        DepartmentID,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Todogroupdefines.Error.NameRequired'))
    }
    if (!validator.isUUID(DepartmentID)) {
        validationErrors.push(req.t('Todogroupdefines.Error.DepartmentIDRequired'))
    }
    if (!validator.isArray(Tododefines)) {
        validationErrors.push(req.t('Todogroupdefines.Error.TododefinesRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Todogroupdefines'), req.language))
    }

    let todogroupdefineuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.todogroupdefineModel.create({
            ...req.body,
            Uuid: todogroupdefineuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        for (const tododefine of Tododefines) {
            if (!tododefine.Uuid || !validator.isUUID(tododefine.Uuid)) {
                return next(createValidationError(req.t('Todogroupdefines.Error.UnsupportedTododefineID'), req.t('Todogroupdefines'), req.language))
            }
            await db.todogroupdefinetododefineModel.create({
                GroupID: todogroupdefineuuid,
                TodoID: tododefine.Uuid
            }, { transaction: t });
        }

        await CreateNotification({
            type: types.Create,
            service: req.t('Todogroupdefines'),
            role: 'todogroupdefinenotification',
            message: {
                en: `${Name} Routine List Created By ${username}.`,
                tr: `${Name} Rutin Listesi ${username} Tarafından Oluşturuldu.`
            }[req.language],
            pushurl: '/Todogroupdefines'
        })
        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetTodogroupdefines(req, res, next)
}

async function UpdateTodogroupdefine(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Tododefines,
        DepartmentID,
        Uuid
    } = req.body
    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Todogroupdefines.Error.NameRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Todogroupdefines.Error.TodogroupdefineIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Todogroupdefines.Error.UnsupportedTodogroupdefineID'))
    }
    if (!validator.isUUID(DepartmentID)) {
        validationErrors.push(req.t('Todogroupdefines.Error.DepartmentIDRequired'))
    }
    if (!validator.isArray(Tododefines)) {
        validationErrors.push(req.t('Todogroupdefines.Error.TododefinesRequired'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Todogroupdefines'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const todogroupdefine = await db.todogroupdefineModel.findOne({ where: { Uuid: Uuid } })
        if (!todogroupdefine) {
            return next(createNotFoundError(req.t('Todogroupdefines.Error.NotFound'), req.t('Todogroupdefines'), req.language))
        }
        if (todogroupdefine.Isactive === false) {
            return next(createNotFoundError(req.t('Todogroupdefines.Error.NotActive'), req.t('Todogroupdefines'), req.language))
        }


        await db.todogroupdefineModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.todogroupdefinetododefineModel.destroy({ where: { GroupID: Uuid }, transaction: t });
        for (const tododefine of Tododefines) {
            if (!tododefine.Uuid || !validator.isUUID(tododefine.Uuid)) {
                return next(createValidationError(req.t('Todogroupdefines.Error.UnsupportedTododefineID'), req.t('Todogroupdefines'), req.language))
            }
            await db.todogroupdefinetododefineModel.create({
                GroupID: Uuid,
                TodoID: tododefine.Uuid
            }, { transaction: t });
        }

        await CreateNotification({
            type: types.Update,
            service: req.t('Todogroupdefines'),
            role: 'todogroupdefinenotification',
            message: {
                en: `${Name} Routine List Updated By ${username}.`,
                tr: `${Name} Rutin Listesi ${username} Tarafından Güncellendi.`
            }[req.language],
            pushurl: '/Todogroupdefines'
        })
        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetTodogroupdefines(req, res, next)

}

async function DeleteTodogroupdefine(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.todogroupdefineId

    if (!Uuid) {
        validationErrors.push(req.t('Todogroupdefines.Error.TodogroupdefineIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Todogroupdefines.Error.UnsupportedTodogroupdefineID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Todogroupdefines'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const todogroupdefine = await db.todogroupdefineModel.findOne({ where: { Uuid: Uuid } })
        if (!todogroupdefine) {
            return next(createNotFoundError(req.t('Todogroupdefines.Error.NotFound'), req.t('Todogroupdefines'), req.language))
        }
        if (todogroupdefine.Isactive === false) {
            return next(createNotFoundError(req.t('Todogroupdefines.Error.NotActive'), req.t('Todogroupdefines'), req.language))
        }

        await db.todogroupdefineModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid, transaction: t } })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Todogroupdefines'),
            role: 'todogroupdefinenotification',
            message: {
                en: `${todogroupdefine?.Name} Routine List Updated By ${username}.`,
                tr: `${todogroupdefine?.Name} Rutin Listesi ${username} Tarafından Güncellendi.`
            }[req.language],
            pushurl: '/Todogroupdefines'
        })
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetTodogroupdefines(req, res, next)
}

module.exports = {
    GetTodogroupdefines,
    GetTodogroupdefine,
    AddTodogroupdefine,
    UpdateTodogroupdefine,
    DeleteTodogroupdefine,
}