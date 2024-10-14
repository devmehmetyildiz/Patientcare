const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
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
        validationErrors.push(req.t('Usagetypes.Error.UnitIDRequired'))
    }
    if (!validator.isUUID(req.params.usagetypeId)) {
        validationErrors.push(req.t('Usagetypes.Error.UnsupportedUnitID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Usagetypes'), req.language))
    }

    try {
        const usagetype = await db.usagetypeModel.findOne({ where: { Uuid: req.params.usagetypeId } });
        if (!usagetype) {
            return next(createNotFoundError(req.t('Usagetypes.Error.NotFound'), req.t('Usagetypes'), req.language))
        }
        if (!usagetype.Isactive) {
            return next(createNotFoundError(req.t('Usagetypes.Error.NotActive'), req.t('Usagetypes'), req.language))
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
        validationErrors.push(req.t('Usagetypes.Error.NameRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Usagetypes'), req.language))
    }

    let usagetypeuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.usagetypeModel.create({
            ...req.body,
            Uuid: usagetypeuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: req.t('Usagetypes'),
            role: 'usagetypenotification',
            message: {
                en: `${Name} Usagetype Created By ${username}.`,
                tr: `${Name} kullanım türü ${username} tarafından Oluşturuldu.`
            }[req.language],
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

    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Usagetypes.Error.NameRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Usagetypes.Error.UsagetypeIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Usagetypes.Error.UnsupportedUsagetypeID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Usagetypes'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const usagetype = await db.usagetypeModel.findOne({ where: { Uuid: Uuid } })
        if (!usagetype) {
            return next(createNotFoundError(req.t('Usagetypes.Error.NotFound'), req.t('Usagetypes'), req.language))
        }
        if (usagetype.Isactive === false) {
            return next(createNotFoundError(req.t('Usagetypes.Error.NotActive'), req.t('Usagetypes'), req.language))
        }

        await db.usagetypeModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Usagetypes'),
            role: 'usagetypenotification',
            message: {
                en: `${Name} Usagetype Updated By ${username}.`,
                tr: `${Name} Kullanım Türü ${username} Tarafından Güncellendi.`
            }[req.language],
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
        validationErrors.push(req.t('Usagetypes.Error.UsagetypeIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Usagetypes.Error.UnsupportedUsagetypeID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Usagetypes'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const usagetype = await db.usagetypeModel.findOne({ where: { Uuid: Uuid } })
        if (!usagetype) {
            return next(createNotFoundError(req.t('Usagetypes.Error.NotFound'), req.t('Usagetypes'), req.language))
        }
        if (usagetype.Isactive === false) {
            return next(createNotFoundError(req.t('Usagetypes.Error.NotActive'), req.t('Usagetypes'), req.language))
        }

        await db.usagetypeModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Usagetypes'),
            role: 'usagetypenotification',
            message: {
                en: `${usagetype?.Name} Usagetype Deleted By ${username}.`,
                tr: `${usagetype?.Name} Kullanım Türü ${username} Tarafından Silindi.`
            }[req.language],
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