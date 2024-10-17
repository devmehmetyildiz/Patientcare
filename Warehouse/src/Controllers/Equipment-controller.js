const CreateNotification = require("../Utilities/CreateNotification")
const { types } = require("../Constants/Defines")
const { sequelizeErrorCatcher, } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

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
        validationErrors.push(req.t('Equipments.Error.EquipmentIDRequired'))
    }
    if (!validator.isUUID(req.params.equipmentId)) {
        validationErrors.push(req.t('Equipments.Error.UnsupportedEquipmentID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Equipments'), req.language))
    }

    try {
        const equipment = await db.equipmentModel.findOne({ where: { Uuid: req.params.equipmentId } });
        if (!equipment) {
            return next(createNotFoundError(req.t('Equipments.Error.NotFound'), req.t('Equipments'), req.language))
        }
        if (!equipment.Isactive) {
            return next(createNotFoundError(req.t('Equipments.Error.NotActive'), req.t('Equipments'), req.language))
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
        validationErrors.push(req.t('Equipments.Error.NameRequired'))
    }
    if (!validator.isUUID(EquipmentgroupID)) {
        validationErrors.push(req.t('Equipments.Error.EquipmentgroupRequired'))
    }
    if (!validator.isUUID(UserID)) {
        validationErrors.push(req.t('Equipments.Error.UserIDRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Equipments'), req.language))
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
            service: req.t('Equipments'),
            role: 'equipmentnotification',
            message: {
                tr: `${Name} Eqipmanı  ${username} tarafından Oluşturuldu.`,
                en: `${Name} Equipment  Created by ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Equipments.Error.NameRequired'))
    }
    if (!validator.isUUID(EquipmentgroupID)) {
        validationErrors.push(req.t('Equipments.Error.EquipmentgroupRequired'))
    }
    if (!validator.isUUID(UserID)) {
        validationErrors.push(req.t('Equipments.Error.UserIDRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Equipments.Error.EquipmentIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Equipments.Error.UnsupportedEquipmentID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Equipments'), req.language))
    }
    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const equipment = await db.equipmentModel.findOne({ where: { Uuid: Uuid } })
        if (!equipment) {
            return next(createNotFoundError(req.t('Equipments.Error.NotFound'), req.t('Equipments'), req.language))
        }
        if (!equipment.Isactive) {
            return next(createNotFoundError(req.t('Equipments.Error.NotActive'), req.t('Equipments'), req.language))
        }

        await db.equipmentModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })
        await db.equipmentpropertyModel.destroy({ where: { EquipmentID: Uuid }, transaction: t });
        for (const equipmentproperty of (Equipmentproperties || [])) {
            await db.equipmentpropertyModel.create({
                ...equipmentproperty,
                EquipmentID: Uuid,
            }, { transaction: t });
        }

        await CreateNotification({
            type: types.Update,
            service: req.t('Equipments'),
            role: 'equipmentnotification',
            message: {
                tr: `${Name} Eqipmanı ${username} tarafından Güncellendi.`,
                en: `${Name} Equipment Updated by ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Equipments.Error.EquipmentIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Equipments.Error.UnsupportedEquipmentID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Equipments'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const equipment = await db.equipmentModel.findOne({ where: { Uuid: Uuid } })
        if (!equipment) {
            return next(createNotFoundError(req.t('Equipments.Error.NotFound'), req.t('Equipments'), req.language))
        }
        if (!equipment.Isactive) {
            return next(createNotFoundError(req.t('Equipments.Error.NotActive'), req.t('Equipments'), req.language))
        }

        await db.equipmentModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Equipments'),
            role: 'equipmentnotification',
            message: {
                tr: `${equipment?.Name} Ekipmanı ${username} tarafından Silindi.`,
                en: `${equipment?.Name} Equipment Deleted by ${username}`
            }[req.language],
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