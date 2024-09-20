const { types } = require("../Constants/Defines")
const messages = require("../Constants/Messages")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetDepartments(req, res, next) {
    try {
        const departments = await db.departmentModel.findAll({ where: { Isactive: true } })
        res.status(200).json(departments)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetDepartment(req, res, next) {

    let validationErrors = []
    if (!req.params.departmentId) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED)
    }
    if (!validator.isUUID(req.params.departmentId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_DEPARTMENTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const department = await db.departmentModel.findOne({ where: { Uuid: req.params.departmentId } });
        if (!department) {
            return createNotfounderror([messages.ERROR.DEPARTMENT_NOT_FOUND])
        }
        if (!department.Isactive) {
            return createNotfounderror([messages.ERROR.DEPARTMENT_NOT_ACTIVE])
        }
        res.status(200).json(department)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddDepartment(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Ishavepatients,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }

    if (!validator.isBoolean(Ishavepatients)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISHAVEPATIENTS_REQUIRED)
    }


    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let departmentuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        await db.departmentModel.create({
            ...req.body,
            Uuid: departmentuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: 'Departmanlar',
            role: 'departmentnotification',
            message: `${Name} departmanı ${username} tarafından oluşturuldu.`,
            pushurl: '/Departments'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetDepartments(req, res, next)
}

async function UpdateDepartment(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Ishavepatients,
        Uuid
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isBoolean(Ishavepatients)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISHAVEPATIENTS_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_DEPARTMENTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        const department = await db.departmentModel.findOne({ where: { Uuid: Uuid } })
        if (!department) {
            return next(createNotfounderror([messages.ERROR.DEPARTMENT_NOT_FOUND], req.language))
        }
        if (department.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.DEPARTMENT_NOT_ACTIVE], req.language))
        }

        await db.departmentModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Departmanlar',
            role: 'departmentnotification',
            message: `${Name} departmanı ${username} tarafından güncellendi.`,
            pushurl: '/Departments'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetDepartments(req, res, next)
}

async function DeleteDepartment(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.departmentId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_DEPARTMENTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        const department = await db.departmentModel.findOne({ where: { Uuid: Uuid } })
        if (!department) {
            return next(createNotfounderror([messages.ERROR.DEPARTMENT_NOT_FOUND], req.language))
        }
        if (department.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.DEPARTMENT_NOT_ACTIVE], req.language))
        }

        await db.departmentModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: 'Departmanlar',
            role: 'departmentnotification',
            message: `${department?.Name} departmanı ${username} tarafından Silindi.`,
            pushurl: '/Departments'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetDepartments(req, res, next)
}

module.exports = {
    GetDepartments,
    GetDepartment,
    AddDepartment,
    UpdateDepartment,
    DeleteDepartment,
}