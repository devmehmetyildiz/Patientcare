const { types } = require("../Constants/Defines")
const messages = require("../Constants/Messages")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetUnits(req, res, next) {
    try {
        const units = await db.unitModel.findAll({ where: { Isactive: true } })
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
        validationErrors.push(messages.VALIDATION_ERROR.UNITID_REQUIRED)
    }
    if (!validator.isUUID(req.params.unitId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_UNITID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const unit = await db.unitModel.findOne({ where: { Uuid: req.params.unitId } });
        if (!unit) {
            return createNotfounderror([messages.ERROR.UNIT_NOT_FOUND])
        }
        if (!unit.Isactive) {
            return createNotfounderror([messages.ERROR.UNIT_NOT_ACTIVE])
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
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isNumber(Unittype)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNITTYPE_REQUIRED)
    }
    if (!validator.isArray(Departments)) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTS_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
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
                return next(createValidationError(messages.VALIDATION_ERROR.UNSUPPORTED_DEPARTMENTID, req.language))
            }
            await db.unitdepartmentModel.create({
                UnitID: unituuid,
                DepartmentID: department.Uuid
            }, { transaction: t });
        }

        await CreateNotification({
            type: types.Create,
            service: 'Birimler',
            role: 'unitnotification',
            message: `${Name} birimi ${username} tarafından Oluşturuldu.`,
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
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!Unittype && !validator.isNumber(Unittype)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNITTYPE_REQUIRED)
    }
    if (!Departments || !Array.isArray(Departments) || Departments.length <= 0) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTS_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.UNITID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_UNITID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const unit = await db.unitModel.findOne({ where: { Uuid: Uuid } })
        if (!unit) {
            return next(createNotfounderror([messages.ERROR.UNIT_NOT_FOUND], req.language))
        }
        if (unit.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.UNIT_NOT_ACTIVE], req.language))
        }

        await db.unitModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.unitdepartmentModel.destroy({ where: { UnitID: Uuid }, transaction: t });
        for (const department of Departments) {
            if (!department.Uuid || !validator.isUUID(department.Uuid)) {
                return next(createValidationError(messages.VALIDATION_ERROR.UNSUPPORTED_DEPARTMENTID, req.language))
            }
            await db.unitdepartmentModel.create({
                UnitID: Uuid,
                DepartmentID: department.Uuid
            }, { transaction: t });
        }

        await CreateNotification({
            type: types.Update,
            service: 'Birimler',
            role: 'unitnotification',
            message: `${Name} birimi ${username} tarafından Güncellendi.`,
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
        validationErrors.push(messages.VALIDATION_ERROR.UNITID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_UNITID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const unit = await db.unitModel.findOne({ where: { Uuid: Uuid } })
        if (!unit) {
            return next(createNotfounderror([messages.ERROR.UNIT_NOT_FOUND], req.language))
        }
        if (unit.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.UNIT_NOT_ACTIVE], req.language))
        }

        await db.unitModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: 'Birimler',
            role: 'unitnotification',
            message: `${unit?.Name} birimi ${username} tarafından Silindi.`,
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