const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetProfessions(req, res, next) {
    try {
        const professions = await db.professionModel.findAll()
        res.status(200).json(professions)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetProfession(req, res, next) {

    let validationErrors = []
    if (!req.params.professionId) {
        validationErrors.push(req.t('Professions.Error.ProfessionIDRequired'))
    }
    if (!validator.isUUID(req.params.professionId)) {
        validationErrors.push(req.t('Professions.Error.UnsupportedProfessionID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Professions'), req.language))
    }

    try {
        const profession = await db.professionModel.findOne({ where: { Uuid: req.params.professionId } });
        res.status(200).json(profession)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}


async function AddProfession(req, res, next) {

    let validationErrors = []
    const {
        Name,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Professions.Error.NameRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Professions'), req.language))
    }

    let professionuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.professionModel.create({
            ...req.body,
            Uuid: professionuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: req.t('Professions'),
            role: 'professionnotification',
            message: {
                tr: `${Name} İsimli Meslek ${username} tarafından Oluşturuldu.`,
                en: `${Name} Profession Created By ${username}`
            }[req.language],
            pushurl: '/Professions'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetProfessions(req, res, next)
}


async function UpdateProfession(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Uuid
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Professions.Error.NameRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Professions.Error.ProfessionIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Professions.Error.UnsupportedProfessionID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Professions'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const profession = await db.professionModel.findOne({ where: { Uuid: Uuid } })
        if (!profession) {
            return next(createNotFoundError(req.t('Professions.Error.NotFound'), req.t('Professions'), req.language))
        }
        if (profession.Isactive === false) {
            return next(createNotFoundError(req.t('Professions.Error.NotActive'), req.t('Professions'), req.language))
        }

        await db.professionModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Professions'),
            role: 'professionnotification',
            message: {
                tr: `${Name} İsimli Meslek ${username} tarafından Güncellendi.`,
                en: `${Name} Profession Updated By ${username}`
            }[req.language],
            pushurl: '/Professions'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetProfessions(req, res, next)

}

async function DeleteProfession(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.professionId

    if (!Uuid) {
        validationErrors.push(req.t('Professions.Error.ProfessionIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Professions.Error.UnsupportedProfessionID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Professions'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const profession = await db.professionModel.findOne({ where: { Uuid: Uuid } })
        if (!profession) {
            return next(createNotFoundError(req.t('Professions.Error.NotFound'), req.t('Professions'), req.language))
        }
        if (profession.Isactive === false) {
            return next(createNotFoundError(req.t('Professions.Error.NotActive'), req.t('Professions'), req.language))
        }

        await db.professionModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Professions'),
            role: 'professionnotification',
            message: {
                tr: `${profession?.Name} İsimli Meslek ${username} tarafından Silindi.`,
                en: `${profession?.Name} Profession Deleted By ${username}`
            }[req.language],
            pushurl: '/Professions'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetProfessions(req, res, next)
}

module.exports = {
    GetProfessions,
    GetProfession,
    AddProfession,
    UpdateProfession,
    DeleteProfession,
}