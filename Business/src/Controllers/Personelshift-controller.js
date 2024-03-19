const config = require("../Config")
const { types } = require("../Constants/Defines")
const messages = require("../Constants/PersonelshiftMessages")
const personelshiftdetailMessages = require("../Constants/PersonelshiftdetailMessages")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')

async function GetPersonelshifts(req, res, next) {
    try {
        const personelshifts = await db.personelshiftModel.findAll()
        res.status(200).json(personelshifts)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPersonelshift(req, res, next) {

    let validationErrors = []
    if (!req.params.personelshiftId) {
        validationErrors.push(messages.VALIDATION_ERROR.PERSONELSHIIFTID_REQUIRED)
    }
    if (!validator.isUUID(req.params.personelshiftId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PERSONELSHIIFTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const personelshift = await db.personelshiftModel.findOne({ where: { Uuid: req.params.personelshiftId } });
        res.status(200).json(personelshift)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddPersonelshift(req, res, next) {

    let validationErrors = []
    const {
        Startdate,
        Enddate,
        ProfessionID,
        Isworking,
        Isdeactive,
        Iscompleted,
        Isapproved,
        Personelshiftdetails
    } = req.body


    if (validator.isISODate(Startdate)) {
        validationErrors.push(messages.VALIDATION_ERROR.STARTDATE_REQUIRED)
    }
    if (validator.isISODate(Enddate)) {
        validationErrors.push(messages.VALIDATION_ERROR.ENDDATE_REQUIRED)
    }
    if (validator.isUUID(ProfessionID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PROFESSIONID_REQUIRED)
    }
    if (validator.isBoolean(Isworking)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISWORKING_REQUIRED)
    }
    if (validator.isBoolean(Isdeactive)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISDEACTIVE_REQUIRED)
    }
    if (validator.isBoolean(Iscompleted)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISCOMPLETED_REQUIRED)
    }
    if (validator.isBoolean(Isapproved)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISAPPROVED_REQUIRED)
    }
    if (validator.isArray(Personelshiftdetails)) {
        validationErrors.push(messages.VALIDATION_ERROR.PERSONELSHIFTDETAILS_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let personelshiftuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.personelshiftModel.create({
            ...req.body,
            Uuid: personelshiftuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        for (const personelshiftdetail of Personelshiftdetails) {

            let detailErrors = []
            if (validator.isUUID(personelshiftdetail?.ShiftID)) {
                detailErrors.push(personelshiftdetailMessages.VALIDATION_ERROR.SHIFTID_REQUIRED)
            }
            if (validator.isUUID(personelshiftdetail?.PersonelID)) {
                detailErrors.push(personelshiftdetailMessages.VALIDATION_ERROR.PERSONELID_REQUIRED)
            }
            if (validator.isUUID(personelshiftdetail?.FloorID)) {
                detailErrors.push(personelshiftdetailMessages.VALIDATION_ERROR.FLOORID_REQUIRED)
            }
            if (validator.isNumber(personelshiftdetail?.Day)) {
                detailErrors.push(personelshiftdetailMessages.VALIDATION_ERROR.DAY_REQUIRED)
            }
            if (validator.isBoolean(personelshiftdetail?.Isworking)) {
                detailErrors.push(personelshiftdetailMessages.VALIDATION_ERROR.ISWORKING_REQUIRED)
            }
            if (validator.isBoolean(personelshiftdetail?.Isonannual)) {
                detailErrors.push(personelshiftdetailMessages.VALIDATION_ERROR.ISONANNUAL_REQUIRED)
            }
            if (validator.isNumber(personelshiftdetail?.Annualtype)) {
                detailErrors.push(personelshiftdetailMessages.VALIDATION_ERROR.ANNUALTYPE_REQUIRED)
            }
            if (detailErrors.length > 0) {
                return next(createValidationError(detailErrors, req.language))
            }

            let personelshiftdetailuuid = uuid()

            await db.personelshiftdetailModel.create({
                ...personelshiftdetail,
                PersonelshiftID:personelshiftuuid,
                Uuid: personelshiftdetailuuid,
                Createduser: username,
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
        
        }

        await CreateNotification({
            type: types.Create,
            service: 'Personel Vardiyaları',
            role: 'personelshiftnotification',
            message: `${personelshiftuuid} numaralı personel vardiyası ${username} tarafından Eklendi.`,
            pushurl: '/Personelshifts'
        })
        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }

    GetPersonelshifts(req, res, next)
}

async function UpdatePersonelshift(req, res, next) {

    let validationErrors = []
    const {
        Startdate,
        Enddate,
        ProfessionID,
        Isworking,
        Isdeactive,
        Iscompleted,
        Isapproved,
        Personelshiftdetails,
        Uuid,
    } = req.body

    if (validator.isISODate(Startdate)) {
        validationErrors.push(messages.VALIDATION_ERROR.STARTDATE_REQUIRED)
    }
    if (validator.isISODate(Enddate)) {
        validationErrors.push(messages.VALIDATION_ERROR.ENDDATE_REQUIRED)
    }
    if (validator.isUUID(ProfessionID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PROFESSIONID_REQUIRED)
    }
    if (validator.isBoolean(Isworking)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISWORKING_REQUIRED)
    }
    if (validator.isBoolean(Isdeactive)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISDEACTIVE_REQUIRED)
    }
    if (validator.isBoolean(Iscompleted)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISCOMPLETED_REQUIRED)
    }
    if (validator.isBoolean(Isapproved)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISAPPROVED_REQUIRED)
    }
    if (validator.isArray(Personelshiftdetails)) {
        validationErrors.push(messages.VALIDATION_ERROR.PERSONELSHIFTDETAILS_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PERSONELSHIIFTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PERSONELSHIIFTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const personelshift = db.personelshiftModel.findOne({ where: { Uuid: Uuid } })
        if (!personelshift) {
            return next(createNotfounderror([messages.ERROR.PERSONELSHIIFT_NOT_FOUND], req.language))
        }
        if (personelshift.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PERSONELSHIIFT_NOT_ACTIVE], req.language))
        }

        await db.personelshiftModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        for (const personelshiftdetail of Personelshiftdetails) {

            let detailErrors = []
            if (validator.isUUID(personelshiftdetail?.ShiftID)) {
                detailErrors.push(personelshiftdetailMessages.VALIDATION_ERROR.SHIFTID_REQUIRED)
            }
            if (validator.isUUID(personelshiftdetail?.PersonelID)) {
                detailErrors.push(personelshiftdetailMessages.VALIDATION_ERROR.PERSONELID_REQUIRED)
            }
            if (validator.isUUID(personelshiftdetail?.FloorID)) {
                detailErrors.push(personelshiftdetailMessages.VALIDATION_ERROR.FLOORID_REQUIRED)
            }
            if (validator.isNumber(personelshiftdetail?.Day)) {
                detailErrors.push(personelshiftdetailMessages.VALIDATION_ERROR.DAY_REQUIRED)
            }
            if (validator.isBoolean(personelshiftdetail?.Isworking)) {
                detailErrors.push(personelshiftdetailMessages.VALIDATION_ERROR.ISWORKING_REQUIRED)
            }
            if (validator.isBoolean(personelshiftdetail?.Isonannual)) {
                detailErrors.push(personelshiftdetailMessages.VALIDATION_ERROR.ISONANNUAL_REQUIRED)
            }
            if (validator.isNumber(personelshiftdetail?.Annualtype)) {
                detailErrors.push(personelshiftdetailMessages.VALIDATION_ERROR.ANNUALTYPE_REQUIRED)
            }
            if (!personelshiftdetail?.Uuid) {
                validationErrors.push(personelshiftdetailMessages.VALIDATION_ERROR.PERSONELSHIIFTDETAILID_REQUIRED)
            }
            if (!validator.isUUID(personelshiftdetail?.Uuid)) {
                validationErrors.push(personelshiftdetailMessages.VALIDATION_ERROR.UNSUPPORTED_PERSONELSHIIFTDETAILID)
            }
            if (detailErrors.length > 0) {
                return next(createValidationError(detailErrors, req.language))
            }

            const personelshiftdetail = db.personelshiftdetailModel.findOne({ where: { Uuid: Uuid } })
            if (!personelshiftdetail) {
                return next(createNotfounderror([personelshiftdetailMessages.ERROR.PERSONELSHIIFTDETAIL_NOT_FOUND], req.language))
            }
            if (personelshiftdetail.Isactive === false) {
                return next(createAccessDenied([personelshiftdetailMessages.ERROR.PERSONELSHIIFTDETAIL_NOT_ACTIVE], req.language))
            }

            await db.personelshiftdetailModel.update({
                ...personelshiftdetail,
                Updateduser: username,
                Updatetime: new Date(),
            }, { where: { Uuid: Uuid } }, { transaction: t })
        
        }

        await CreateNotification({
            type: types.Update,
            service: 'Personel Vardiyaları',
            role: 'personelshiftnotification',
            message: `${Uuid} numaralı personel vardiyası ${username} tarafından güncellendi.`,
            pushurl: '/Personelshifts'
        })
        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPersonelshifts(req, res, next)
}

async function DeletePersonelshift(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.personelshiftId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PERSONELSHIIFTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PERSONELSHIIFTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const personelshift = db.personelshiftModel.findOne({ where: { Uuid: Uuid } })
        if (!personelshift) {
            return next(createNotfounderror([messages.ERROR.PERSONELSHIIFT_NOT_FOUND], req.language))
        }
        if (personelshift.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PERSONELSHIIFT_NOT_ACTIVE], req.language))
        }

        await db.personelshiftModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await db.personelshiftdetailModel.destroy({ where: { PersonelshiftID: Uuid }, transaction: t });

        await CreateNotification({
            type: types.Delete,
            service: 'Personel Vardiyaları',
            role: 'personelshiftnotification',
            message: `${Uuid} numaralı personel vardiyası ${username} tarafından silindi.`,
            pushurl: '/Personelshifts'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetPersonelshifts(req, res, next)
}

module.exports = {
    GetPersonelshifts,
    GetPersonelshift,
    AddPersonelshift,
    UpdatePersonelshift,
    DeletePersonelshift,
}