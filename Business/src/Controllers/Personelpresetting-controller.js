const config = require("../Config")
const { types } = require("../Constants/Defines")
const messages = require("../Constants/PersonelpresettingMessages")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')

async function GetPersonelpresettings(req, res, next) {
    try {
        const personelpresettings = await db.personelpresettingModel.findAll()
        res.status(200).json(personelpresettings)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPersonelpresetting(req, res, next) {

    let validationErrors = []
    if (!req.params.personelpresettingId) {
        validationErrors.push(messages.VALIDATION_ERROR.PERSONELPRESETTINGID_REQUIRED)
    }
    if (!validator.isUUID(req.params.personelpresettingId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PERSONELPRESETTINGID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const personelpresetting = await db.personelpresettingModel.findOne({ where: { Uuid: req.params.personelpresettingId } });
        res.status(200).json(personelpresetting)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddPersonelpresetting(req, res, next) {

    let validationErrors = []
    const {
        PersonelID,
        Startdate,
        Isinfinite,
        Isapproved,
        Iscompleted,
        Isdeactive,
    } = req.body


    if (!validator.isUUID(PersonelID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PERSONELID_REQUIRED)
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
    if (Isinfinite === false && !validator.isISODate(Startdate)) {
        validationErrors.push(messages.VALIDATION_ERROR.STARTDATE_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let personelpresettinguuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.personelpresettingModel.create({
            ...req.body,
            Isapproved: false,
            Iscompleted: false,
            Isdeactive: false,
            Uuid: personelpresettinguuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: 'Personel Ön Ayarları',
            role: 'personelpresettingnotification',
            message: `${personelpresettinguuid} numaralı personel ön ayarı ${username} tarafından Eklendi.`,
            pushurl: '/Personelpresettings'
        })
        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }

    GetPersonelpresettings(req, res, next)
}

async function UpdatePersonelpresetting(req, res, next) {

    let validationErrors = []
    const {
        PersonelID,
        Startdate,
        Isinfinite,
        Isapproved,
        Iscompleted,
        Isdeactive,
        Uuid,
    } = req.body

    if (!validator.isUUID(PersonelID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PERSONELID_REQUIRED)
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
        const personelpresetting = db.personelpresettingModel.findOne({ where: { Uuid: Uuid } })
        if (!personelpresetting) {
            return next(createNotfounderror([messages.ERROR.PERSONELPRESETTING_NOT_FOUND], req.language))
        }
        if (personelpresetting.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PERSONELPRESETTING_NOT_ACTIVE], req.language))
        }

        await db.personelpresettingModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })


        await CreateNotification({
            type: types.Update,
            service: 'Personel Ön Ayarları',
            role: 'personelpresettingnotification',
            message: `${Uuid} numaralı personel ön ayarı ${username} tarafından güncellendi.`,
            pushurl: '/Personelpresettings'
        })
        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPersonelpresettings(req, res, next)
}

async function DeletePersonelpresetting(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.personelpresettingId

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
        const personelpresetting = db.personelpresettingModel.findOne({ where: { Uuid: Uuid } })
        if (!personelpresetting) {
            return next(createNotfounderror([messages.ERROR.PERSONELPRESETTING_NOT_FOUND], req.language))
        }
        if (personelpresetting.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PERSONELPRESETTING_NOT_ACTIVE], req.language))
        }

        await db.personelpresettingModel.destroy({ where: { Uuid: Uuid }, transaction: t });

        await CreateNotification({
            type: types.Delete,
            service: 'Personel Ön Ayarları',
            role: 'personelpresettingnotification',
            message: `${Uuid} numaralı Personel ön ayarı ${username} tarafından Silindi.`,
            pushurl: '/Personelpresettings'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetPersonelpresettings(req, res, next)
}

module.exports = {
    GetPersonelpresettings,
    GetPersonelpresetting,
    AddPersonelpresetting,
    UpdatePersonelpresetting,
    DeletePersonelpresetting,
}