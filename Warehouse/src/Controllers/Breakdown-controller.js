const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const config = require("../Config")
const { sequelizeErrorCatcher, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')
const { formatDate } = require("../Utilities/Convert")

async function GetBreakdowns(req, res, next) {
    try {
        let data = null
        const breakdowns = await db.breakdownModel.findAll({ where: { Isactive: true } })
        if (req?.Uuid) {
            data = await db.breakdownModel.findOne({ where: { Uuid: req?.Uuid } });
        }
        res.status(200).json({ list: breakdowns, data: data })
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetBreakdown(req, res, next) {

    let validationErrors = []
    if (!req.params.breakdownId) {
        validationErrors.push(messages.VALIDATION_ERROR.BREAKDOWNID_REQUIRED)
    }
    if (!validator.isUUID(req.params.breakdownId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_BREAKDOWNID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const breakdown = await db.breakdownModel.findOne({ where: { Uuid: req.params.breakdownId } });
        if (!breakdown) {
            return next(createNotfounderror([messages.ERROR.BREAKDOWN_NOT_FOUND], req.language))
        }
        if (!breakdown.Isactive) {
            return next(createNotfounderror([messages.ERROR.BREAKDOWN_NOT_ACTIVE], req.language))
        }
        res.status(200).json(breakdown)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddBreakdown(req, res, next) {

    let validationErrors = []
    const {
        EquipmentID,
        ResponsibleuserID,
    } = req.body

    if (!validator.isUUID(EquipmentID)) {
        validationErrors.push(messages.VALIDATION_ERROR.EQUIPMENTID_REQUIRED)
    }
    if (!validator.isUUID(ResponsibleuserID)) {
        validationErrors.push(messages.VALIDATION_ERROR.USERID_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let breakdownuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const startDate = new Date()

        await db.breakdownModel.create({
            ...req.body,
            Uuid: breakdownuuid,
            Starttime: startDate,
            Createduser: username,
            Createtime: startDate,
            Isactive: true
        }, { transaction: t })

        const equipment = await db.equipmentModel.findOne({ where: { Uuid: EquipmentID } })

        await CreateNotification({
            type: types.Create,
            service: messages.NOTIFICATION.PAGE_NAME,
            role: 'breakdownnotification',
            message: {
                tr: `${equipment?.Name} Eqipmanı İçin Arıza Talebi ${username} Tarafından Oluşturuldu.`,
                en: `${equipment?.Name} Equipment Name, Breakdown Request Created By ${username} `
            },
            pushurl: '/Breakdowns'
        })
        await t.commit()
    } catch (err) {
        await t.rollback()
        next(sequelizeErrorCatcher(err))
    }
    req.Uuid = breakdownuuid
    GetBreakdowns(req, res, next)
}

async function UpdateBreakdown(req, res, next) {

    let validationErrors = []
    const {
        Uuid,
        EquipmentID,
        ResponsibleuserID,
    } = req.body


    if (!validator.isUUID(EquipmentID)) {
        validationErrors.push(messages.VALIDATION_ERROR.EQUIPMENTID_REQUIRED)
    }
    if (!validator.isUUID(ResponsibleuserID)) {
        validationErrors.push(messages.VALIDATION_ERROR.USERID_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.BREAKDOWNID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_BREAKDOWNID)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const breakdown = await db.breakdownModel.findOne({ where: { Uuid: Uuid } })
        if (!breakdown) {
            return next(createNotfounderror([messages.ERROR.BREAKDOWN_NOT_FOUND], req.language))
        }
        if (breakdown.Isactive === false) {
            return next(createNotfounderror([messages.ERROR.BREAKDOWN_NOT_ACTIVE], req.language))
        }

        await db.breakdownModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        const equipment = await db.equipmentModel.findOne({ where: { Uuid: breakdown.EquipmentID } })

        await CreateNotification({
            type: types.Update,
            service: messages.NOTIFICATION.PAGE_NAME,
            role: 'breakdownnotification',
            message: {
                tr: `${formatDate(breakdown.Starttime)} Başlangıç Tarihli, ${equipment?.Name} Eqipmanı İçin Açılan Arıza Talebi ${username} Tarafından Güncellendi.`,
                en: `${formatDate(breakdown.Starttime)} Start Date, ${equipment.Name} Equipment Name, Breakdown Request Updated By ${username} `
            },
            pushurl: '/Breakdowns'
        })
        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    req.Uuid = Uuid
    GetBreakdowns(req, res, next)
}

async function CompleteBreakdown(req, res, next) {

    let validationErrors = []
    const {
        Uuid,
    } = req.body


    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.BREAKDOWNID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_BREAKDOWNID)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const breakdown = await db.breakdownModel.findOne({ where: { Uuid: Uuid } })
        if (!breakdown) {
            return next(createNotfounderror([messages.ERROR.BREAKDOWN_NOT_FOUND], req.language))
        }
        if (breakdown.Isactive === false) {
            return next(createNotfounderror([messages.ERROR.BREAKDOWN_NOT_ACTIVE], req.language))
        }

        await db.breakdownModel.update({
            ...req.body,
            Iscompleted: true,
            Endtime: new Date(),
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        const equipment = await db.equipmentModel.findOne({ where: { Uuid: breakdown.EquipmentID } })

        await CreateNotification({
            type: types.Update,
            service: messages.NOTIFICATION.PAGE_NAME,
            role: 'breakdownnotification',
            message: {
                tr: `${formatDate(breakdown.Starttime)} Başlangıç Tarihli, ${equipment?.Name} Eqipmanı İçin Açılan Arıza Talebi ${username} Tarafından Tamamlandı.`,
                en: `${formatDate(breakdown.Starttime)} Start Date, ${equipment.Name} Equipment Name, Breakdown Request Completed By ${username} `
            },
            pushurl: '/Breakdowns'
        })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetBreakdowns(req, res, next)
}

async function DeleteBreakdown(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.breakdownId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.BREAKDOWNID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_BREAKDOWNID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const breakdown = await db.breakdownModel.findOne({ where: { Uuid: Uuid } })
        if (!breakdown) {
            return next(createNotfounderror([messages.ERROR.BREAKDOWN_NOT_FOUND], req.language))
        }
        if (breakdown.Isactive === false) {
            return next(createNotfounderror([messages.ERROR.BREAKDOWN_NOT_ACTIVE], req.language))
        }

        await db.breakdownModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        const equipment = await db.equipmentModel.findOne({ where: { Uuid: breakdown.EquipmentID } })

        await CreateNotification({
            type: types.Delete,
            service: messages.NOTIFICATION.PAGE_NAME,
            role: 'breakdownnotification',
            message: {
                tr: `${formatDate(breakdown.Starttime)} Başlangıç Tarihli, ${equipment?.Name} Eqipmanı İçin Açılan Arıza Talebi ${username} Tarafından Silindi.`,
                en: `${formatDate(breakdown.Starttime)} Start Date, ${equipment.Name} Equipment Name, Breakdown Request Deleted By ${username} `
            },
            pushurl: '/Breakdowns'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetBreakdowns(req, res, next)
}

module.exports = {
    GetBreakdowns,
    GetBreakdown,
    AddBreakdown,
    UpdateBreakdown,
    DeleteBreakdown,
    CompleteBreakdown
}


const messages = {
    NOTIFICATION: {
        PAGE_NAME: {
            en: 'Breakdowns',
            tr: 'Arıza Talepleri',
        },
    },
    ERROR: {
        BREAKDOWN_NOT_FOUND: {
            code: 'BREAKDOWN_NOT_FOUND', description: {
                en: 'breakdown not found',
                tr: 'Arıza talebi bulunamadı',
            }
        },
        BREAKDOWN_NOT_ACTIVE: {
            code: 'BREAKDOWN_NOT_ACTIVE', description: {
                en: 'breakdown not active',
                tr: 'Arıza talebi aktif değil',
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
        BREAKDOWNID_REQUIRED: {
            code: 'BREAKDOWNID_REQUIRED', description: {
                en: 'The breakdownid required',
                tr: 'Bu işlem için breakdownid gerekli',
            }
        },
        UNSUPPORTED_BREAKDOWNID: {
            code: 'UNSUPPORTED_BREAKDOWNID', description: {
                en: 'The breakdownid is unsupported',
                tr: 'geçersiz breakdownid',
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
    }
}
