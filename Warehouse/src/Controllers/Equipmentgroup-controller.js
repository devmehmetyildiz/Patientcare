const CreateNotification = require("../Utilities/CreateNotification")
const config = require("../Config")
const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')
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
        validationErrors.push(messages.VALIDATION_ERROR.EQUIPMENTGROUPID_REQUIRED)
    }
    if (!validator.isUUID(req.params.equipmentgroupId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_EQUIPMENTGROUPID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const equipmentgroup = await db.equipmentgroupModel.findOne({ where: { Uuid: req.params.equipmentgroupId } });
        if (!equipmentgroup) {
            return next(createNotfounderror([messages.ERROR.EQUIPMENTGROUP_NOT_FOUND], req.language))
        }
        if (!equipmentgroup.Isactive) {
            return next(createNotfounderror([messages.ERROR.EQUIPMENTGROUP_NOT_ACTIVE], req.language))
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
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!DepartmentID || !validator.isUUID(DepartmentID)) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
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
            service: 'Ekipman Grupları',
            role: 'equipmentgroupnotification',
            message: `${Name} ekipmanı grubu ${username} tarafından Oluşturuldu.`,
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
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!DepartmentID || !validator.isUUID(DepartmentID)) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTID_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.EQUIPMENTGROUPID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_EQUIPMENTGROUPID)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const equipmentgroup =await db.equipmentgroupModel.findOne({ where: { Uuid: Uuid } })
        if (!equipmentgroup) {
            return next(createNotfounderror([messages.ERROR.EQUIPMENTGROUP_NOT_FOUND], req.language))
        }
        if (equipmentgroup.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.EQUIPMENTGROUP_NOT_ACTIVE], req.language))
        }

        await db.equipmentgroupModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Ekipman Grupları',
            role: 'equipmentgroupnotification',
            message: `${Name} ekipmanı grubu ${username} tarafından Güncellendi.`,
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
        validationErrors.push(messages.VALIDATION_ERROR.EQUIPMENTGROUPID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_EQUIPMENTGROUPID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const equipmentgroup = await db.equipmentgroupModel.findOne({ where: { Uuid: Uuid } })
        if (!equipmentgroup) {
            return next(createNotfounderror([messages.ERROR.EQUIPMENTGROUP_NOT_FOUND], req.language))
        }
        if (equipmentgroup.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.EQUIPMENTGROUP_NOT_ACTIVE], req.language))
        }

        await db.equipmentgroupModel.destroy({ where: { Uuid: Uuid }, transaction: t });

        await CreateNotification({
            type: types.Delete,
            service: 'Ekipman Grupları',
            role: 'equipmentgroupnotification',
            message: `${equipmentgroup?.Name} ekipmanı grubu ${username} tarafından Silindi.`,
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