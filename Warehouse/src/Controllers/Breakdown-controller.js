const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetBreakdowns(req, res, next) {
    try {
        let data = null
        const breakdowns = await db.breakdownModel.findAll()
        if (req?.Uuid) {
            data = await db.breakdownModel.findOne({ where: { Uuid: req?.Uuid } });
        }
        res.status(200).json({ list: breakdowns, data: data })
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetOpenedBreakdownCount(req, res, next) {
    try {
        const openedBreakdownCount = await db.breakdownModel.count({ where: { Isactive: true, Iscompleted: false } })
        res.status(200).json(openedBreakdownCount)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetBreakdown(req, res, next) {

    let validationErrors = []
    if (!req.params.breakdownId) {
        validationErrors.push(req.t('Breakdowns.Error.BreakdownIDRequired'))
    }
    if (!validator.isUUID(req.params.breakdownId)) {
        validationErrors.push(req.t('Breakdowns.Error.UnsupportedBreakdownID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Breakdowns'), req.language))
    }

    try {
        const breakdown = await db.breakdownModel.findOne({ where: { Uuid: req.params.breakdownId } });
        if (!breakdown) {
            return next(createNotFoundError(req.t('Breakdowns.Error.NotFound'), req.t('Breakdowns'), req.language))
        }
        if (!breakdown.Isactive) {
            return next(createNotFoundError(req.t('Breakdowns.Error.NotActive'), req.t('Breakdowns'), req.language))
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
        validationErrors.push(req.t('Breakdowns.Error.EquipmentIDRequired'))
    }
    if (!validator.isUUID(ResponsibleuserID)) {
        validationErrors.push(req.t('Breakdowns.Error.ResponsibleuserIDRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Breakdowns'), req.language))
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
            service: req.t('Breakdowns'),
            role: 'breakdownnotification',
            message: {
                tr: `${equipment?.Name} Eqipmanı için Arıza Talebi ${username} tarafından Oluşturuldu.`,
                en: `${equipment?.Name} Equipment Breakdown Request Created by ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Breakdowns.Error.EquipmentIDRequired'))
    }
    if (!validator.isUUID(ResponsibleuserID)) {
        validationErrors.push(req.t('Breakdowns.Error.ResponsibleuserIDRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Breakdowns.Error.BreakdownIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Breakdowns.Error.UnsupportedBreakdownID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Breakdowns'), req.language))
    }
    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const breakdown = await db.breakdownModel.findOne({ where: { Uuid: Uuid } })
        if (!breakdown) {
            return next(createNotFoundError(req.t('Breakdowns.Error.NotFound'), req.t('Breakdowns'), req.language))
        }
        if (!breakdown.Isactive) {
            return next(createNotFoundError(req.t('Breakdowns.Error.NotActive'), req.t('Breakdowns'), req.language))
        }

        await db.breakdownModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        const equipment = await db.equipmentModel.findOne({ where: { Uuid: breakdown.EquipmentID } })

        await CreateNotification({
            type: types.Update,
            service: req.t('Breakdowns'),
            role: 'breakdownnotification',
            message: {
                tr: `${equipment?.Name} Eqipmanı için Arıza Talebi ${username} tarafından Güncellendi.`,
                en: `${equipment?.Name} Equipment Breakdown Request Updated by ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Breakdowns.Error.BreakdownIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Breakdowns.Error.UnsupportedBreakdownID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Breakdowns'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const breakdown = await db.breakdownModel.findOne({ where: { Uuid: Uuid } })
        if (!breakdown) {
            return next(createNotFoundError(req.t('Breakdowns.Error.NotFound'), req.t('Breakdowns'), req.language))
        }
        if (!breakdown.Isactive) {
            return next(createNotFoundError(req.t('Breakdowns.Error.NotActive'), req.t('Breakdowns'), req.language))
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
            service: req.t('Breakdowns'),
            role: 'breakdownnotification',
            message: {
                tr: `${equipment?.Name} Eqipmanı için Arıza Talebi ${username} tarafından Tamamlandı.`,
                en: `${equipment?.Name} Equipment Breakdown Request Completed by ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Breakdowns.Error.BreakdownIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Breakdowns.Error.UnsupportedBreakdownID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Breakdowns'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const breakdown = await db.breakdownModel.findOne({ where: { Uuid: Uuid } })
        if (!breakdown) {
            return next(createNotFoundError(req.t('Breakdowns.Error.NotFound'), req.t('Breakdowns'), req.language))
        }
        if (!breakdown.Isactive) {
            return next(createNotFoundError(req.t('Breakdowns.Error.NotActive'), req.t('Breakdowns'), req.language))
        }

        await db.breakdownModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        const equipment = await db.equipmentModel.findOne({ where: { Uuid: breakdown.EquipmentID } })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Breakdowns'),
            role: 'breakdownnotification',
            message: {
                tr: `${equipment?.Name} Eqipmanı için Arıza Talebi ${username} tarafından Silindi.`,
                en: `${equipment?.Name} Equipment Breakdown Request Deleted by ${username}`
            }[req.language],
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
    CompleteBreakdown,
    GetOpenedBreakdownCount
}
