const { types } = require("../Constants/Defines")
const messages = require("../Constants/Messages")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetCostumertypes(req, res, next) {
    try {
        const costumertypes = await db.costumertypeModel.findAll({ where: { Isactive: true } })
        for (const costumertype of costumertypes) {
            costumertype.Departmentuuids = await db.costumertypedepartmentModel.findAll({
                where: {
                    CostumertypeID: costumertype.Uuid,
                },
                attributes: ['DepartmentID']
            });
        }
        res.status(200).json(costumertypes)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
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
        const costumertype = await db.costumertypeModel.findOne({ where: { Uuid: req.params.costumertypeId } });
        if (!costumertype) {
            return createNotfounderror([messages.ERROR.COSTUMERTYPE_NOT_FOUND])
        }
        if (!costumertype.Isactive) {
            return createNotfounderror([messages.ERROR.COSTUMERTYPE_NOT_ACTIVE])
        }
        costumertype.Departmentuuids = await db.costumertypedepartmentModel.findAll({
            where: {
                CostumertypeID: costumertype.Uuid,
            },
            attributes: ['DepartmentID']
        });
        res.status(200).json(costumertype)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddCostumertype(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Departments,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isArray(Departments)) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTS_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let costumertypeuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        await db.costumertypeModel.create({
            ...req.body,
            Uuid: costumertypeuuid,
            Createduser: username,
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

        await CreateNotification({
            type: types.Create,
            service: 'Müşteri Türleri',
            role: 'costumertypenotification',
            message: `${Name} müşteri türü ${username} tarafından Oluşturuldu.`,
            pushurl: '/Costumertypes'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetCostumertypes(req, res, next)
}

async function UpdateCostumertype(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Departments,
        Uuid
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.COSTUMERTYPEID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_COSTUMERTYPEID)
    }
    if (!validator.isArray(Departments)) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTS_REQUIRED)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        const costumertype = await db.costumertypeModel.findOne({ where: { Uuid: Uuid } })
        if (!costumertype) {
            return next(createNotfounderror([messages.ERROR.COSTUMERTYPE_NOT_FOUND], req.language))
        }
        if (costumertype.Isactive === false) {
            return next(createNotfounderror([messages.ERROR.COSTUMERTYPE_NOT_ACTIVE], req.language))
        }

        await db.costumertypeModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

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

        await CreateNotification({
            type: types.Update,
            service: 'Müşteri Türleri',
            role: 'costumertypenotification',
            message: `${Name} müşteri türü ${username} tarafından Güncellendi.`,
            pushurl: '/Costumertypes'
        })
        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetCostumertypes(req, res, next)
}

async function DeleteCostumertype(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.costumertypeId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.COSTUMERTYPEID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_COSTUMERTYPEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        const costumertype = await db.costumertypeModel.findOne({ where: { Uuid: Uuid } })
        if (!costumertype) {
            return next(createNotfounderror([messages.ERROR.COSTUMERTYPE_NOT_FOUND], req.language))
        }
        if (costumertype.Isactive === false) {
            return next(createNotfounderror([messages.ERROR.COSTUMERTYPE_NOT_ACTIVE], req.language))
        }

        await db.costumertypeModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: 'Müşteri Türleri',
            role: 'costumertypenotification',
            message: `${costumertype?.Name} müşteri türü ${username} tarafından Silindi.`,
            pushurl: '/Costumertypes'
        })
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetCostumertypes(req, res, next)
}

module.exports = {
    GetCostumertypes,
    GetCostumertype,
    AddCostumertype,
    UpdateCostumertype,
    DeleteCostumertype,
}