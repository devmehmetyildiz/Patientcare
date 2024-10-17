const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const { types } = require("../Constants/Defines")

async function GetEquipmentgroups(req, res, next) {
    try {
        const equipmentgroups = await db.equipmentgroupModel.findAll({ where: { Isactive: true } })
        for (const equipmentgroup of equipmentgroups) {
            equipmentgroup.Equipments = await db.equipmentModel.findAll({
                where: {
                    EquipmentgroupID: equipmentgroup.Uuid,
                }
            });
        }
        res.status(200).json(equipmentgroups)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetEquipmentgroup(req, res, next) {

    let validationErrors = []
    if (!req.params.equipmentgroupId) {
        validationErrors.push(req.t('Equipmentgroups.Error.EquipmentgroupIDRequired'))
    }
    if (!validator.isUUID(req.params.equipmentgroupId)) {
        validationErrors.push(req.t('Equipmentgroups.Error.UnsupportedEquipmentgroupID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Equipmentgroups'), req.language))
    }

    try {
        const equipmentgroup = await db.equipmentgroupModel.findOne({ where: { Uuid: req.params.equipmentgroupId } });
        if (!equipmentgroup) {
            return next(createNotFoundError(req.t('Equipmentgroups.Error.NotFound'), req.t('Equipmentgroups'), req.language))
        }
        if (!equipmentgroup.Isactive) {
            return next(createNotFoundError(req.t('Equipmentgroups.Error.NotActive'), req.t('Equipmentgroups'), req.language))
        }
        equipmentgroup.Equipments = await db.equipmentModel.findAll({
            where: {
                EquipmentgroupID: equipmentgroup.Uuid,
            }

        });
        res.status(200).json(equipmentgroup)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddEquipmentgroup(req, res, next) {

    let validationErrors = []
    const {
        Name,
        DepartmentID,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Equipmentgroups.Error.NameRequired'))
    }
    if (!DepartmentID || !validator.isUUID(DepartmentID)) {
        validationErrors.push(req.t('Equipmentgroups.Error.DepartmentRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Equipmentgroups'), req.language))
    }

    let equipmentgroupuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.equipmentgroupModel.create({
            ...req.body,
            Uuid: equipmentgroupuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: req.t('Equipmentgroups'),
            role: 'equipmentgroupnotification',
            message: {
                tr: `${Name} Ekipman Grubu ${username} tarafından Oluşturuldu.`,
                en: `${Name} Equipment Group Created by ${username}`
            }[req.language],
            pushurl: '/Equipmentgroups'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        next(sequelizeErrorCatcher(err))
    }
    GetEquipmentgroups(req, res, next)
}

async function UpdateEquipmentgroup(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Uuid,
        DepartmentID,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Equipmentgroups.Error.NameRequired'))
    }
    if (!DepartmentID || !validator.isUUID(DepartmentID)) {
        validationErrors.push(req.t('Equipmentgroups.Error.DepartmentRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Equipmentgroups.Error.EquipmentgroupIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Equipmentgroups.Error.UnsupportedEquipmentgroupID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Equipmentgroups'), req.language))
    }
    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const equipmentgroup = await db.equipmentgroupModel.findOne({ where: { Uuid: Uuid } })
        if (!equipmentgroup) {
            return next(createNotFoundError(req.t('Equipmentgroups.Error.NotFound'), req.t('Equipmentgroups'), req.language))
        }
        if (!equipmentgroup.Isactive) {
            return next(createNotFoundError(req.t('Equipmentgroups.Error.NotActive'), req.t('Equipmentgroups'), req.language))
        }

        await db.equipmentgroupModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Equipmentgroups'),
            role: 'equipmentgroupnotification',
            message: {
                tr: `${Name} Ekipman Grubu ${username} tarafından Güncellendi.`,
                en: `${Name} Equipment Group Updated by ${username}`
            }[req.language],
            pushurl: '/Equipmentgroups'
        })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetEquipmentgroups(req, res, next)
}

async function DeleteEquipmentgroup(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.equipmentgroupId

    if (!Uuid) {
        validationErrors.push(req.t('Equipmentgroups.Error.EquipmentgroupIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Equipmentgroups.Error.UnsupportedEquipmentgroupID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Equipmentgroups'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const equipmentgroup = await db.equipmentgroupModel.findOne({ where: { Uuid: Uuid } })
        if (!equipmentgroup) {
            return next(createNotFoundError(req.t('Equipmentgroups.Error.NotFound'), req.t('Equipmentgroups'), req.language))
        }
        if (!equipmentgroup.Isactive) {
            return next(createNotFoundError(req.t('Equipmentgroups.Error.NotActive'), req.t('Equipmentgroups'), req.language))
        }

        await db.equipmentgroupModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Equipmentgroups'),
            role: 'equipmentgroupnotification',
            message: {
                tr: `${equipmentgroup?.Name} Ekipman Grubu ${username} tarafından Silindi.`,
                en: `${equipmentgroup?.Name} Equipment Group Deleted by ${username}`
            }[req.language],
            pushurl: '/Equipmentgroups'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetEquipmentgroups(req, res, next)
}

module.exports = {
    GetEquipmentgroups,
    GetEquipmentgroup,
    AddEquipmentgroup,
    UpdateEquipmentgroup,
    DeleteEquipmentgroup,
}
