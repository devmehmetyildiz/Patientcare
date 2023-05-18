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
        sequelizeErrorCatcher(error)
        next()
    }
}

async function GetTodogroupdefine(req, res, next) {

    let validationErrors = []
    if (!req.params.caseId) {
        validationErrors.push(messages.VALIDATION_ERROR.CASEID_REQUIRED)
    }
    if (!validator.isUUID(req.params.caseId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_CASEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const todogroupdefine = await db.todogroupdefineModel.findOne({ where: { Uuid: req.params.caseId } });
        if (!todogroupdefine) {
            return createNotfounderror([messages.ERROR.CASE_NOT_FOUND], req.language)
        }
        if (!todogroupdefine.Isactive) {
            return createNotfounderror([messages.ERROR.CASE_NOT_ACTIVE], req.language)
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
        res.status(200).json(casedata)
    } catch (error) {
        sequelizeErrorCatcher(error)
        next()
    }
}


async function AddTodogroupdefine(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Shortname,
        Casecolor,
        Tododefines,
        DepartmentID,
    } = req.body

    if (!Name || !validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
    }
    if (!Shortname || !validator.isString(Shortname)) {
        validationErrors.push(messages.VALIDATION_ERROR.SHORTNAME_REQUIRED, req.language)
    }
    if (!Casecolor || !validator.isString(Casecolor)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
    }
    if (!CaseStatus && !validator.isNumber(CaseStatus)) {
        validationErrors.push(messages.VALIDATION_ERROR.CASECOLOR_REQUIRED, req.language)
    }
    if (!Departments || !Array.isArray(Departments) || Departments.length <= 0) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTS_REQUIRED, req.language)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let caseuuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.caseModel.create({
            ...req.body,
            Uuid: caseuuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        for (const department of Departments) {
            if (!department.Uuid || !validator.isUUID(department.Uuid)) {
                return next(createValidationError(messages.VALIDATION_ERROR.UNSUPPORTED_DEPARTMENTID, req.language))
            }
            await db.casedepartmentModel.create({
                CaseID: caseuuid,
                DepartmentID: department.Uuid
            }, { transaction: t });
        }

        await t.commit()
        const createdCase = await db.caseModel.findOne({ where: { Uuid: caseuuid } })
        let departmentuuids = await db.casedepartmentModel.findAll({
            where: {
                CaseID: caseuuid,
            }
        });
        createdCase.Departments = await db.departmentModel.findAll({
            where: {
                Uuid: departmentuuids.map(u => { return u.DepartmentID })
            }
        })
        res.status(200).json(createdCase)
    } catch (err) {
        await t.rollback()
        sequelizeErrorCatcher(err)
        next()
    }
}

async function UpdateTodogroupdefine(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Shortname,
        Casecolor,
        CaseStatus,
        Departments,
        Uuid
    } = req.body

    if (!Name || !validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
    }
    if (!Shortname || !validator.isString(Shortname)) {
        validationErrors.push(messages.VALIDATION_ERROR.SHORTNAME_REQUIRED, req.language)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.CASEID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_CASEID, req.language)
    }
    if (!Casecolor || !validator.isString(Casecolor)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
    }
    if (!CaseStatus && !validator.isNumber(CaseStatus)) {
        validationErrors.push(messages.VALIDATION_ERROR.CASECOLOR_REQUIRED, req.language)
    }
    if (!Departments || !Array.isArray(Departments) || Departments.length <= 0) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTS_REQUIRED, req.language)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const casedata = db.caseModel.findOne({ where: { Uuid: Uuid } })
        if (!casedata) {
            return next(createNotfounderror([messages.ERROR.CASE_NOT_FOUND], req.language))
        }
        if (casedata.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.CASE_NOT_ACTIVE], req.language))
        }

        const t = await db.sequelize.transaction();

        await db.caseModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await db.casedepartmentModel.destroy({ where: { CaseID: Uuid }, transaction: t });
        for (const department of Departments) {
            if (!department.Uuid || !validator.isUUID(department.Uuid)) {
                return next(createValidationError(messages.VALIDATION_ERROR.UNSUPPORTED_DEPARTMENTID, req.language))
            }
            await db.casedepartmentModel.create({
                CaseID: Uuid,
                DepartmentID: department.Uuid
            }, { transaction: t });
        }
        await t.commit()
        const updatedCase = await db.caseModel.findOne({ where: { Uuid: Uuid } })
        let departmentuuids = await db.casedepartmentModel.findAll({
            where: {
                CaseID: Uuid,
            }
        });
        updatedCase.Departments = await db.departmentModel.findAll({
            where: {
                Uuid: departmentuuids.map(u => { return u.DepartmentID })
            }
        })
        res.status(200).json(updatedCase)
    } catch (error) {
        sequelizeErrorCatcher(error)
        next()
    }


}

async function DeleteTodogroupdefine(req, res, next) {

    let validationErrors = []
    const {
        Uuid
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.CASEID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_CASEID, req.language)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const casedata = db.caseModel.findOne({ where: { Uuid: Uuid } })
        if (!casedata) {
            return next(createNotfounderror([messages.ERROR.CASE_NOT_FOUND], req.language))
        }
        if (casedata.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.CASE_NOT_ACTIVE], req.language))
        }
        const t = await db.sequelize.transaction();

        await db.casedepartmentModel.destroy({ where: { CaseID: Uuid }, transaction: t });
        await db.caseModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();

        res.status(200).json({ messages: "deleted", Uuid: Uuid })
    } catch (error) {
        await t.rollback();
        sequelizeErrorCatcher(error)
        next()
    }

}

module.exports = {
    GetTodogroupdefines,
    GetTodogroupdefine,
    AddTodogroupdefine,
    UpdateTodogroupdefine,
    DeleteTodogroupdefine,
}