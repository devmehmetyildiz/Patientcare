const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

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
        validationErrors.push(req.t('Mainteancies.Error.MainteancyIDRequired'))
    }
    if (!validator.isUUID(req.params.mainteanceId)) {
        validationErrors.push(req.t('Mainteancies.Error.UnsupportedMainteancyID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Mainteancies'), req.language))
    }

    try {
        const mainteance = await db.mainteanceModel.findOne({ where: { Uuid: req.params.mainteanceId } });
        if (!mainteance) {
            return next(createNotFoundError(req.t('Mainteancies.Error.NotFound'), req.t('Mainteancies'), req.language))
        }
        if (!mainteance.Isactive) {
            return next(createNotFoundError(req.t('Mainteancies.Error.NotActive'), req.t('Mainteancies'), req.language))
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
        validationErrors.push(req.t('Mainteancies.Error.EquipmentIDRequired'))
    }
    if (!validator.isUUID(ResponsibleuserID)) {
        validationErrors.push(req.t('Mainteancies.Error.ResponsibleuserIDRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Mainteancies'), req.language))
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
            service: req.t('Mainteancies'),
            role: 'mainteancenotification',
            message: {
                tr: `${equipment?.Name} Eqipmanı için Bakım Talebi ${username} tarafından Oluşturuldu.`,
                en: `${equipment?.Name} Equipment Mainteancy Request Created by ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Mainteancies.Error.EquipmentIDRequired'))
    }
    if (!validator.isUUID(ResponsibleuserID)) {
        validationErrors.push(req.t('Mainteancies.Error.ResponsibleuserIDRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Mainteancies.Error.MainteancyIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Mainteancies.Error.UnsupportedMainteancyID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Mainteancies'), req.language))
    }
    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const mainteance = await db.mainteanceModel.findOne({ where: { Uuid: Uuid } })
        if (!mainteance) {
            return next(createNotFoundError(req.t('Mainteancies.Error.NotFound'), req.t('Mainteancies'), req.language))
        }
        if (!mainteance.Isactive) {
            return next(createNotFoundError(req.t('Mainteancies.Error.NotActive'), req.t('Mainteancies'), req.language))
        }

        await db.mainteanceModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        const equipment = await db.equipmentModel.findOne({ where: { Uuid: mainteance.EquipmentID } })

        await CreateNotification({
            type: types.Update,
            service: req.t('Mainteancies'),
            role: 'mainteancenotification',
            message: {
                tr: `${equipment?.Name} Eqipmanı için Bakım Talebi ${username} tarafından Güncellendi.`,
                en: `${equipment?.Name} Equipment Mainteancy Request Updated by ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Mainteancies.Error.MainteancyIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Mainteancies.Error.UnsupportedMainteancyID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Mainteancies'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const mainteance = await db.mainteanceModel.findOne({ where: { Uuid: Uuid } })
        if (!mainteance) {
            return next(createNotFoundError(req.t('Mainteancies.Error.NotFound'), req.t('Mainteancies'), req.language))
        }
        if (!mainteance.Isactive) {
            return next(createNotFoundError(req.t('Mainteancies.Error.NotActive'), req.t('Mainteancies'), req.language))
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
            type: types.Update,
            service: req.t('Mainteancies'),
            role: 'mainteancenotification',
            message: {
                tr: `${equipment?.Name} Eqipmanı için Bakım Talebi ${username} tarafından Güncellendi.`,
                en: `${equipment?.Name} Equipment Mainteancy Request Updated by ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Mainteancies.Error.MainteancyIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Mainteancies.Error.UnsupportedMainteancyID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Mainteancies'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const mainteance = await db.mainteanceModel.findOne({ where: { Uuid: Uuid } })
        if (!mainteance) {
            return next(createNotFoundError(req.t('Mainteancies.Error.NotFound'), req.t('Mainteancies'), req.language))
        }
        if (!mainteance.Isactive) {
            return next(createNotFoundError(req.t('Mainteancies.Error.NotActive'), req.t('Mainteancies'), req.language))
        }

        await db.mainteanceModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        const equipment = await db.equipmentModel.findOne({ where: { Uuid: mainteance.EquipmentID } })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Mainteancies'),
            role: 'mainteancenotification',
            message: {
                tr: `${equipment?.Name} Eqipmanı için Bakım Talebi ${username} tarafından Silindi.`,
                en: `${equipment?.Name} Equipment Mainteancy Request Deleted by ${username}`
            }[req.language],
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