const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetDepartments(req, res, next) {
    try {
        const departments = await db.departmentModel.findAll()
        res.status(200).json(departments)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetDepartment(req, res, next) {

    let validationErrors = []
    if (!req.params.departmentId) {
        validationErrors.push(req.t('Departments.Error.DepartmentIDRequired'))
    }
    if (!validator.isUUID(req.params.departmentId)) {
        validationErrors.push(req.t('Departments.Error.UnsupportedDepartmentID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Departments'), req.language))
    }

    try {
        const department = await db.departmentModel.findOne({ where: { Uuid: req.params.departmentId } });
        if (!department) {
            return next(createNotFoundError(req.t('Departments.Error.NotFound'), req.t('Departments'), req.language))
        }
        if (!department.Isactive) {
            return next(createNotFoundError(req.t('Departments.Error.NotActive'), req.t('Departments'), req.language))
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
        validationErrors.push(req.t('Departments.Error.NameRequired'))
    }

    if (!validator.isBoolean(Ishavepatients)) {
        validationErrors.push(req.t('Departments.Error.IshavepatientsRequired'))
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
            service: req.t('Departments'),
            role: 'departmentnotification',
            message: {
                en: `${Name} Department Created By ${username}.`,
                tr: `${Name} Departmanı ${username} Tarafından Oluşturuldu.`
            }[req.language],
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
        validationErrors.push(req.t('Departments.Error.NameRequired'))
    }
    if (!validator.isBoolean(Ishavepatients)) {
        validationErrors.push(req.t('Departments.Error.IshavepatientsRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Departments.Error.DepartmentIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Departments.Error.UnsupportedDepartmentID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        const department = await db.departmentModel.findOne({ where: { Uuid: Uuid } })
        if (!department) {
            return next(createNotFoundError(req.t('Departments.Error.NotFound'), req.t('Departments'), req.language))
        }
        if (department.Isactive === false) {
            return next(createNotFoundError(req.t('Departments.Error.NotActive'), req.t('Departments'), req.language))
        }

        await db.departmentModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Departments'),
            role: 'departmentnotification',
            message: {
                en: `${Name} Department Updated By ${username}.`,
                tr: `${Name} Departmanı ${username} Tarafından Güncellendi.`
            }[req.language],
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
        validationErrors.push(req.t('Departments.Error.DepartmentIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Departments.Error.UnsupportedDepartmentID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        const department = await db.departmentModel.findOne({ where: { Uuid: Uuid } })
        if (!department) {
            return next(createNotFoundError(req.t('Departments.Error.NotFound'), req.t('Departments'), req.language))
        }
        if (department.Isactive === false) {
            return next(createNotFoundError(req.t('Departments.Error.NotActive'), req.t('Departments'), req.language))
        }

        await db.departmentModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Departments'),
            role: 'departmentnotification',
            message: {
                en: `${department?.Name} Department Deleted By ${username}.`,
                tr: `${department?.Name} Departmanı ${username} Tarafından Silindi.`
            }[req.language],
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