const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetUnits(req, res, next) {
    try {
        const units = await db.unitModel.findAll({ where: { Isactive: true } })
        for (const unit of units) {
            let departmentuuids = await db.unitdepartmentModel.findAll({
                where: {
                    UnitID: unit.Uuid,
                }
            });
            unit.Departments = await db.departmentModel.findAll({
                where: {
                    Uuid: departmentuuids.map(u => { return u.DepartmentID })
                }
            })
        }
        res.status(200).json(units)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
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
            return createNotfounderror([messages.ERROR.UNIT_NOT_FOUND], req.language)
        }
        if (!unit.Isactive) {
            return createNotfounderror([messages.ERROR.UNIT_NOT_ACTIVE], req.language)
        }
        let departmentuuids = await db.unitdepartmentModel.findAll({
            where: {
                UnitID: unit.Uuid,
            }
        });
        unit.Departments = await db.departmentModel.findAll({
            where: {
                Uuid: departmentuuids.map(u => { return u.DepartmentID })
            }
        })
        res.status(200).json(unit)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
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
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
    }
    if (!validator.isNumber(Unittype)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNITTYPE_REQUIRED, req.language)
    }
    if (!validator.isArray(Departments)) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTS_REQUIRED, req.language)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let unituuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.unitModel.create({
            ...req.body,
            Uuid: unituuid,
            Createduser: "System",
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

        await t.commit()
        const units = await db.unitModel.findAll({ where: { Isactive: true } })
        for (const unit of units) {
            let departmentuuids = await db.unitdepartmentModel.findAll({
                where: {
                    UnitID: unit.Uuid,
                }
            });
            unit.Departments = await db.departmentModel.findAll({
                where: {
                    Uuid: departmentuuids.map(u => { return u.DepartmentID })
                }
            })
        }
        res.status(200).json(units)
    } catch (err) {
        await t.rollback()
        next(sequelizeErrorCatcher(err))
    }
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
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
    }
    if (!Unittype && !validator.isNumber(Unittype)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNITTYPE_REQUIRED, req.language)
    }
    if (!Departments || !Array.isArray(Departments) || Departments.length <= 0) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTS_REQUIRED, req.language)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.UNITID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_UNITID, req.language)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const unit = db.unitModel.findOne({ where: { Uuid: Uuid } })
        if (!unit) {
            return next(createNotfounderror([messages.ERROR.UNIT_NOT_FOUND], req.language))
        }
        if (unit.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.UNIT_NOT_ACTIVE], req.language))
        }

        const t = await db.sequelize.transaction();

        await db.unitModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

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
        await t.commit()
        const units = await db.unitModel.findAll({ where: { Isactive: true } })
        for (const unit of units) {
            let departmentuuids = await db.unitdepartmentModel.findAll({
                where: {
                    UnitID: unit.Uuid,
                }
            });
            unit.Departments = await db.departmentModel.findAll({
                where: {
                    Uuid: departmentuuids.map(u => { return u.DepartmentID })
                }
            })
        }
        res.status(200).json(units)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }


}

async function DeleteUnit(req, res, next) {

    let validationErrors = []
    const {
        Uuid
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.UNITID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_UNITID, req.language)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const unit = db.unitModel.findOne({ where: { Uuid: Uuid } })
        if (!unit) {
            return next(createNotfounderror([messages.ERROR.UNIT_NOT_FOUND], req.language))
        }
        if (unit.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.UNIT_NOT_ACTIVE], req.language))
        }
        const t = await db.sequelize.transaction();

        await db.unitdepartmentModel.destroy({ where: { UnitID: Uuid }, transaction: t });
        await db.unitModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();
        const units = await db.unitModel.findAll({ where: { Isactive: true } })
        for (const unit of units) {
            let departmentuuids = await db.unitdepartmentModel.findAll({
                where: {
                    UnitID: unit.Uuid,
                }
            });
            unit.Departments = await db.departmentModel.findAll({
                where: {
                    Uuid: departmentuuids.map(u => { return u.DepartmentID })
                }
            })
        }
        res.status(200).json(units)
    } catch (error) {
        await t.rollback();
        next(sequelizeErrorCatcher(error))
    }

}

module.exports = {
    GetUnits,
    GetUnit,
    AddUnit,
    UpdateUnit,
    DeleteUnit,
}