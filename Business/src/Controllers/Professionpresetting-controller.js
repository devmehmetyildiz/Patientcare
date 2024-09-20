const config = require("../Config")
const { types } = require("../Constants/Defines")
const messages = require("../Constants/ProfessionpresettingMessages")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')

async function GetProfessionpresettings(req, res, next) {
    try {
        const professionpresettings = await db.professionpresettingModel.findAll()
        res.status(200).json(professionpresettings)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetProfessionpresetting(req, res, next) {

    let validationErrors = []
    if (!req.params.professionpresettingId) {
        validationErrors.push(messages.VALIDATION_ERROR.PROFESSIONPRESETTINGID_REQUIRED)
    }
    if (!validator.isUUID(req.params.professionpresettingId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PROFESSIONPRESETTINGID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const professionpresetting = await db.professionpresettingModel.findOne({ where: { Uuid: req.params.professionpresettingId } });
        res.status(200).json(professionpresetting)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddProfessionpresetting(req, res, next) {

    let validationErrors = []
    const {
        Startdate,
        Isinfinite,
        Isapproved,
        Iscompleted,
        Isdeactive,
        Ispersonelstay,
        ProfessionID
    } = req.body


    if (!validator.isUUID(ProfessionID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PROFESSIONID_REQUIRED)
    }
    if (!validator.isBoolean(Isinfinite)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISINFITINE_REQUIRED)
    }
    if (!validator.isBoolean(Isapproved)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISAPPROVED_REQUIRED)
    }
    if (!validator.isBoolean(Iscompleted)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISCOMPLETED_REQUIRED)
    }
    if (!validator.isBoolean(Isdeactive)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISDEACTIVE_REQUIRED)
    }
    if (!validator.isBoolean(Ispersonelstay)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISPERSONELSTAY_REQUIRED)
    }
    if (Isinfinite === false && !validator.isISODate(Startdate)) {
        validationErrors.push(messages.VALIDATION_ERROR.STARTDATE_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let professionpresettinguuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.professionpresettingModel.create({
            ...req.body,
            Uuid: professionpresettinguuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: 'Meslek Ön Ayarları',
            role: 'professionpresettingnotification',
            message: `${professionpresettinguuid} numaralı meslek ön ayarı ${username} tarafından Eklendi.`,
            pushurl: '/Professionpresettings'
        })
        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }

    GetProfessionpresettings(req, res, next)
}

async function UpdateProfessionpresetting(req, res, next) {

    let validationErrors = []
    const {
        Startdate,
        Isinfinite,
        Isapproved,
        Iscompleted,
        Isdeactive,
        Ispersonelstay,
        Uuid,
        ProfessionID
    } = req.body

    if (!validator.isUUID(ProfessionID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PROFESSIONID_REQUIRED)
    }
    if (!validator.isBoolean(Isinfinite)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISINFITINE_REQUIRED)
    }
    if (!validator.isBoolean(Isapproved)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISAPPROVED_REQUIRED)
    }
    if (!validator.isBoolean(Iscompleted)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISCOMPLETED_REQUIRED)
    }
    if (!validator.isBoolean(Isdeactive)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISDEACTIVE_REQUIRED)
    }
    if (!validator.isBoolean(Ispersonelstay)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISPERSONELSTAY_REQUIRED)
    }
    if (Isinfinite === false && !validator.isISODate(Startdate)) {
        validationErrors.push(messages.VALIDATION_ERROR.STARTDATE_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.SHIFTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_SHIFTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const professionpresetting = db.professionpresettingModel.findOne({ where: { Uuid: Uuid } })
        if (!professionpresetting) {
            return next(createNotfounderror([messages.ERROR.PROFESSIONPRESETTING_NOT_FOUND], req.language))
        }
        if (professionpresetting.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PROFESSIONPRESETTING_NOT_ACTIVE], req.language))
        }

        await db.professionpresettingModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })


        await CreateNotification({
            type: types.Update,
            service: 'Meslek Ön Ayarları',
            role: 'professionpresettingnotification',
            message: `${Uuid} numaralı meslek ön ayarı ${username} tarafından güncellendi.`,
            pushurl: '/Professionpresettings'
        })
        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetProfessionpresettings(req, res, next)
}

async function DeleteProfessionpresetting(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.professionpresettingId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.SHIFTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_SHIFTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const professionpresetting = db.professionpresettingModel.findOne({ where: { Uuid: Uuid } })
        if (!professionpresetting) {
            return next(createNotfounderror([messages.ERROR.PROFESSIONPRESETTING_NOT_FOUND], req.language))
        }
        if (professionpresetting.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PROFESSIONPRESETTING_NOT_ACTIVE], req.language))
        }

        await db.professionpresettingModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: 'Meslek Ön Ayarları',
            role: 'professionpresettingnotification',
            message: `${Uuid} numaralı meslek ön ayarı ${username} tarafından Silindi.`,
            pushurl: '/Professionpresettings'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetProfessionpresettings(req, res, next)
}

module.exports = {
    GetProfessionpresettings,
    GetProfessionpresetting,
    AddProfessionpresetting,
    UpdateProfessionpresetting,
    DeleteProfessionpresetting,
}