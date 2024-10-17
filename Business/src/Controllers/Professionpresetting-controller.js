const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

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
        validationErrors.push(req.t('Professionpresettings.Error.PersonelpresettingIDRequired'))
    }
    if (!validator.isUUID(req.params.professionpresettingId)) {
        validationErrors.push(req.t('Professionpresettings.Error.UnsupportedPersonelpresettingID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Professionpresettings'), req.language))
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
        validationErrors.push(req.t('Professionpresettings.Error.ProfessionIDRequired'))
    }
    if (!validator.isBoolean(Isinfinite)) {
        validationErrors.push(req.t('Professionpresettings.Error.IsinfiniteRequired'))
    }
    if (!validator.isBoolean(Isapproved)) {
        validationErrors.push(req.t('Professionpresettings.Error.IsapprovedRequired'))
    }
    if (!validator.isBoolean(Iscompleted)) {
        validationErrors.push(req.t('Professionpresettings.Error.IsCompletedRequired'))
    }
    if (!validator.isBoolean(Isdeactive)) {
        validationErrors.push(req.t('Professionpresettings.Error.IsdeactivatedRequired'))
    }
    if (!validator.isBoolean(Ispersonelstay)) {
        validationErrors.push(req.t('Professionpresettings.Error.IspersonelstayRequired'))
    }
    if (Isinfinite === false && !validator.isISODate(Startdate)) {
        validationErrors.push(req.t('Professionpresettings.Error.StartdateRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Professionpresettings'), req.language))
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
            service: req.t('Professionpresettings'),
            role: 'professionpresettingnotification',
            message: {
                tr: `${professionpresettinguuid} Id'li Meslek Ön Ayarı ${username} tarafından Oluşturuldu.`,
                en: `${professionpresettinguuid} Id Profession Pre Setting Created By ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Professionpresettings.Error.ProfessionIDRequired'))
    }
    if (!validator.isBoolean(Isinfinite)) {
        validationErrors.push(req.t('Professionpresettings.Error.IsinfiniteRequired'))
    }
    if (!validator.isBoolean(Isapproved)) {
        validationErrors.push(req.t('Professionpresettings.Error.IsapprovedRequired'))
    }
    if (!validator.isBoolean(Iscompleted)) {
        validationErrors.push(req.t('Professionpresettings.Error.IsCompletedRequired'))
    }
    if (!validator.isBoolean(Isdeactive)) {
        validationErrors.push(req.t('Professionpresettings.Error.IsdeactivatedRequired'))
    }
    if (!validator.isBoolean(Ispersonelstay)) {
        validationErrors.push(req.t('Professionpresettings.Error.IspersonelstayRequired'))
    }
    if (Isinfinite === false && !validator.isISODate(Startdate)) {
        validationErrors.push(req.t('Professionpresettings.Error.StartdateRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Professionpresettings.Error.ProfessionpresettingIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Professionpresettings.Error.UnsupportedProfessionpresettingID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Professionpresettings'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const professionpresetting = db.professionpresettingModel.findOne({ where: { Uuid: Uuid } })
        if (!professionpresetting) {
            return next(createNotFoundError(req.t('Professionpresettings.Error.NotFound'), req.t('Professionpresettings'), req.language))
        }
        if (professionpresetting.Isactive === false) {
            return next(createNotFoundError(req.t('Professionpresettings.Error.NotActive'), req.t('Professionpresettings'), req.language))
        }

        await db.professionpresettingModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })


        await CreateNotification({
            type: types.Update,
            service: req.t('Professionpresettings'),
            role: 'professionpresettingnotification',
            message: {
                tr: `${Uuid} Id'li Meslek Ön Ayarı ${username} tarafından Güncellendi.`,
                en: `${Uuid} Id Profession Pre Setting Updated By ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Professionpresettings.Error.ProfessionpresettingIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Professionpresettings.Error.UnsupportedProfessionpresettingID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Professionpresettings'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const professionpresetting = db.professionpresettingModel.findOne({ where: { Uuid: Uuid } })
        if (!professionpresetting) {
            return next(createNotFoundError(req.t('Professionpresettings.Error.NotFound'), req.t('Professionpresettings'), req.language))
        }
        if (professionpresetting.Isactive === false) {
            return next(createNotFoundError(req.t('Professionpresettings.Error.NotActive'), req.t('Professionpresettings'), req.language))
        }

        await db.professionpresettingModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Professionpresettings'),
            role: 'professionpresettingnotification',
            message: {
                tr: `${Uuid} Id'li Meslek Ön Ayarı ${username} tarafından Silindi.`,
                en: `${Uuid} Id Profession Pre Setting Deleted By ${username}`
            }[req.language],
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