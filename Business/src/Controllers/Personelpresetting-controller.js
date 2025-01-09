const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

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
        validationErrors.push(req.t('Personelpresettings.Error.PersonelpresettingIDRequired'))
    }
    if (!validator.isUUID(req.params.personelpresettingId)) {
        validationErrors.push(req.t('Personelpresettings.Error.UnsupportedPersonelpresettingID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Personelpresettings'), req.language))
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
        validationErrors.push(req.t('Personelpresettings.Error.PersonelIDRequired'))
    }
    if (!validator.isBoolean(Isinfinite)) {
        validationErrors.push(req.t('Personelpresettings.Error.IsinfiniteRequired'))
    }
    if (!validator.isBoolean(Isapproved)) {
        validationErrors.push(req.t('Personelpresettings.Error.IsapprovedRequired'))
    }
    if (!validator.isBoolean(Iscompleted)) {
        validationErrors.push(req.t('Personelpresettings.Error.IsCompletedRequired'))
    }
    if (!validator.isBoolean(Isdeactive)) {
        validationErrors.push(req.t('Personelpresettings.Error.IsdeactivatedRequired'))
    }
    if (Isinfinite === false && !validator.isISODate(Startdate)) {
        validationErrors.push(req.t('Personelpresettings.Error.StartdateRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Personelpresettings'), req.language))
    }

    let personelpresettinguuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.personelpresettingModel.create({
            ...req.body,
            Uuid: personelpresettinguuid,
            Isonpreview: true,
            Isapproved: false,
            Iscompleted: false,
            Isplanactive: false,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: req.t('Personelpresettings'),
            role: 'personelpresettingnotification',
            message: {
                tr: `${personelpresettinguuid} Id'li Personel Ön Ayarı ${username} tarafından Oluşturuldu.`,
                en: `${personelpresettinguuid} Id Personel Pre Setting Created By ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Personelpresettings.Error.PersonelIDRequired'))
    }
    if (!validator.isBoolean(Isinfinite)) {
        validationErrors.push(req.t('Personelpresettings.Error.IsinfiniteRequired'))
    }
    if (!validator.isBoolean(Isapproved)) {
        validationErrors.push(req.t('Personelpresettings.Error.IsapprovedRequired'))
    }
    if (!validator.isBoolean(Iscompleted)) {
        validationErrors.push(req.t('Personelpresettings.Error.IsCompletedRequired'))
    }
    if (!validator.isBoolean(Isdeactive)) {
        validationErrors.push(req.t('Personelpresettings.Error.IsdeactivatedRequired'))
    }
    if (Isinfinite === false && !validator.isISODate(Startdate)) {
        validationErrors.push(req.t('Personelpresettings.Error.StartdateRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Personelpresettings.Error.PersonelpresettingIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Personelpresettings.Error.UnsupportedPersonelpresettingID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Personelpresettings'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const personelpresetting = db.personelpresettingModel.findOne({ where: { Uuid: Uuid } })
        if (!personelpresetting) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.NotFound'), req.t('Personelpresettings'), req.language))
        }
        if (personelpresetting.Isactive === false) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.NotActive'), req.t('Personelpresettings'), req.language))
        }
        if (personelpresetting.Isonpreview === false) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.NotOnPreview'), req.t('Personelpresettings'), req.language))
        }
        if (personelpresetting.Isapproved === true) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.Approved'), req.t('Personelpresettings'), req.language))
        }
        if (personelpresetting.Iscompleted === true) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.Completed'), req.t('Personelpresettings'), req.language))
        }

        await db.personelpresettingModel.update({
            ...req.body,
            Isonpreview: true,
            Isapproved: false,
            Iscompleted: false,
            Isplanactive: false,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Personelpresettings'),
            role: 'personelpresettingnotification',
            message: {
                tr: `${Uuid} Id'li Personel Ön Ayarı ${username} tarafından Güncellendi.`,
                en: `${Uuid} Id Personel Pre Setting Updated By ${username}`
            }[req.language],
            pushurl: '/Personelpresettings'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPersonelpresettings(req, res, next)
}

async function SavepreviewPersonelpresetting(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.personelpresettingId

    if (!Uuid) {
        validationErrors.push(req.t('Personelpresettings.Error.PersonelpresettingIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Personelpresettings.Error.UnsupportedPersonelpresettingID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Personelpresettings'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const personelpresetting = await db.personelpresettingModel.findOne({ where: { Uuid: Uuid } })
        if (!personelpresetting) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.NotFound'), req.t('Personelpresettings'), req.language))
        }
        if (personelpresetting.Isactive === false) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.NotActive'), req.t('Personelpresettings'), req.language))
        }
        if (personelpresetting.Isonpreview === false) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.NotOnPreview'), req.t('Personelpresettings'), req.language))
        }
        if (personelpresetting.Isapproved === true) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.Approved'), req.t('Personelpresettings'), req.language))
        }
        if (personelpresetting.Iscompleted === true) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.Completed'), req.t('Personelpresettings'), req.language))
        }

        await db.personelpresettingModel.update({
            Isonpreview: false,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Personelpresettings'),
            role: 'personelpresettingnotification',
            message: {
                tr: `${Uuid} Id'li Personel Ön Ayarı ${username} tarafından Kayıt Edildi.`,
                en: `${Uuid} Id Personel Pre Setting Saved By ${username}`
            }[req.language],
            pushurl: '/Personelpresettings'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPersonelpresettings(req, res, next)
}

async function ApprovePersonelpresetting(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.personelpresettingId

    if (!Uuid) {
        validationErrors.push(req.t('Personelpresettings.Error.PersonelpresettingIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Personelpresettings.Error.UnsupportedPersonelpresettingID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Personelpresettings'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const personelpresetting = await db.personelpresettingModel.findOne({ where: { Uuid: Uuid } })
        if (!personelpresetting) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.NotFound'), req.t('Personelpresettings'), req.language))
        }
        if (personelpresetting.Isactive === false) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.NotActive'), req.t('Personelpresettings'), req.language))
        }
        if (personelpresetting.Isonpreview === true) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.OnPreview'), req.t('Personelpresettings'), req.language))
        }
        if (personelpresetting.Isapproved === true) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.Approved'), req.t('Personelpresettings'), req.language))
        }
        if (personelpresetting.Iscompleted === true) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.Completed'), req.t('Personelpresettings'), req.language))
        }

        await db.personelpresettingModel.update({
            Isapproved: true,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Personelpresettings'),
            role: 'personelpresettingnotification',
            message: {
                tr: `${Uuid} Id'li Personel Ön Ayarı ${username} tarafından Onaylandı.`,
                en: `${Uuid} Id Personel Pre Setting Approved By ${username}`
            }[req.language],
            pushurl: '/Personelpresettings'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPersonelpresettings(req, res, next)
}

async function CompletePersonelpresetting(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.personelpresettingId

    if (!Uuid) {
        validationErrors.push(req.t('Personelpresettings.Error.PersonelpresettingIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Personelpresettings.Error.UnsupportedPersonelpresettingID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Personelpresettings'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const personelpresetting = await db.personelpresettingModel.findOne({ where: { Uuid: Uuid } })
        if (!personelpresetting) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.NotFound'), req.t('Personelpresettings'), req.language))
        }
        if (personelpresetting.Isactive === false) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.NotActive'), req.t('Personelpresettings'), req.language))
        }
        if (personelpresetting.Isonpreview === true) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.OnPreview'), req.t('Personelpresettings'), req.language))
        }
        if (personelpresetting.Isapproved === false) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.NotApproved'), req.t('Personelpresettings'), req.language))
        }
        if (personelpresetting.Iscompleted === true) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.Completed'), req.t('Personelpresettings'), req.language))
        }

        await db.personelpresettingModel.update({
            Iscompleted: true,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Personelpresettings'),
            role: 'personelpresettingnotification',
            message: {
                tr: `${Uuid} Id'li Personel Ön Ayarı ${username} tarafından Tamamlandı.`,
                en: `${Uuid} Id Personel Pre Setting Completed By ${username}`
            }[req.language],
            pushurl: '/Personelpresettings'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPersonelpresettings(req, res, next)
}

async function ActivatePersonelpresetting(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.personelpresettingId

    if (!Uuid) {
        validationErrors.push(req.t('Personelpresettings.Error.PersonelpresettingIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Personelpresettings.Error.UnsupportedPersonelpresettingID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Personelpresettings'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const personelpresetting = await db.personelpresettingModel.findOne({ where: { Uuid: Uuid } })
        if (!personelpresetting) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.NotFound'), req.t('Personelpresettings'), req.language))
        }
        if (personelpresetting.Isactive === false) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.NotActive'), req.t('Personelpresettings'), req.language))
        }
        if (personelpresetting.Isonpreview === true) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.OnPreview'), req.t('Personelpresettings'), req.language))
        }
        if (personelpresetting.Isapproved === false) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.NotApproved'), req.t('Personelpresettings'), req.language))
        }
        if (personelpresetting.Iscompleted === false) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.NotCompleted'), req.t('Personelpresettings'), req.language))
        }
        if (personelpresetting.Isplanactive === true) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.PlanActive'), req.t('Personelpresettings'), req.language))
        }

        await db.personelpresettingModel.update({
            Isplanactive: true,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Personelpresettings'),
            role: 'personelpresettingnotification',
            message: {
                tr: `${Uuid} Id'li Personel Ön Ayarı ${username} tarafından Aktif Edildi.`,
                en: `${Uuid} Id Personel Pre Setting Activated By ${username}`
            }[req.language],
            pushurl: '/Personelpresettings'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPersonelpresettings(req, res, next)
}

async function DeactivatePersonelpresetting(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.personelpresettingId

    if (!Uuid) {
        validationErrors.push(req.t('Personelpresettings.Error.PersonelpresettingIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Personelpresettings.Error.UnsupportedPersonelpresettingID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Personelpresettings'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const personelpresetting = await db.personelpresettingModel.findOne({ where: { Uuid: Uuid } })
        if (!personelpresetting) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.NotFound'), req.t('Personelpresettings'), req.language))
        }
        if (personelpresetting.Isactive === false) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.NotActive'), req.t('Personelpresettings'), req.language))
        }
        if (personelpresetting.Isonpreview === true) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.OnPreview'), req.t('Personelpresettings'), req.language))
        }
        if (personelpresetting.Isapproved === false) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.NotApproved'), req.t('Personelpresettings'), req.language))
        }
        if (personelpresetting.Iscompleted === false) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.NotCompleted'), req.t('Personelpresettings'), req.language))
        }
        if (personelpresetting.Isplanactive === false) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.PlanNotActive'), req.t('Personelpresettings'), req.language))
        }

        await db.personelpresettingModel.update({
            Isplanactive: false,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Personelpresettings'),
            role: 'personelpresettingnotification',
            message: {
                tr: `${Uuid} Id'li Personel Ön Ayarı ${username} tarafından İnaktif Edildi.`,
                en: `${Uuid} Id Personel Pre Setting Deactivated By ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Personelpresettings.Error.PersonelpresettingIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Personelpresettings.Error.UnsupportedPersonelpresettingID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Personelpresettings'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const personelpresetting = await db.personelpresettingModel.findOne({ where: { Uuid: Uuid } })
        if (!personelpresetting) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.NotFound'), req.t('Personelpresettings'), req.language))
        }
        if (personelpresetting.Isactive === false) {
            return next(createNotFoundError(req.t('Personelpresettings.Error.NotActive'), req.t('Personelpresettings'), req.language))
        }

        await db.personelpresettingModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Personelpresettings'),
            role: 'personelpresettingnotification',
            message: {
                tr: `${Uuid} Id'li Personel Ön Ayarı ${username} tarafından Silindi.`,
                en: `${Uuid} Id Personel Pre Setting Deleted By ${username}`
            }[req.language],
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
    SavepreviewPersonelpresetting,
    ApprovePersonelpresetting,
    CompletePersonelpresetting,
    ActivatePersonelpresetting,
    DeactivatePersonelpresetting,
    DeletePersonelpresetting,
}