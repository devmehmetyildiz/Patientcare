const CreateNotification = require("../Utilities/CreateNotification")
const config = require("../Config")
const { types } = require("../Constants/Defines")
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
            service: messages.NOTIFICATION.PAGE_NAME,
            role: 'equipmentnotification',
            message: {
                tr: `${Name} ekipmanı ${username} tarafından Oluşturuldu.`,
                en: `${Name} equipment Created By ${username}.`,
            },
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
        const equipment = await db.equipmentModel.findOne({ where: { Uuid: Uuid } })
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
            service: messages.NOTIFICATION.PAGE_NAME,
            role: 'equipmentnotification',
            message: {
                tr: `${Name} ekipmanı ${username} tarafından Güncellendi.`,
                en: `${Name} equipment Updated By ${username}.`,
            },
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

        await db.equipmentModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: messages.NOTIFICATION.PAGE_NAME,
            role: 'equipmentnotification',
            message: {
                tr: `${equipment?.Name} ekipmanı ${username} tarafından Silindi.`,
                en: `${equipment?.Name} equipment Deleted By ${username}.`,
            },
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

const messages = {
    NOTIFICATION: {
        PAGE_NAME: {
            en: 'Equipments',
            tr: 'Ekipmanlar',
        },
    },
    ERROR: {
        EQUIPMENTGROUP_NOT_FOUND: {
            code: 'EQUIPMENTGROUP_NOT_FOUND', description: {
                en: 'Equipment Group not found',
                tr: 'Envarter Grubu bulunamadı',
            }
        },
        EQUIPMENT_NOT_FOUND: {
            code: 'EQUIPMENT_NOT_FOUND', description: {
                en: 'Equipment not found',
                tr: 'Envarter bulunamadı',
            }
        },
        EQUIPMENTGROUP_NOT_ACTIVE: {
            code: 'EQUIPMENTGROUP_NOT_ACTIVE', description: {
                en: 'Equipment Group not active',
                tr: 'Envarter Grubu bulunamadı',
            }
        },
        EQUIPMENT_NOT_ACTIVE: {
            code: 'EQUIPMENT_NOT_ACTIVE', description: {
                en: 'Equipment not active',
                tr: 'Envarter bulunamadı',
            }
        },
    },
    VALIDATION_ERROR: {
        NAME_REQUIRED: {
            code: 'NAME_REQUIRED', description: {
                en: 'The name required',
                tr: 'Bu işlem için isim gerekli',
            }
        },
        EQUIPMENTGROUPID_REQUIRED: {
            code: 'EQUIPMENTGROUPID_REQUIRED', description: {
                en: 'The equipment group id required',
                tr: 'Bu işlem için equipment group id gerekli',
            }
        },
        EQUIPMENTID_REQUIRED: {
            code: 'EQUIPMENTID_REQUIRED', description: {
                en: 'The equipment id required',
                tr: 'Bu işlem için equipment id gerekli',
            }
        },
        USERID_REQUIRED: {
            code: 'USERID_REQUIRED', description: {
                en: 'The userid required',
                tr: 'Bu işlem için userid gerekli',
            }
        },
        PERSONELNAME_REQUIRED: {
            code: 'PERSONELNAME_REQUIRED', description: {
                en: 'The personel name required',
                tr: 'Bu işlem için satın alma görevli adı gerekli',
            }
        },
        UNSUPPORTED_EQUIPMENTID: {
            code: 'UNSUPPORTED_EQUIPMENTID', description: {
                en: 'The equipment id is unsupported',
                tr: 'Geçersiz equipment id',
            }
        },
    }
}
