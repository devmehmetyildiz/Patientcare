const config = require("../Config")
const { types } = require("../Constants/Defines")
const messages = require("../Constants/PersonelshiftdetailMessages")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')

async function GetPersonelshiftdetails(req, res, next) {
    try {
        const personelshiftdetails = await db.personelshiftdetailModel.findAll()
        res.status(200).json(personelshiftdetails)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPersonelshiftdetail(req, res, next) {

    let validationErrors = []
    if (!req.params.personelshiftdetailId) {
        validationErrors.push(messages.VALIDATION_ERROR.PERSONELSHIIFTDETAILID_REQUIRED)
    }
    if (!validator.isUUID(req.params.personelshiftdetailId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PERSONELSHIIFTDETAILID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const personelshiftdetail = await db.personelshiftdetailModel.findOne({ where: { Uuid: req.params.personelshiftdetailId } });
        res.status(200).json(personelshiftdetail)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddPersonelshiftdetail(req, res, next) {

    let validationErrors = []
    const {
        PersonelshiftID,
        ShiftID,
        PersonelID,
        FloorID,
        Day,
        Isworking,
        Isonannual,
        Annualtype,
    } = req.body


    if (validator.isUUID(PersonelshiftID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PERSONELSHIFTID_REQUIRED)
    }
    if (validator.isUUID(ShiftID)) {
        validationErrors.push(messages.VALIDATION_ERROR.SHIFTID_REQUIRED)
    }
    if (validator.isUUID(PersonelID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PERSONELID_REQUIRED)
    }
    if (validator.isUUID(FloorID)) {
        validationErrors.push(messages.VALIDATION_ERROR.FLOORID_REQUIRED)
    }
    if (validator.isNumber(Day)) {
        validationErrors.push(messages.VALIDATION_ERROR.DAY_REQUIRED)
    }
    if (validator.isBoolean(Isworking)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISWORKING_REQUIRED)
    }
    if (validator.isBoolean(Isonannual)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISONANNUAL_REQUIRED)
    }
    if (validator.isNumber(Annualtype)) {
        validationErrors.push(messages.VALIDATION_ERROR.ANNUALTYPE_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let personelshiftdetailuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.personelshiftdetailModel.create({
            ...req.body,
            Uuid: personelshiftdetailuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: 'Personel Vardiya Detayları',
            role: 'personelshiftdetailnotification',
            message: `${personelshiftdetailuuid} numaralı personel vardiya detayı ${username} tarafından Eklendi.`,
            pushurl: '/Personelshiftdetails'
        })
        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }

    GetPersonelshiftdetails(req, res, next)
}

async function UpdatePersonelshiftdetail(req, res, next) {

    let validationErrors = []
    const {
        PersonelshiftID,
        ShiftID,
        PersonelID,
        FloorID,
        Day,
        Isworking,
        Isonannual,
        Annualtype,
        Uuid,
    } = req.body

    if (validator.isUUID(PersonelshiftID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PERSONELSHIFTID_REQUIRED)
    }
    if (validator.isUUID(ShiftID)) {
        validationErrors.push(messages.VALIDATION_ERROR.SHIFTID_REQUIRED)
    }
    if (validator.isUUID(PersonelID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PERSONELID_REQUIRED)
    }
    if (validator.isUUID(FloorID)) {
        validationErrors.push(messages.VALIDATION_ERROR.FLOORID_REQUIRED)
    }
    if (validator.isNumber(Day)) {
        validationErrors.push(messages.VALIDATION_ERROR.DAY_REQUIRED)
    }
    if (validator.isBoolean(Isworking)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISWORKING_REQUIRED)
    }
    if (validator.isBoolean(Isonannual)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISONANNUAL_REQUIRED)
    }
    if (validator.isNumber(Annualtype)) {
        validationErrors.push(messages.VALIDATION_ERROR.ANNUALTYPE_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PERSONELSHIIFTDETAILID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PERSONELSHIIFTDETAILID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const personelshiftdetail = db.personelshiftdetailModel.findOne({ where: { Uuid: Uuid } })
        if (!personelshiftdetail) {
            return next(createNotfounderror([messages.ERROR.PERSONELSHIIFTDETAIL_NOT_FOUND], req.language))
        }
        if (personelshiftdetail.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PERSONELSHIIFTDETAIL_NOT_ACTIVE], req.language))
        }

        await db.personelshiftdetailModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })


        await CreateNotification({
            type: types.Update,
            service: 'Personel Vardiya Detayları',
            role: 'personelshiftdetailnotification',
            message: `${Uuid} numaralı personel vardiya detayı ${username} tarafından Güncellendi.`,
            pushurl: '/Personelshiftdetails'
        })
        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPersonelshiftdetails(req, res, next)
}

async function DeletePersonelshiftdetail(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.personelshiftdetailId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PERSONELSHIFTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PERSONELSHIIFTDETAILID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const personelshiftdetail = db.personelshiftdetailModel.findOne({ where: { Uuid: Uuid } })
        if (!personelshiftdetail) {
            return next(createNotfounderror([messages.ERROR.PERSONELSHIIFTDETAIL_NOT_FOUND], req.language))
        }
        if (personelshiftdetail.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PERSONELSHIIFTDETAIL_NOT_ACTIVE], req.language))
        }

        await db.personelshiftdetailModel.destroy({ where: { Uuid: Uuid }, transaction: t });

        await CreateNotification({
            type: types.Delete,
            service: 'Personel Vardiya Detayları',
            role: 'personelshiftdetailnotification',
            message: `${Uuid} numaralı personel vardiya detayı ${username} tarafından Silindi.`,
            pushurl: '/Personelshiftdetails'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetPersonelshiftdetails(req, res, next)
}

module.exports = {
    GetPersonelshiftdetails,
    GetPersonelshiftdetail,
    AddPersonelshiftdetail,
    UpdatePersonelshiftdetail,
    DeletePersonelshiftdetail,
}