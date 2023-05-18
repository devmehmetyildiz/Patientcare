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
            departments.Stations = await db.stationModel.findAll({
                where: {
                    Uuid: stationuuids.map(u => { return u.StationID })
                }
            })
        }
        res.status(200).json(departments)
    } catch (error) {
        sequelizeErrorCatcher(error)
        next()
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
            return createNotfounderror([messages.ERROR.DEPARTMENT_NOT_FOUND], req.language)
        }
        if (!department.Isactive) {
            return createNotfounderror([messages.ERROR.DEPARTMENT_NOT_ACTIVE], req.language)
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
        sequelizeErrorCatcher(error)
        next()
    }
}


async function AddDepartment(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Ishavepatients,
        Stations,
    } = req.body

    if (!Name || !validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
    }
    if (!Ishavepatients || !validator.isBoolean(Ishavepatients)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISHAVEPATIENTS_REQUIRED, req.language)
    }
    if (!Stations || !Array.isArray(Stations) || Stations.length <= 0) {
        validationErrors.push(messages.VALIDATION_ERROR.STATIONS_REQUIRED, req.language)
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
                DepartmentID: caseuuid,
                StationID: station.Uuid
            }, { transaction: t });
        }

        await t.commit()
        const createdDepartment = await db.departmentModel.findOne({ where: { Uuid: departmentuuid } })
        let stationsuuids = await db.departmentstationModel.findAll({
            where: {
                DepartmentID: departmentuuid,
            }
        });
        createdDepartment.Stations = await db.stationModel.findAll({
            where: {
                Uuid: stationsuuids.map(u => { return u.StationID })
            }
        })
        res.status(200).json(createdDepartment)
    } catch (err) {
        await t.rollback()
        sequelizeErrorCatcher(err)
        next()
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

    if (!Name || !validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
    }
    if (!Ishavepatients || !validator.isBoolean(Ishavepatients)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISHAVEPATIENTS_REQUIRED, req.language)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_DEPARTMENTID, req.language)
    }
    if (!Stations || !Array.isArray(Stations) || Stations.length <= 0) {
        validationErrors.push(messages.VALIDATION_ERROR.STATIONS_REQUIRED, req.language)
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
        const updatedDepartment = await db.departmentModel.findOne({ where: { Uuid: Uuid } })
        let departmentuuids = await db.departmentstationModel.findAll({
            where: {
                DepartmentID: Uuid,
            }
        });
        updatedDepartment.StationID = await db.stationModel.findAll({
            where: {
                Uuid: departmentuuids.map(u => { return u.StationID })
            }
        })
        res.status(200).json(updatedDepartment)
    } catch (error) {
        sequelizeErrorCatcher(error)
        next()
    }


}

async function DeleteDepartment(req, res, next) {

    let validationErrors = []
    const {
        Uuid
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_DEPARTMENTID, req.language)
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

        res.status(200).json({ messages: "deleted", Uuid: Uuid })
    } catch (error) {
        await t.rollback();
        sequelizeErrorCatcher(error)
        next()
    }

}

module.exports = {
    GetDepartments,
    GetDepartment,
    AddDepartment,
    UpdateDepartment,
    DeleteDepartment,
}