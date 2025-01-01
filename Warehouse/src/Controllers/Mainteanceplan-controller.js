const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetMainteanceplans(req, res, next) {
    try {
        const mainteanceplans = await db.mainteanceplanModel.findAll()
        res.status(200).json(mainteanceplans)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetMainteanceplan(req, res, next) {

    let validationErrors = []
    if (!req.params.mainteanceplanId) {
        validationErrors.push(req.t('Mainteanceplans.Error.MainteanceplanIDRequired'))
    }
    if (!validator.isUUID(req.params.mainteanceplanId)) {
        validationErrors.push(req.t('Mainteanceplans.Error.UnsupportedMainteanceplanID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Mainteanceplans'), req.language))
    }

    try {
        const mainteanceplan = await db.mainteanceplanModel.findOne({ where: { Uuid: req.params.mainteanceplanId } });
        if (!mainteanceplan) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.NotFound'), req.t('Mainteanceplans'), req.language))
        }
        if (!mainteanceplan.Isactive) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.NotActive'), req.t('Mainteanceplans'), req.language))
        }
        res.status(200).json(mainteanceplan)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddMainteanceplan(req, res, next) {

    let validationErrors = []
    const {
        EquipmentID,
        Startdate,
        Dayperiod,
        UserID
    } = req.body

    if (!validator.isUUID(UserID)) {
        validationErrors.push(req.t('Mainteanceplans.Error.UserIDRequired'))
    }
    if (!validator.isUUID(EquipmentID)) {
        validationErrors.push(req.t('Mainteanceplans.Error.EquipmentIDRequired'))
    }
    if (!validator.isISODate(Startdate)) {
        validationErrors.push(req.t('Mainteanceplans.Error.StartdateRequired'))
    }
    if (!validator.isNumber(Dayperiod)) {
        validationErrors.push(req.t('Mainteanceplans.Error.DayperiodRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Mainteanceplans'), req.language))
    }

    let mainteanceplanuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const startDate = new Date()

        await db.mainteanceplanModel.create({
            ...req.body,
            Uuid: mainteanceplanuuid,
            Isonpreview: true,
            Isapproved: false,
            Iscompleted: false,
            Isworking: false,
            Createduser: username,
            Createtime: startDate,
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: req.t('Mainteanceplans'),
            role: 'mainteanceplannotification',
            message: {
                tr: `${mainteanceplanuuid} Numaralı Bakım Talep Periyodu ${username} tarafından Oluşturuldu.`,
                en: `${mainteanceplanuuid} Numbered Mainteanceplan Period Created by ${username}`
            }[req.language],
            pushurl: '/Mainteanceplans'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        next(sequelizeErrorCatcher(err))
    }
    req.Uuid = mainteanceplanuuid
    GetMainteanceplans(req, res, next)
}

async function UpdateMainteanceplan(req, res, next) {

    let validationErrors = []
    const {
        Uuid,
        EquipmentID,
        Startdate,
        Dayperiod,
        UserID
    } = req.body

    if (!validator.isUUID(UserID)) {
        validationErrors.push(req.t('Mainteanceplans.Error.UserIDRequired'))
    }
    if (!validator.isUUID(EquipmentID)) {
        validationErrors.push(req.t('Mainteanceplans.Error.EquipmentIDRequired'))
    }
    if (!validator.isISODate(Startdate)) {
        validationErrors.push(req.t('Mainteanceplans.Error.StartdateRequired'))
    }
    if (!validator.isNumber(Dayperiod)) {
        validationErrors.push(req.t('Mainteanceplans.Error.DayperiodRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Mainteanceplans.Error.MainteanceplanIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Mainteanceplans.Error.UnsupportedMainteanceplanID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Mainteanceplans'), req.language))
    }
    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const mainteanceplan = await db.mainteanceplanModel.findOne({ where: { Uuid: Uuid } })
        if (mainteanceplan.Isactive === false) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.NotActive'), req.t('Mainteanceplans'), req.language))
        }
        if (mainteanceplan.Isonpreview === false) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.NotOnPreview'), req.t('Mainteanceplans'), req.language))
        }
        if (mainteanceplan.Isapproved === true) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.Approved'), req.t('Mainteanceplans'), req.language))
        }
        if (mainteanceplan.Iscompleted === true) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.Completed'), req.t('Mainteanceplans'), req.language))
        }

        await db.mainteanceplanModel.update({
            ...req.body,
            Isonpreview: true,
            Isapproved: false,
            Iscompleted: false,
            Isworking: false,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Mainteanceplans'),
            role: 'mainteanceplannotification',
            message: {
                tr: `${Uuid} Numaralı Bakım Talep Periyodu ${username} tarafından Güncellendi.`,
                en: `${Uuid} Numbered Mainteanceplan Period Updated by ${username}`
            }[req.language],
            pushurl: '/Mainteanceplans'
        })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    req.Uuid = Uuid
    GetMainteanceplans(req, res, next)
}

async function SavepreviewMainteanceplan(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.mainteanceplanId

    if (!Uuid) {
        validationErrors.push(req.t('Mainteanceplans.Error.MainteanceplanIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Mainteanceplans.Error.UnsupportedMainteanceplanID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Mainteanceplans'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const mainteanceplan = await db.mainteanceplanModel.findOne({ where: { Uuid: Uuid } })
        if (!mainteanceplan) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.NotFound'), req.t('Mainteanceplans'), req.language))
        }
        if (mainteanceplan.Isactive === false) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.NotActive'), req.t('Mainteanceplans'), req.language))
        }
        if (mainteanceplan.Isonpreview === false) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.NotOnPreview'), req.t('Mainteanceplans'), req.language))
        }
        if (mainteanceplan.Isapproved === true) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.Approved'), req.t('Mainteanceplans'), req.language))
        }
        if (mainteanceplan.Iscompleted === true) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.Completed'), req.t('Mainteanceplans'), req.language))
        }

        await db.mainteanceplanModel.update({
            Isonpreview: false,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: Uuid }, transaction: t })


        await CreateNotification({
            type: types.Update,
            service: req.t('Mainteanceplans'),
            role: 'mainteanceplannotification',
            message: {
                tr: `${Uuid} Numaralı Bakım Talep Periyodu ${username} tarafından Kayıt Edildi.`,
                en: `${Uuid} Numbered Mainteanceplan Period Saved by ${username}`
            }[req.language],
            pushurl: '/Mainteanceplans'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetMainteanceplans(req, res, next)
}

async function ApproveMainteanceplan(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.mainteanceplanId

    if (!Uuid) {
        validationErrors.push(req.t('Mainteanceplans.Error.MainteanceplanIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Mainteanceplans.Error.UnsupportedMainteanceplanID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Mainteanceplans'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const mainteanceplan = await db.mainteanceplanModel.findOne({ where: { Uuid: Uuid } })
        if (!mainteanceplan) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.NotFound'), req.t('Mainteanceplans'), req.language))
        }
        if (mainteanceplan.Isactive === false) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.NotActive'), req.t('Mainteanceplans'), req.language))
        }
        if (mainteanceplan.Isonpreview === true) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.OnPreview'), req.t('Mainteanceplans'), req.language))
        }
        if (mainteanceplan.Isapproved === true) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.Approved'), req.t('Mainteanceplans'), req.language))
        }
        if (mainteanceplan.Iscompleted === true) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.Completed'), req.t('Mainteanceplans'), req.language))
        }

        await db.mainteanceplanModel.update({
            Isapproved: true,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Mainteanceplans'),
            role: 'mainteanceplannotification',
            message: {
                tr: `${Uuid} Numaralı Bakım Talep Periyodu ${username} tarafından Onaylandı.`,
                en: `${Uuid} Numbered Mainteanceplan Period Approved by ${username}`
            }[req.language],
            pushurl: '/Mainteanceplans'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetMainteanceplans(req, res, next)
}

async function CompleteMainteanceplan(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.mainteanceplanId

    if (!Uuid) {
        validationErrors.push(req.t('Mainteanceplans.Error.MainteanceplanIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Mainteanceplans.Error.UnsupportedMainteanceplanID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Mainteanceplans'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const mainteanceplan = await db.mainteanceplanModel.findOne({ where: { Uuid: Uuid } })
        if (!mainteanceplan) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.NotFound'), req.t('Mainteanceplans'), req.language))
        }
        if (mainteanceplan.Isactive === false) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.NotActive'), req.t('Mainteanceplans'), req.language))
        }
        if (mainteanceplan.Isonpreview === true) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.OnPreview'), req.t('Mainteanceplans'), req.language))
        }
        if (mainteanceplan.Isapproved === false) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.NotApproved'), req.t('Mainteanceplans'), req.language))
        }
        if (mainteanceplan.Iscompleted === true) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.Completed'), req.t('Mainteanceplans'), req.language))
        }

        await db.mainteanceplanModel.update({
            Iscompleted: true,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Mainteanceplans'),
            role: 'mainteanceplannotification',
            message: {
                tr: `${Uuid} Numaralı Bakım Talep Periyodu ${username} tarafından Tamamlandı.`,
                en: `${Uuid} Numbered Mainteanceplan Period Completed by ${username}`
            }[req.language],
            pushurl: '/Mainteanceplans'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetMainteanceplans(req, res, next)
}

async function WorkMainteanceplan(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.mainteanceplanId

    if (!Uuid) {
        validationErrors.push(req.t('Mainteanceplans.Error.MainteanceplanIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Mainteanceplans.Error.UnsupportedMainteanceplanID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Mainteanceplans'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const mainteanceplan = await db.mainteanceplanModel.findOne({ where: { Uuid: Uuid } })
        if (!mainteanceplan) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.NotFound'), req.t('Mainteanceplans'), req.language))
        }
        if (mainteanceplan.Isactive === false) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.NotActive'), req.t('Mainteanceplans'), req.language))
        }
        if (mainteanceplan.Isonpreview === true) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.OnPreview'), req.t('Mainteanceplans'), req.language))
        }
        if (mainteanceplan.Isapproved === false) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.NotApproved'), req.t('Mainteanceplans'), req.language))
        }
        if (mainteanceplan.Iscompleted === false) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.NotCompleted'), req.t('Mainteanceplans'), req.language))
        }
        if (mainteanceplan.Isworking === true) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.Working'), req.t('Mainteanceplans'), req.language))
        }

        await db.mainteanceplanModel.update({
            Isworking: true,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Mainteanceplans'),
            role: 'mainteanceplannotification',
            message: {
                tr: `${Uuid} Numaralı Bakım Talep Periyodu ${username} tarafından Çalışır Hale Getirildi.`,
                en: `${Uuid} Numbered Mainteanceplan Period Set Work by ${username}`
            }[req.language],
            pushurl: '/Mainteanceplans'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetMainteanceplans(req, res, next)
}

async function StopMainteanceplan(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.mainteanceplanId

    if (!Uuid) {
        validationErrors.push(req.t('Mainteanceplans.Error.MainteanceplanIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Mainteanceplans.Error.UnsupportedMainteanceplanID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Mainteanceplans'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const mainteanceplan = await db.mainteanceplanModel.findOne({ where: { Uuid: Uuid } })
        if (!mainteanceplan) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.NotFound'), req.t('Mainteanceplans'), req.language))
        }
        if (mainteanceplan.Isactive === false) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.NotActive'), req.t('Mainteanceplans'), req.language))
        }
        if (mainteanceplan.Isonpreview === true) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.OnPreview'), req.t('Mainteanceplans'), req.language))
        }
        if (mainteanceplan.Isapproved === false) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.NotApproved'), req.t('Mainteanceplans'), req.language))
        }
        if (mainteanceplan.Iscompleted === false) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.NotCompleted'), req.t('Mainteanceplans'), req.language))
        }
        if (mainteanceplan.Isworking === false) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.Notworking'), req.t('Mainteanceplans'), req.language))
        }

        await db.mainteanceplanModel.update({
            Isworking: false,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Mainteanceplans'),
            role: 'mainteanceplannotification',
            message: {
                tr: `${Uuid} Numaralı Bakım Talep Periyodu ${username} tarafından Durduruldu.`,
                en: `${Uuid} Numbered Mainteanceplan Period Stopped by ${username}`
            }[req.language],
            pushurl: '/Mainteanceplans'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetMainteanceplans(req, res, next)
}

async function DeleteMainteanceplan(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.mainteanceplanId

    if (!Uuid) {
        validationErrors.push(req.t('Mainteanceplans.Error.MainteanceplanIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Mainteanceplans.Error.UnsupportedMainteanceplanID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Mainteanceplans'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const mainteanceplan = await db.mainteanceplanModel.findOne({ where: { Uuid: Uuid } })
        if (!mainteanceplan) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.NotFound'), req.t('Mainteanceplans'), req.language))
        }
        if (!mainteanceplan.Isactive) {
            return next(createNotFoundError(req.t('Mainteanceplans.Error.NotActive'), req.t('Mainteanceplans'), req.language))
        }

        await db.mainteanceplanModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Mainteanceplans'),
            role: 'mainteanceplannotification',
            message: {
                tr: `${Uuid} Numaralı Bakım Talep Periyodu ${username} tarafından Silindi.`,
                en: `${Uuid} Numbered Mainteanceplan Period Deleted by ${username}`
            }[req.language],
            pushurl: '/Mainteanceplans'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetMainteanceplans(req, res, next)
}

module.exports = {
    GetMainteanceplans,
    GetMainteanceplan,
    AddMainteanceplan,
    UpdateMainteanceplan,
    DeleteMainteanceplan,
    SavepreviewMainteanceplan,
    ApproveMainteanceplan,
    CompleteMainteanceplan,
    WorkMainteanceplan,
    StopMainteanceplan
}
