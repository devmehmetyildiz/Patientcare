const CreateNotification = require("../Utilities/CreateNotification")
const config = require("../Config")
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
            service: messages.NOTIFICATION.PAGE_NAME,
            role: 'equipmentgroupnotification',
            message: {
                tr: `${Name} ekipman grubu ${username} tarafından Oluşturuldu.`,
                en: `${Name} equipment group Created By ${username}.`,
            },
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
        const equipmentgroup = await db.equipmentgroupModel.findOne({ where: { Uuid: Uuid } })
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
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: messages.NOTIFICATION.PAGE_NAME,
            role: 'equipmentgroupnotification',
            message: {
                tr: `${Name} ekipman grubu ${username} tarafından Güncellendi.`,
                en: `${Name} equipment group Created By ${username}.`,
            },
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

        await db.equipmentgroupModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: messages.NOTIFICATION.PAGE_NAME,
            role: 'equipmentgroupnotification',
            message: {
                tr: `${equipmentgroup?.Name} ekipman grubu ${username} tarafından Silindi.`,
                en: `${equipmentgroup?.Name} equipment group Deleted By ${username}.`,
            },
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


const messages = {
    NOTIFICATION: {
        PAGE_NAME: {
            en: 'Equipment Groups',
            tr: 'Ekipman Grupları',
        },
    },
    ERROR: {
        EQUIPMENTGROUP_NOT_FOUND: {
            code: 'EQUIPMENTGROUP_NOT_FOUND', description: {
                en: 'Equipment Group not found',
                tr: 'Envarter Grubu bulunamadı',
            }
        },

        EQUIPMENTGROUP_NOT_ACTIVE: {
            code: 'EQUIPMENTGROUP_NOT_ACTIVE', description: {
                en: 'Equipment Group not active',
                tr: 'Envarter Grubu bulunamadı',
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
        DEPARTMENTID_REQUIRED: {
            code: 'DEPARTMENTID_REQUIRED', description: {
                en: 'The departmentid required',
                tr: 'Bu işlem için departmentid gerekli',
            }
        },
        PERSONELNAME_REQUIRED: {
            code: 'PERSONELNAME_REQUIRED', description: {
                en: 'The personel name required',
                tr: 'Bu işlem için satın alma görevli adı gerekli',
            }
        },
        UNSUPPORTED_EQUIPMENTGROUPID: {
            code: 'UNSUPPORTED_EQUIPMENTGROUPID', description: {
                en: 'The equipment group id is unsupported',
                tr: 'Geçersiz equipment group id',
            }
        },
    }
}
