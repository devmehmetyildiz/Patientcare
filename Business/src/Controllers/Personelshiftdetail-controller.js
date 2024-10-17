const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

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
        validationErrors.push(req.t('Personelshiftdetails.Error.PersonelshiftdetailIDRequired'))
    }
    if (!validator.isUUID(req.params.personelshiftdetailId)) {
        validationErrors.push(req.t('Personelshiftdetails.Error.UnsupportedPersonelshiftdetailID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Personelshiftdetails'), req.language))
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
        validationErrors.push(req.t('Personelshiftdetails.Error.PersonelshiftIDRequired'))
    }
    if (validator.isUUID(ShiftID)) {
        validationErrors.push(req.t('Personelshiftdetails.Error.ShiftIDRequired'))
    }
    if (validator.isUUID(PersonelID)) {
        validationErrors.push(req.t('Personelshiftdetails.Error.PersonelIDRequired'))
    }
    if (validator.isUUID(FloorID)) {
        validationErrors.push(req.t('Personelshiftdetails.Error.FloorIDRequired'))
    }
    if (validator.isNumber(Day)) {
        validationErrors.push(req.t('Personelshiftdetails.Error.DayRequired'))
    }
    if (validator.isBoolean(Isworking)) {
        validationErrors.push(req.t('Personelshiftdetails.Error.IsworkingRequired'))
    }
    if (validator.isBoolean(Isonannual)) {
        validationErrors.push(req.t('Personelshiftdetails.Error.IsonannualRequired'))
    }
    if (validator.isNumber(Annualtype)) {
        validationErrors.push(req.t('Personelshiftdetails.Error.AnnualtypeRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Personelshiftdetails'), req.language))
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
            service: req.t('Personelshiftdetails'),
            role: 'personelshiftdetailnotification',
            message: {
                tr: `${PersonelshiftID} Id'li Personel Vardiya detayı ${username} tarafından Oluşturuldu.`,
                en: `${PersonelshiftID} With ID Personel Shift Detail Created By ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Personelshiftdetails.Error.PersonelshiftIDRequired'))
    }
    if (validator.isUUID(ShiftID)) {
        validationErrors.push(req.t('Personelshiftdetails.Error.ShiftIDRequired'))
    }
    if (validator.isUUID(PersonelID)) {
        validationErrors.push(req.t('Personelshiftdetails.Error.PersonelIDRequired'))
    }
    if (validator.isUUID(FloorID)) {
        validationErrors.push(req.t('Personelshiftdetails.Error.FloorIDRequired'))
    }
    if (validator.isNumber(Day)) {
        validationErrors.push(req.t('Personelshiftdetails.Error.DayRequired'))
    }
    if (validator.isBoolean(Isworking)) {
        validationErrors.push(req.t('Personelshiftdetails.Error.IsworkingRequired'))
    }
    if (validator.isBoolean(Isonannual)) {
        validationErrors.push(req.t('Personelshiftdetails.Error.IsonannualRequired'))
    }
    if (validator.isNumber(Annualtype)) {
        validationErrors.push(req.t('Personelshiftdetails.Error.AnnualtypeRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Personelshiftdetails.Error.PersonelshiftdetailIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Personelshiftdetails.Error.UnsupportedPersonelshiftdetailID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Personelshiftdetails'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const personelshiftdetail = db.personelshiftdetailModel.findOne({ where: { Uuid: Uuid } })
        if (!personelshiftdetail) {
            return next(createNotFoundError(req.t('Personelshiftdetails.Error.NotFound'), req.t('Personelshiftdetails'), req.language))
        }
        if (personelshiftdetail.Isactive === false) {
            return next(createNotFoundError(req.t('Personelshiftdetails.Error.NotActive'), req.t('Personelshiftdetails'), req.language))
        }

        await db.personelshiftdetailModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Personelshiftdetails'),
            role: 'personelshiftdetailnotification',
            message: {
                tr: `${PersonelshiftID} Id'li Personel Vardiya detayı ${username} tarafından Güncellendi.`,
                en: `${PersonelshiftID} With ID Personel Shift Detail Updated By ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Personelshiftdetails.Error.PersonelshiftdetailIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Personelshiftdetails.Error.UnsupportedPersonelshiftdetailID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Personelshiftdetails'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const personelshiftdetail = db.personelshiftdetailModel.findOne({ where: { Uuid: Uuid } })
        if (!personelshiftdetail) {
            return next(createNotFoundError(req.t('Personelshiftdetails.Error.NotFound'), req.t('Personelshiftdetails'), req.language))
        }
        if (personelshiftdetail.Isactive === false) {
            return next(createNotFoundError(req.t('Personelshiftdetails.Error.NotActive'), req.t('Personelshiftdetails'), req.language))
        }

        await db.personelshiftdetailModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Personelshiftdetails'),
            role: 'personelshiftdetailnotification',
            message: {
                tr: `${personelshiftdetail?.PersonelshiftID} Id'li Personel Vardiya detayı ${username} tarafından Silindi.`,
                en: `${personelshiftdetail?.PersonelshiftID} With ID Personel Shift Detail Deleted By ${username}`
            }[req.language],
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