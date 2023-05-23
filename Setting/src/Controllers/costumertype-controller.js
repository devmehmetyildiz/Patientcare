const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetCostumertypes(req, res, next) {
    try {
        const costumertypes = await db.costumertypeModel.findAll({ where: { Isactive: true } })
        for (const costumertype of costumertypes) {
            let departmentuuids = await db.costumertypedepartmentModel.findAll({
                where: {
                    CostumertypeID: costumertype.Uuid,
                }
            });
            costumertype.Departments = await db.departmentModel.findAll({
                where: {
                    Uuid: departmentuuids.map(u => { return u.DepartmentID })
                }
            })
        }
        res.status(200).json(costumertypes)
    } catch (error) {
        sequelizeErrorCatcher(error)
        next()
    }
}

async function GetCostumertype(req, res, next) {

    let validationErrors = []
    if (!req.params.costumertypeId) {
        validationErrors.push(messages.VALIDATION_ERROR.COSTUMERTYPEID_REQUIRED)
    }
    if (!validator.isUUID(req.params.costumertypeId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_COSTUMERTYPEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const costumertpe = await db.costumertypeModel.findOne({ where: { Uuid: req.params.costumertypeId } });
        if (!costumertpe) {
            return createNotfounderror([messages.ERROR.COSTUMERTYPE_NOT_FOUND], req.language)
        }
        if (!costumertpe.Isactive) {
            return createNotfounderror([messages.ERROR.COSTUMERTYPE_NOT_ACTIVE], req.language)
        }
        let departmentuuids = await db.costumertypedepartmentModel.findAll({
            where: {
                CostumertypeID: costumertpe.Uuid,
            }
        });
        costumertpe.Departments = await db.departmentModel.findAll({
            where: {
                Uuid: departmentuuids.map(u => { return u.DepartmentID })
            }
        })
        res.status(200).json(costumertpe)
    } catch (error) {
        sequelizeErrorCatcher(error)
        next()
    }
}

async function AddCostumertype(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Departments,
    } = req.body

    if (!Name || !validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
    }
    if (!Departments || !Array.isArray(Departments) || Departments.length <= 0) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTS_REQUIRED, req.language)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let costumertypeuuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.costumertypeModel.create({
            ...req.body,
            Uuid: costumertypeuuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        for (const department of Departments) {
            if (!department.Uuid || !validator.isUUID(department.Uuid)) {
                return next(createValidationError(messages.VALIDATION_ERROR.UNSUPPORTED_DEPARTMENTID, req.language))
            }
            await db.costumertypedepartmentModel.create({
                CostumertypeID: costumertypeuuid,
                DepartmentID: department.Uuid
            }, { transaction: t });
        }

        await t.commit()
        const createdCostumertype = await db.costumertypeModel.findOne({ where: { Uuid: costumertypeuuid } })
        let departmentuuids = await db.costumertypedepartmentModel.findAll({
            where: {
                CostumertypeID: costumertypeuuid,
            }
        });
        createdCostumertype.Departments = await db.departmentModel.findAll({
            where: {
                Uuid: departmentuuids.map(u => { return u.DepartmentID })
            }
        })
        res.status(200).json(createdCostumertype)
    } catch (err) {
        await t.rollback()
        sequelizeErrorCatcher(err)
        next()
    }
}

async function UpdateCostumertype(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Departments,
        Uuid
    } = req.body

    if (!Name || !validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.COSTUMERTYPEID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_COSTUMERTYPEID, req.language)
    }
    if (!Departments || !Array.isArray(Departments) || Departments.length <= 0) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTS_REQUIRED, req.language)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const costumertype = db.costumertypeModel.findOne({ where: { Uuid: Uuid } })
        if (!costumertype) {
            return next(createNotfounderror([messages.ERROR.COSTUMERTYPE_NOT_FOUND], req.language))
        }
        if (costumertype.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.COSTUMERTYPE_NOT_ACTIVE], req.language))
        }

        const t = await db.sequelize.transaction();

        await db.costumertypeModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await db.costumertypedepartmentModel.destroy({ where: { CostumertypeID: Uuid }, transaction: t });
        for (const department of Departments) {
            if (!department.Uuid || !validator.isUUID(department.Uuid)) {
                return next(createValidationError(messages.VALIDATION_ERROR.UNSUPPORTED_DEPARTMENTID, req.language))
            }
            await db.costumertypedepartmentModel.create({
                CostumertypeID: Uuid,
                DepartmentID: department.Uuid
            }, { transaction: t });
        }
        await t.commit()
        const updatedCostumertype = await db.costumertypeModel.findOne({ where: { Uuid: Uuid } })
        let departmentuuids = await db.costumertypedepartmentModel.findAll({
            where: {
                CostumertypeID: Uuid,
            }
        });
        updatedCostumertype.Departments = await db.departmentModel.findAll({
            where: {
                Uuid: departmentuuids.map(u => { return u.DepartmentID })
            }
        })
        res.status(200).json(UpdateCostumertype)
    } catch (error) {
        sequelizeErrorCatcher(error)
        next()
    }


}

async function DeleteCostumertype(req, res, next) {

    let validationErrors = []
    const {
        Uuid
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.COSTUMERTYPEID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_COSTUMERTYPEID, req.language)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const costumertype = db.costumertypeModel.findOne({ where: { Uuid: Uuid } })
        if (!costumertype) {
            return next(createNotfounderror([messages.ERROR.COSTUMERTYPE_NOT_FOUND], req.language))
        }
        if (costumertype.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.COSTUMERTYPE_NOT_ACTIVE], req.language))
        }
        const t = await db.sequelize.transaction();

        await db.costumertypedepartmentModel.destroy({ where: { CostumertypeID: Uuid }, transaction: t });
        await db.costumertypeModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();

        res.status(200).json({ messages: "deleted", Uuid: Uuid })
    } catch (error) {
        await t.rollback();
        sequelizeErrorCatcher(error)
        next()
    }

}

module.exports = {
    GetCostumertypes,
    GetCostumertype,
    AddCostumertype,
    UpdateCostumertype,
    DeleteCostumertype,
}