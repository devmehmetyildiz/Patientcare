const config = require("../Config")
const { types } = require("../Constants/Defines")
const messages = require("../Constants/Messages")
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

        await CreateNotification({
            type: types.Create,
            service: 'Bakım Talepleri',
            role: 'mainteancenotification',
            message: `${formatDate(startDate)} tarihli bakım talebi ${username} tarafından Oluşturuldu.`,
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
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Bakım Talepleri',
            role: 'mainteancenotification',
            message: `${formatDate(mainteance?.Starttime)} tarihli bakım talebi ${username} tarafından Güncellendi.`,
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
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: 'Bakım Talepleri',
            role: 'mainteancenotification',
            message: `${formatDate(mainteance?.Starttime)} tarihli bakım talebi ${username} tarafından Tamamlandı.`,
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
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: 'Bakım Talepleri',
            role: 'mainteancenotification',
            message: `${formatDate(mainteance?.Starttime)} tarihli bakım talebi ${username} tarafından Silindi.`,
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