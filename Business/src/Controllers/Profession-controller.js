const { types } = require("../Constants/Defines")
const messages = require("../Constants/ProfessionMessages")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetProfessions(req, res, next) {
    try {
        const professions = await db.professionModel.findAll({ where: { Isactive: true } })
        res.status(200).json(professions)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetProfession(req, res, next) {

    let validationErrors = []
    if (!req.params.professionId) {
        validationErrors.push(messages.VALIDATION_ERROR.PROFESSIONID_REQUIRED)
    }
    if (!validator.isUUID(req.params.professionId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PROFESSIONID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
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
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
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
            service: 'Meslekler',
            role: 'professionnotification',
            message: `${Name} mesleği ${username} tarafından Oluşturuldu.`,
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
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PROFESSIONID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PROFESSIONID)
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const profession = await db.professionModel.findOne({ where: { Uuid: Uuid } })
        if (!profession) {
            return next(createNotfounderror([messages.ERROR.PROFESSION_NOT_FOUND], req.language))
        }
        if (profession.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PROFESSION_NOT_ACTIVE], req.language))
        }

        await db.professionModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Meslekler',
            role: 'professionnotification',
            message: `${Name} mesleği ${username} tarafından Güncellendi.`,
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
        validationErrors.push(messages.VALIDATION_ERROR.PROFESSIONID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PROFESSIONID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const profession = await db.professionModel.findOne({ where: { Uuid: Uuid } })
        if (!profession) {
            return next(createNotfounderror([messages.ERROR.PROFESSION_NOT_ACTIVE], req.language))
        }
        if (profession.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PROFESSION_NOT_FOUND], req.language))
        }

        await db.professionModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: 'Meslekler',
            role: 'professionnotification',
            message: `${profession?.Name} mesleği ${username} tarafından Silindi.`,
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