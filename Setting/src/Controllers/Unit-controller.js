const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetUnits(req, res, next) {
    try {
        const units = await db.unitModel.findAll()
        for (const unit of units) {
            unit.Departmentuuids = await db.unitdepartmentModel.findAll({
                where: {
                    UnitID: unit.Uuid,
                },
                attributes: ['DepartmentID']
            });
        }
        res.status(200).json(units)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetUnit(req, res, next) {

    let validationErrors = []
    if (!req.params.unitId) {
        validationErrors.push(req.t('Units.Error.UnitIDRequired'))
    }
    if (!validator.isUUID(req.params.unitId)) {
        validationErrors.push(req.t('Units.Error.UnsupportedUnitID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Units'), req.language))
    }

    try {
        const unit = await db.unitModel.findOne({ where: { Uuid: req.params.unitId } });
        if (!unit) {
            return next(createNotFoundError(req.t('Units.Error.NotFound'), req.t('Units'), req.language))
        }
        if (!unit.Isactive) {
            return next(createNotFoundError(req.t('Units.Error.NotActive'), req.t('Units'), req.language))
        }
        unit.Departmentuuids = await db.unitdepartmentModel.findAll({
            where: {
                UnitID: unit.Uuid,
            },
            attributes: ['DepartmentID']
        });
        res.status(200).json(unit)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddUnit(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Unittype,
        Departments,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Units.Error.NameRequired'))
    }
    if (!validator.isNumber(Unittype)) {
        validationErrors.push(req.t('Units.Error.UnittypeRequired'))
    }
    if (!validator.isArray(Departments)) {
        validationErrors.push(req.t('Units.Error.DepartmentsRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Units'), req.language))
    }

    let unituuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.unitModel.create({
            ...req.body,
            Uuid: unituuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        for (const department of Departments) {
            if (!department.Uuid || !validator.isUUID(department.Uuid)) {
                return next(createValidationError(req.t('Units.Error.UnsupportedDepartmentID"'), req.t('Units'), req.language))
            }
            await db.unitdepartmentModel.create({
                UnitID: unituuid,
                DepartmentID: department.Uuid
            }, { transaction: t });
        }

        await CreateNotification({
            type: types.Create,
            service: req.t('Units'),
            role: 'unitnotification',
            message: {
                en: `${Name} Unit Created By ${username}.`,
                tr: `${Name} birimi ${username} tarafından Oluşturuldu.`
            }[req.language],
            pushurl: '/Units'
        })
        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetUnits(req, res, next)
}

async function UpdateUnit(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Unittype,
        Departments,
        Uuid
    } = req.body

    if (!Name || !validator.isString(Name)) {
        validationErrors.push(req.t('Units.Error.NameRequired'))
    }
    if (!Unittype && !validator.isNumber(Unittype)) {
        validationErrors.push(req.t('Units.Error.UnittypeRequired'))
    }
    if (!Departments || !Array.isArray(Departments) || Departments.length <= 0) {
        validationErrors.push(req.t('Units.Error.DepartmentsRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Units.Error.UnitIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Units.Error.UnsupportedUnitID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Units'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const unit = await db.unitModel.findOne({ where: { Uuid: Uuid } })
        if (!unit) {
            return next(createNotFoundError(req.t('Units.Error.NotFound'), req.t('Units'), req.language))
        }
        if (unit.Isactive === false) {
            return next(createNotFoundError(req.t('Units.Error.NotActive'), req.t('Units'), req.language))
        }

        await db.unitModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.unitdepartmentModel.destroy({ where: { UnitID: Uuid }, transaction: t });
        for (const department of Departments) {
            if (!department.Uuid || !validator.isUUID(department.Uuid)) {
                return next(createValidationError(req.t('Units.Error.UnsupportedDepartmentID"'), req.t('Units'), req.language))
            }
            await db.unitdepartmentModel.create({
                UnitID: Uuid,
                DepartmentID: department.Uuid
            }, { transaction: t });
        }

        await CreateNotification({
            type: types.Update,
            service: req.t('Units'),
            role: 'unitnotification',
            message: {
                en: `${Name} Unit Updated By ${username}.`,
                tr: `${Name} birimi ${username} tarafından Güncellendi.`
            }[req.language],
            pushurl: '/Units'
        })
        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetUnits(req, res, next)

}

async function DeleteUnit(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.unitId

    if (!Uuid) {
        validationErrors.push(req.t('Units.Error.UnitIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Units.Error.UnsupportedUnitID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Units'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const unit = await db.unitModel.findOne({ where: { Uuid: Uuid } })
        if (!unit) {
            return next(createNotFoundError(req.t('Units.Error.NotFound'), req.t('Units'), req.language))
        }
        if (unit.Isactive === false) {
            return next(createNotFoundError(req.t('Units.Error.NotActive'), req.t('Units'), req.language))
        }

        await db.unitModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Units'),
            role: 'unitnotification',
            message: {
                en: `${unit?.Name} Unit Deleted By ${username}.`,
                tr: `${unit?.Name} birimi ${username} tarafından Silindi.`
            }[req.language],
            pushurl: '/Units'
        })
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetUnits(req, res, next)
}

module.exports = {
    GetUnits,
    GetUnit,
    AddUnit,
    UpdateUnit,
    DeleteUnit,
}