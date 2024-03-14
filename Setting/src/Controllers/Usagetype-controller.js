const { types } = require("../Constants/Defines")
const messages = require("../Constants/Messages")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetUsagetypes(req, res, next) {
    try {
        const usagetypes = await db.usagetypeModel.findAll()
        res.status(200).json(usagetypes)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetUsagetype(req, res, next) {

    let validationErrors = []
    if (!req.params.usagetypeId) {
        validationErrors.push(messages.VALIDATION_ERROR.USAGETYPEID_REQUIRED)
    }
    if (!validator.isUUID(req.params.usagetypeId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_USAGETYPEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const usagetype = await db.usagetypeModel.findOne({ where: { Uuid: req.params.usagetypeId } });
        if (!usagetype) {
            return createNotfounderror([messages.ERROR.USAGETYPE_NOT_FOUND])
        }
        if (!usagetype.Isactive) {
            return createNotfounderror([messages.ERROR.USAGETYPE_NOT_ACTIVE])
        }
        res.status(200).json(usagetype)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddUsagetype(req, res, next) {

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

    let usagetypeuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.usagetypeModel.create({
            ...req.body,
            Uuid: usagetypeuuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: 'Kullanım Türleri',
            role: 'usagetypenotification',
            message: `${Name} kullanım türü ${username} tarafından Oluşturuldu.`,
            pushurl: '/Usagetypes'
        })
        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetUsagetypes(req, res, next)
}

async function UpdateUsagetype(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Uuid
    } = req.body

    if (!Name || !validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.USAGETYPEID_REQUIRED)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const usagetype =await db.usagetypeModel.findOne({ where: { Uuid: Uuid } })
        if (!usagetype) {
            return next(createNotfounderror([messages.ERROR.USAGETYPE_NOT_FOUND], req.language))
        }
        if (usagetype.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.USAGETYPE_NOT_ACTIVE], req.language))
        }

        await db.usagetypeModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Kullanım Türleri',
            role: 'usagetypenotification',
            message: `${Name} kullanım türü ${username} tarafından Güncellendi.`,
            pushurl: '/Usagetypes'
        })
        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetUsagetypes(req, res, next)

}

async function DeleteUsagetype(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.usagetypeId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.USAGETYPEID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_USAGETYPEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const usagetype =await db.usagetypeModel.findOne({ where: { Uuid: Uuid } })
        if (!usagetype) {
            return next(createNotfounderror([messages.ERROR.USAGETYPE_NOT_FOUND], req.language))
        }
        if (usagetype.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.USAGETYPE_NOT_ACTIVE], req.language))
        }

        await db.usagetypeModel.destroy({ where: { Uuid: Uuid }, transaction: t });

        await CreateNotification({
            type: types.Delete,
            service: 'Kullanım Türleri',
            role: 'usagetypenotification',
            message: `${usagetype?.Name} kullanım türü ${username} tarafından Silindi.`,
            pushurl: '/Usagetypes'
        })
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetUsagetypes(req, res, next)
}

module.exports = {
    GetUsagetypes,
    GetUsagetype,
    AddUsagetype,
    UpdateUsagetype,
    DeleteUsagetype,
}