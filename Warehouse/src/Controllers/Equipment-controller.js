const CreateNotification = require("../../../System/src/Utilities/CreateNotification")
const config = require("../Config")
const { types } = require("../Constants/Defines")
const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')

async function GetEquipments(req, res, next) {
    try {
        const equipments = await db.equipmentModel.findAll({ where: { Isactive: true } })
        for (const equipment of equipments) {
            equipment.Equipmentproperties = await db.equipmentpropertyModel.findAll({
                where: {
                    EquipmentID: equipment.Uuid,
                }

            });
        }
        res.status(200).json(equipments)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetEquipment(req, res, next) {

    let validationErrors = []
    if (!req.params.equipmentId) {
        validationErrors.push(messages.VALIDATION_ERROR.EQUIPMENTID_REQUIRED)
    }
    if (!validator.isUUID(req.params.equipmentId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_EQUIPMENTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const equipment = await db.equipmentModel.findOne({ where: { Uuid: req.params.equipmentId } });
        if (!equipment) {
            return next(createNotfounderror([messages.ERROR.EQUIPMENT_NOT_FOUND], req.language))
        }
        if (!equipment.Isactive) {
            return next(createNotfounderror([messages.ERROR.EQUIPMENT_NOT_ACTIVE], req.language))
        }
        equipment.Equipmentproperties = await db.equipmentpropertyModel.findAll({
            where: {
                EquipmentID: equipment.Uuid,
            }

        });
        res.status(200).json(equipment)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddEquipment(req, res, next) {

    let validationErrors = []
    const {
        Name,
        EquipmentgroupID,
        UserID,
        Equipmentproperties
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isUUID(EquipmentgroupID)) {
        validationErrors.push(messages.VALIDATION_ERROR.EQUIPMENTGROUPID_REQUIRED)
    }
    if (!validator.isUUID(UserID)) {
        validationErrors.push(messages.VALIDATION_ERROR.USERID_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let equipmentuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.equipmentModel.create({
            ...req.body,
            Uuid: equipmentuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        for (const equipmentproperty of (Equipmentproperties || [])) {
            await db.equipmentpropertyModel.create({
                ...equipmentproperty,
                EquipmentID: equipmentuuid,
            }, { transaction: t });
        }

        await CreateNotification({
            type: types.Create,
            service: 'Ekipmanlar',
            role: 'equipmentnotification',
            message: `${Name} ekipmanı ${username} tarafından Oluşturuldu.`,
            pushurl: '/Equipments'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        next(sequelizeErrorCatcher(err))
    }
    GetEquipments(req, res, next)
}

async function UpdateEquipment(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Uuid,
        EquipmentgroupID,
        UserID,
        Equipmentproperties
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isUUID(EquipmentgroupID)) {
        validationErrors.push(messages.VALIDATION_ERROR.EQUIPMENTGROUPID_REQUIRED)
    }
    if (!validator.isUUID(UserID)) {
        validationErrors.push(messages.VALIDATION_ERROR.USERID_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.EQUIPMENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_EQUIPMENTID)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const equipment =await db.equipmentModel.findOne({ where: { Uuid: Uuid } })
        if (!equipment) {
            return next(createNotfounderror([messages.ERROR.EQUIPMENTGROUP_NOT_FOUND], req.language))
        }
        if (equipment.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.EQUIPMENTGROUP_NOT_ACTIVE], req.language))
        }

        await db.equipmentModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })
        await db.equipmentpropertyModel.destroy({ where: { EquipmentID: Uuid }, transaction: t });
        for (const equipmentproperty of (Equipmentproperties || [])) {
            await db.equipmentpropertyModel.create({
                ...equipmentproperty,
                EquipmentID: Uuid,
            }, { transaction: t });
        }

        await CreateNotification({
            type: types.Update,
            service: 'Ekipmanlar',
            role: 'equipmentnotification',
            message: `${Name} ekipmanı ${username} tarafından Güncellendi.`,
            pushurl: '/Equipments'
        })
        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetEquipments(req, res, next)
}

async function DeleteEquipment(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.equipmentId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.EQUIPMENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_EQUIPMENTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const equipment = await db.equipmentModel.findOne({ where: { Uuid: Uuid } })
        if (!equipment) {
            return next(createNotfounderror([messages.ERROR.EQUIPMENTGROUP_NOT_FOUND], req.language))
        }
        if (equipment.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.EQUIPMENT_NOT_ACTIVE], req.language))
        }

        await db.equipmentModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await db.equipmentpropertyModel.destroy({ where: { EquipmentID: Uuid }, transaction: t });

        await CreateNotification({
            type: types.Delete,
            service: 'Ekipmanlar',
            role: 'equipmentnotification',
            message: `${equipment?.Name} ekipmanı ${username} tarafından Silindi.`,
            pushurl: '/Equipments'
        })
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetEquipments(req, res, next)
}

module.exports = {
    GetEquipments,
    GetEquipment,
    AddEquipment,
    UpdateEquipment,
    DeleteEquipment,
}