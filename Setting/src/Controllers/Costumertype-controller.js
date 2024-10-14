const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetCostumertypes(req, res, next) {
    try {
        const costumertypes = await db.costumertypeModel.findAll()
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
        validationErrors.push(req.t('Costmertypes.Error.CostumertypeIDRequired'))
    }
    if (!validator.isUUID(req.params.costumertypeId)) {
        validationErrors.push(req.t('Costmertypes.Error.UnsupportedCostumertypeID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Costmertypes'), req.language))
    }

    try {
        const costumertype = await db.costumertypeModel.findOne({ where: { Uuid: req.params.costumertypeId } });
        if (!costumertype) {
            return next(createNotFoundError(req.t('Costmertypes.Error.NotFound'), req.t('Costmertypes'), req.language))
        }
        if (!costumertype.Isactive) {
            return next(createNotFoundError(req.t('Costmertypes.Error.NotActive'), req.t('Costmertypes'), req.language))
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
        validationErrors.push(req.t('Costmertypes.Error.NameRequired'))
    }
    if (!validator.isArray(Departments)) {
        validationErrors.push(req.t('Costmertypes.Error.DepartmentsRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Costmertypes'), req.language))
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
                return next(createValidationError(req.t('Costmertypes.Error.DepartmentsRequired'), req.t('Costmertypes'), req.language))
            }
            await db.costumertypedepartmentModel.create({
                CostumertypeID: costumertypeuuid,
                DepartmentID: department.Uuid
            }, { transaction: t });
        }

        await CreateNotification({
            type: types.Create,
            service: req.t('Costmertypes'),
            role: 'costumertypenotification',
            message: {
                en: `${Name} Costumertype Created By ${username}.`,
                tr: `${Name} Müşteri Türü ${username} Tarafından Oluşturuldu.`
            }[req.language],
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
        validationErrors.push(req.t('Costmertypes.Error.NameRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Costmertypes.Error.CostumertypeIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Costmertypes.Error.UnsupportedCostumertypeID'))
    }
    if (!validator.isArray(Departments)) {
        validationErrors.push(req.t('Costmertypes.Error.DepartmentsRequired'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        const costumertype = await db.costumertypeModel.findOne({ where: { Uuid: Uuid } })
        if (!costumertype) {
            return next(createNotFoundError(req.t('Costmertypes.Error.NotFound'), req.t('Costmertypes'), req.language))
        }
        if (costumertype.Isactive === false) {
            return next(createNotFoundError(req.t('Costmertypes.Error.NotActive'), req.t('Costmertypes'), req.language))
        }

        await db.costumertypeModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.costumertypedepartmentModel.destroy({ where: { CostumertypeID: Uuid }, transaction: t });
        for (const department of Departments) {
            if (!department.Uuid || !validator.isUUID(department.Uuid)) {
                return next(createValidationError(req.t('Costmertypes.Error.DepartmentsRequired'), req.t('Costmertypes'), req.language))
            }
            await db.costumertypedepartmentModel.create({
                CostumertypeID: Uuid,
                DepartmentID: department.Uuid
            }, { transaction: t });
        }

        await CreateNotification({
            type: types.Update,
            service: req.t('Costmertypes'),
            role: 'costumertypenotification',
            message: {
                en: `${Name} Costumertype Updated By ${username}.`,
                tr: `${Name} Müşteri Türü ${username} Tarafından Güncellendi.`
            }[req.language],
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
        validationErrors.push(req.t('Costmertypes.Error.CostumertypeIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Costmertypes.Error.UnsupportedCostumertypeID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        const costumertype = await db.costumertypeModel.findOne({ where: { Uuid: Uuid } })
        if (!costumertype) {
            return next(createNotFoundError(req.t('Costmertypes.Error.NotFound'), req.t('Costmertypes'), req.language))
        }
        if (costumertype.Isactive === false) {
            return next(createNotFoundError(req.t('Costmertypes.Error.NotActive'), req.t('Costmertypes'), req.language))
        }

        await db.costumertypeModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Costmertypes'),
            role: 'costumertypenotification',
            message: {
                en: `${costumertype?.Name} Costumertype Deleted By ${username}.`,
                tr: `${costumertype?.Name} Müşteri Türü ${username} Tarafından Silindi.`
            }[req.language],
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