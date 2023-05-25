const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetTodogroupdefines(req, res, next) {
    try {
        const todogroupdefines = await db.todogroupdefineModel.findAll({ where: { Isactive: true } })
        for (const todogroupdefine of todogroupdefines) {
            let tododefineuuids = await db.todogroupdefinetododefineModel.findAll({
                where: {
                    GroupID: todogroupdefine.Uuid,
                }
            });
            todogroupdefine.Tododefines = await db.tododefineModel.findAll({
                where: {
                    Uuid: tododefineuuids.map(u => { return u.TodoID })
                }
            })
            todogroupdefine.Department = await db.departmentModel.findOne({ where: { Uuid: todogroupdefine.DepartmentID } })
        }
        res.status(200).json(todogroupdefines)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function GetTodogroupdefine(req, res, next) {

    let validationErrors = []
    if (!req.params.todogroupdefineId) {
        validationErrors.push(messages.VALIDATION_ERROR.TODOGROUPDEFINEID_REQUIRED)
    }
    if (!validator.isUUID(req.params.todogroupdefineId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_TODOGROUPDEFINEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const todogroupdefine = await db.todogroupdefineModel.findOne({ where: { Uuid: req.params.todogroupdefineId } });
        if (!todogroupdefine) {
            return createNotfounderror([messages.ERROR.TODOGROUPDEFINE_NOT_FOUND], req.language)
        }
        if (!todogroupdefine.Isactive) {
            return createNotfounderror([messages.ERROR.TODOGROUPDEFINE_NOT_ACTIVE], req.language)
        }
        let tododefineuuids = await db.todogroupdefinetododefineModel.findAll({
            where: {
                GroupID: todogroupdefine.Uuid,
            }
        });
        todogroupdefine.Tododefines = await db.tododefineModel.findAll({
            where: {
                Uuid: tododefineuuids.map(u => { return u.TodoID })
            }
        })
        todogroupdefine.Department = await db.departmentModel.findOne({ where: { Uuid: todogroupdefine.DepartmentID } })
        res.status(200).json(todogroupdefine)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
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
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
    }
    if (!validator.isUUID(DepartmentID)) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED, req.language)
    }
    if (!validator.isArray(Tododefines)) {
        validationErrors.push(messages.VALIDATION_ERROR.TODODEFINES_REQUIRED, req.language)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let todogroupdefineuuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.todogroupdefineModel.create({
            ...req.body,
            Uuid: todogroupdefineuuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        for (const tododefine of Tododefines) {
            if (!tododefine.Uuid || !validator.isUUID(tododefine.Uuid)) {
                return next(createValidationError(messages.VALIDATION_ERROR.UNSUPPORTED_TODODEFINEID, req.language))
            }
            await db.todogroupdefinetododefineModel.create({
                GroupID: todogroupdefineuuid,
                TodoID: tododefine.Uuid
            }, { transaction: t });
        }

        await t.commit()
        const todogroupdefines = await db.todogroupdefineModel.findAll({ where: { Isactive: true } })
        for (const todogroupdefine of todogroupdefines) {
            let tododefineuuids = await db.todogroupdefinetododefineModel.findAll({
                where: {
                    GroupID: todogroupdefine.Uuid,
                }
            });
            todogroupdefine.Tododefines = await db.tododefineModel.findAll({
                where: {
                    Uuid: tododefineuuids.map(u => { return u.TodoID })
                }
            })
            todogroupdefine.Department = await db.departmentModel.findOne({ where: { Uuid: todogroupdefine.DepartmentID } })
        }
        res.status(200).json(todogroupdefines)
    } catch (err) {
        await t.rollback()
        next(sequelizeErrorCatcher(err))
    }
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
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.TODOGROUPDEFINEID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_TODOGROUPDEFINEID, req.language)
    }
    if (!validator.isUUID(DepartmentID)) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED, req.language)
    }
    if (!validator.isArray(Tododefines)) {
        validationErrors.push(messages.VALIDATION_ERROR.TODODEFINES_REQUIRED, req.language)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const todogroupdefine = db.todogroupdefineModel.findOne({ where: { Uuid: Uuid } })
        if (!todogroupdefine) {
            return next(createNotfounderror([messages.ERROR.TODOGROUPDEFINE_NOT_FOUND], req.language))
        }
        if (todogroupdefine.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.TODOGROUPDEFINE_NOT_ACTIVE], req.language))
        }

        const t = await db.sequelize.transaction();

        await db.todogroupdefineModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await db.todogroupdefinetododefineModel.destroy({ where: { GroupID: Uuid }, transaction: t });
        for (const tododefine of Tododefines) {
            if (!tododefine.Uuid || !validator.isUUID(tododefine.Uuid)) {
                return next(createValidationError(messages.VALIDATION_ERROR.UNSUPPORTED_TODODEFINEID, req.language))
            }
            await db.todogroupdefinetododefineModel.create({
                GroupID: Uuid,
                TodoID: tododefine.Uuid
            }, { transaction: t });
        }
        await t.commit()
        const todogroupdefines = await db.todogroupdefineModel.findAll({ where: { Isactive: true } })
        for (const todogroupdefine of todogroupdefines) {
            let tododefineuuids = await db.todogroupdefinetododefineModel.findAll({
                where: {
                    GroupID: todogroupdefine.Uuid,
                }
            });
            todogroupdefine.Tododefines = await db.tododefineModel.findAll({
                where: {
                    Uuid: tododefineuuids.map(u => { return u.TodoID })
                }
            })
            todogroupdefine.Department = await db.departmentModel.findOne({ where: { Uuid: todogroupdefine.DepartmentID } })
        }
        res.status(200).json(todogroupdefines)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }


}

async function DeleteTodogroupdefine(req, res, next) {

    let validationErrors = []
    const {
        Uuid
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.TODOGROUPDEFINEID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_TODOGROUPDEFINEID, req.language)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const todogroupdefine = db.todogroupdefineModel.findOne({ where: { Uuid: Uuid } })
        if (!todogroupdefine) {
            return next(createNotfounderror([messages.ERROR.TODOGROUPDEFINE_NOT_FOUND], req.language))
        }
        if (todogroupdefine.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.TODOGROUPDEFINE_NOT_ACTIVE], req.language))
        }
        const t = await db.sequelize.transaction();

        await db.todogroupdefinetododefineModel.destroy({ where: { GroupID: Uuid }, transaction: t });
        await db.tododefineModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();
        const todogroupdefines = await db.todogroupdefineModel.findAll({ where: { Isactive: true } })
        for (const todogroupdefine of todogroupdefines) {
            let tododefineuuids = await db.todogroupdefinetododefineModel.findAll({
                where: {
                    GroupID: todogroupdefine.Uuid,
                }
            });
            todogroupdefine.Tododefines = await db.tododefineModel.findAll({
                where: {
                    Uuid: tododefineuuids.map(u => { return u.TodoID })
                }
            })
            todogroupdefine.Department = await db.departmentModel.findOne({ where: { Uuid: todogroupdefine.DepartmentID } })
        }
        res.status(200).json(todogroupdefines)
    } catch (error) {
        await t.rollback();
        next(sequelizeErrorCatcher(error))
    }

}

module.exports = {
    GetTodogroupdefines,
    GetTodogroupdefine,
    AddTodogroupdefine,
    UpdateTodogroupdefine,
    DeleteTodogroupdefine,
}