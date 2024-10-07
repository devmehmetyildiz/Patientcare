const config = require("../Config")
const { types } = require("../Constants/Defines")
const { formatDate } = require("../Utilities/Convert")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')

async function GetMainteancies(req, res, next) {
    try {
        let data = null
        const mainteancies = await db.mainteanceModel.findAll({ where: { Isactive: true } })
        if (req?.Uuid) {
            data = await db.mainteanceModel.findOne({ where: { Uuid: req?.Uuid } });
        }
        res.status(200).json({ list: mainteancies, data: data })
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetMainteance(req, res, next) {

    let validationErrors = []
    if (!req.params.mainteanceId) {
        validationErrors.push(messages.VALIDATION_ERROR.MAINTEANCEID_REQUIRED)
    }
    if (!validator.isUUID(req.params.mainteanceId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_MAINTEANCEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const mainteance = await db.mainteanceModel.findOne({ where: { Uuid: req.params.mainteanceId } });
        if (!mainteance) {
            return next(createNotfounderror([messages.ERROR.MAINTEANCE_NOT_FOUND], req.language))
        }
        if (!mainteance.Isactive) {
            return next(createNotfounderror([messages.ERROR.MAINTEANCE_NOT_ACTIVE], req.language))
        }
        res.status(200).json(mainteance)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddMainteance(req, res, next) {

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

    let mainteanceuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const startDate = new Date()

        await db.mainteanceModel.create({
            ...req.body,
            Uuid: mainteanceuuid,
            Starttime: startDate,
            Createduser: username,
            Createtime: startDate,
            Isactive: true
        }, { transaction: t })

        const equipment = await db.equipmentModel.findOne({ where: { Uuid: EquipmentID } })

        await CreateNotification({
            type: types.Create,
            service: messages.NOTIFICATION.PAGE_NAME,
            role: 'mainteancenotification',
            message: {
                tr: `${equipment?.Name} Eqipmanı İçin Arıza Talebi ${username} Tarafından Oluşturuldu.`,
                en: `${equipment?.Name} Equipment Name, Mainteancy Request Created By ${username} `
            },
            pushurl: '/Mainteancies'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        next(sequelizeErrorCatcher(err))
    }
    req.Uuid = mainteanceuuid
    GetMainteancies(req, res, next)
}

async function UpdateMainteance(req, res, next) {

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
        validationErrors.push(messages.VALIDATION_ERROR.MAINTEANCEID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_MAINTEANCEID)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const mainteance = await db.mainteanceModel.findOne({ where: { Uuid: Uuid } })
        if (!mainteance) {
            return next(createNotfounderror([messages.ERROR.MAINTEANCE_NOT_FOUND], req.language))
        }
        if (mainteance.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.MAINTEANCE_NOT_ACTIVE], req.language))
        }

        await db.mainteanceModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        const equipment = await db.equipmentModel.findOne({ where: { Uuid: mainteance.EquipmentID } })

        await CreateNotification({
            type: types.Update,
            service: messages.NOTIFICATION.PAGE_NAME,
            role: 'mainteancenotification',
            message: {
                tr: `${formatDate(mainteance.Starttime)} Başlangıç Tarihli, ${equipment?.Name} Eqipmanı İçin Açılan Bakım Talebi ${username} Tarafından Güncellendi.`,
                en: `${formatDate(mainteance.Starttime)} Start Date, ${equipment.Name} Equipment Name, Mainteancy Request Updated By ${username} `
            },
            pushurl: '/Mainteancies'
        })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    req.Uuid = Uuid
    GetMainteancies(req, res, next)
}

async function CompleteMainteance(req, res, next) {

    let validationErrors = []
    const {
        Uuid,
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.MAINTEANCEID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_MAINTEANCEID)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const mainteance = await db.mainteanceModel.findOne({ where: { Uuid: Uuid } })
        if (!mainteance) {
            return next(createNotfounderror([messages.ERROR.MAINTEANCE_NOT_FOUND], req.language))
        }
        if (mainteance.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.MAINTEANCE_NOT_ACTIVE], req.language))
        }

        await db.mainteanceModel.update({
            ...req.body,
            Iscompleted: true,
            Endtime: new Date(),
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        const equipment = await db.equipmentModel.findOne({ where: { Uuid: mainteance.EquipmentID } })

        await CreateNotification({
            type: types.Delete,
            service: messages.NOTIFICATION.PAGE_NAME,
            role: 'mainteancenotification',
            message: {
                tr: `${formatDate(mainteance.Starttime)} Başlangıç Tarihli, ${equipment?.Name} Eqipmanı İçin Açılan Bakım Talebi ${username} Tarafından Tamamlandı.`,
                en: `${formatDate(mainteance.Starttime)} Start Date, ${equipment.Name} Equipment Name, Mainteancy Request Completed By ${username} `
            },
            pushurl: '/Mainteancies'
        })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetMainteancies(req, res, next)
}

async function DeleteMainteance(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.mainteanceId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.MAINTEANCEID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_MAINTEANCEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const mainteance = await db.mainteanceModel.findOne({ where: { Uuid: Uuid } })
        if (!mainteance) {
            return next(createNotfounderror([messages.ERROR.MAINTEANCE_NOT_FOUND], req.language))
        }
        if (mainteance.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.MAINTEANCE_NOT_ACTIVE], req.language))
        }

        await db.mainteanceModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        const equipment = await db.equipmentModel.findOne({ where: { Uuid: mainteance.EquipmentID } })

        await CreateNotification({
            type: types.Delete,
            service: messages.NOTIFICATION.PAGE_NAME,
            role: 'mainteancenotification',
            message: {
                tr: `${formatDate(mainteance.Starttime)} Başlangıç Tarihli, ${equipment?.Name} Eqipmanı İçin Açılan Bakım Talebi ${username} Tarafından Silindi.`,
                en: `${formatDate(mainteance.Starttime)} Start Date, ${equipment.Name} Equipment Name, Mainteancy Request Deleted By ${username} `
            },
            pushurl: '/Mainteancies'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetMainteancies(req, res, next)
}

module.exports = {
    GetMainteancies,
    GetMainteance,
    AddMainteance,
    UpdateMainteance,
    DeleteMainteance,
    CompleteMainteance
}


const messages = {
    NOTIFICATION: {
        PAGE_NAME: {
            en: 'Mainteancies',
            tr: 'Bakım Talepleri',
        },
    },
    ERROR: {
        MAINTEANCE_NOT_FOUND: {
            code: 'MAINTEANCE_NOT_FOUND', description: {
                en: 'maintance not found',
                tr: 'Bakım talebi bulunamadı',
            }
        },
        MAINTEANCE_NOT_ACTIVE: {
            code: 'MAINTEANCE_NOT_ACTIVE', description: {
                en: 'maintance not active',
                tr: 'Bakım talebi aktif değil',
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
        MAINTEANCEID_REQUIRED: {
            code: 'MAINTEANCEID_REQUIRED', description: {
                en: 'The mainteanceid required',
                tr: 'Bu işlem için mainteanceid gerekli',
            }
        },
        UNSUPPORTED_MAINTEANCEID: {
            code: 'UNSUPPORTED_MAINTEANCEID', description: {
                en: 'The mainteanceid is unsupported',
                tr: 'geçersiz mainteanceid',
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
    }
}
