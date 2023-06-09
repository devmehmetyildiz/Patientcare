const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetDepartments(req, res, next) {
    try {
        const departments = await db.departmentModel.findAll({ where: { Isactive: true } })
        for (const department of departments) {
            let stationuuids = await db.departmentstationModel.findAll({
                where: {
                    DepartmentID: department.Uuid,
                }
            });
            department.Stations = await db.stationModel.findAll({
                where: {
                    Uuid: stationuuids.map(u => { return u.StationID })
                }
            })
        }
        res.status(200).json(departments)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
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
        let stationuuids = await db.departmentstationModel.findAll({
            where: {
                DepartmentID: department.Uuid,
            }
        });
        department.Stations = await db.stationModel.findAll({
            where: {
                Uuid: stationuuids.map(u => { return u.StationID })
            }
        })
        res.status(200).json(department)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function AddDepartment(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Ishavepatients,
        Stations,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }

    if (!validator.isBoolean(Ishavepatients)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISHAVEPATIENTS_REQUIRED)
    }
    if (!validator.isArray(Stations)) {
        validationErrors.push(messages.VALIDATION_ERROR.STATIONS_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let departmentuuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.departmentModel.create({
            ...req.body,
            Uuid: departmentuuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        for (const station of Stations) {
            if (!station.Uuid || !validator.isUUID(station.Uuid)) {
                return next(createValidationError(messages.VALIDATION_ERROR.UNSUPPORTED_STATIONID, req.language))
            }
            await db.departmentstationModel.create({
                DepartmentID: departmentuuid,
                StationID: station.Uuid
            }, { transaction: t });
        }

        await t.commit()
        const departments = await db.departmentModel.findAll({ where: { Isactive: true } })
        for (const department of departments) {
            let stationuuids = await db.departmentstationModel.findAll({
                where: {
                    DepartmentID: department.Uuid,
                }
            });
            department.Stations = await db.stationModel.findAll({
                where: {
                    Uuid: stationuuids.map(u => { return u.StationID })
                }
            })
        }
        res.status(200).json(departments)
    } catch (err) {
        await t.rollback()
        next(sequelizeErrorCatcher(err))

    }
}

async function UpdateDepartment(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Ishavepatients,
        Stations,
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
    if (!validator.isArray(Stations)) {
        validationErrors.push(messages.VALIDATION_ERROR.STATIONS_REQUIRED)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const department = db.departmentModel.findOne({ where: { Uuid: Uuid } })
        if (!department) {
            return next(createNotfounderror([messages.ERROR.DEPARTMENT_NOT_FOUND], req.language))
        }
        if (department.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.DEPARTMENT_NOT_ACTIVE], req.language))
        }

        const t = await db.sequelize.transaction();

        await db.departmentModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await db.departmentstationModel.destroy({ where: { DepartmentID: Uuid }, transaction: t });
        for (const station of Stations) {
            if (!station.Uuid || !validator.isUUID(station.Uuid)) {
                return next(createValidationError(messages.VALIDATION_ERROR.UNSUPPORTED_STATIONID, req.language))
            }
            await db.departmentstationModel.create({
                DepartmentID: Uuid,
                StationID: station.Uuid
            }, { transaction: t });
        }
        await t.commit()
        const departments = await db.departmentModel.findAll({ where: { Isactive: true } })
        for (const department of departments) {
            let stationuuids = await db.departmentstationModel.findAll({
                where: {
                    DepartmentID: department.Uuid,
                }
            });
            department.Stations = await db.stationModel.findAll({
                where: {
                    Uuid: stationuuids.map(u => { return u.StationID })
                }
            })
        }
        res.status(200).json(departments)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }


}

async function DeleteDepartment(req, res, next) {

    let validationErrors = []
    const {
        Uuid
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_DEPARTMENTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const department = db.departmentModel.findOne({ where: { Uuid: Uuid } })
        if (!department) {
            return next(createNotfounderror([messages.ERROR.DEPARTMENT_NOT_FOUND], req.language))
        }
        if (department.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.DEPARTMENT_NOT_ACTIVE], req.language))
        }
        const t = await db.sequelize.transaction();

        await db.departmentstationModel.destroy({ where: { DepartmentID: Uuid }, transaction: t });
        await db.departmentModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();
        const departments = await db.departmentModel.findAll({ where: { Isactive: true } })
        for (const department of departments) {
            let stationuuids = await db.departmentstationModel.findAll({
                where: {
                    DepartmentID: department.Uuid,
                }
            });
            department.Stations = await db.stationModel.findAll({
                where: {
                    Uuid: stationuuids.map(u => { return u.StationID })
                }
            })
        }
        res.status(200).json(departments)
    } catch (error) {
        await t.rollback();
        next(sequelizeErrorCatcher(error))
    }

}

module.exports = {
    GetDepartments,
    GetDepartment,
    AddDepartment,
    UpdateDepartment,
    DeleteDepartment,
}