const { types } = require("../Constants/Defines")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const CreateNotification = require("../Utilities/CreateNotification")

async function GetPrinttemplates(req, res, next) {
    try {
        const printtemplates = await db.printtemplateModel.findAll({ where: { Isactive: true } })
        res.status(200).json(printtemplates)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPrinttemplate(req, res, next) {

    let validationErrors = []
    if (!req.params.printtemplateId) {
        validationErrors.push(req.t('Printtemplates.Error.PrinttemplateIDRequired'))
    }
    if (!validator.isUUID(req.params.printtemplateId)) {
        validationErrors.push(req.t('Printtemplates.Error.UnsupportedPrinttemplateID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Printtemplates'), req.language))
    }

    try {
        const printtemplate = await db.printtemplateModel.findOne({ where: { Uuid: req.params.printtemplateId } });
        if (!printtemplate) {
            return next(createNotFoundError(req.t('Printtemplates.Error.NotFound'), req.t('Printtemplates'), req.language))
        }
        if (!printtemplate.Isactive) {
            return next(createNotFoundError(req.t('Printtemplates.Error.NotActive'), req.t('Printtemplates'), req.language))
        }
        res.status(200).json(printtemplate)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddPrinttemplate(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Printtemplate,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Printtemplates.Error.NameRequired'))
    }
    if (!validator.isString(Printtemplate)) {
        validationErrors.push(req.t('Printtemplates.Error.PrinttemplateRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Printtemplates'), req.language))
    }

    let printtemplateuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.printtemplateModel.create({
            ...req.body,
            Uuid: printtemplateuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: req.t('Printtemplates'),
            role: 'printtemplatenotification',
            message: {
                tr: `${Name} Yazdırma Taslağı ${username} tarafından Oluşturuldu.`,
                en: `${Name} Printtemplate Created by ${username}`
            }[req.language],
            pushurl: '/Printtemplates'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetPrinttemplates(req, res, next)
}

async function UpdatePrinttemplate(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Printtemplate,
        Uuid
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Printtemplates.Error.NameRequired'))
    }
    if (!validator.isString(Printtemplate)) {
        validationErrors.push(req.t('Printtemplates.Error.PrinttemplateRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Printtemplates.Error.PrinttemplateIDRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Printtemplates.Error.UnsupportedPrinttemplateID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Printtemplates'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const printtemplate = await db.printtemplateModel.findOne({ where: { Uuid: Uuid } })
        if (!printtemplate) {
            return next(createNotFoundError(req.t('Printtemplates.Error.NotFound'), req.t('Printtemplates'), req.language))
        }
        if (!printtemplate.Isactive) {
            return next(createNotFoundError(req.t('Printtemplates.Error.NotActive'), req.t('Printtemplates'), req.language))
        }

        await db.printtemplateModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Printtemplates'),
            role: 'printtemplatenotification',
            message: {
                tr: `${Name} Yazdırma Taslağı ${username} tarafından Güncelle.`,
                en: `${Name} Printtemplate Updated by ${username}`
            }[req.language],
            pushurl: '/Printtemplates'
        })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetPrinttemplates(req, res, next)
}

async function DeletePrinttemplate(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.printtemplateId

    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Printtemplates.Error.PrinttemplateIDRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Printtemplates.Error.UnsupportedPrinttemplateID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Printtemplates'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const printtemplate = await db.printtemplateModel.findOne({ where: { Uuid: Uuid } })
        if (!printtemplate) {
            return next(createNotFoundError(req.t('Printtemplates.Error.NotFound'), req.t('Printtemplates'), req.language))
        }
        if (!printtemplate.Isactive) {
            return next(createNotFoundError(req.t('Printtemplates.Error.NotActive'), req.t('Printtemplates'), req.language))
        }

        await db.printtemplateModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Printtemplates'),
            role: 'printtemplatenotification',
            message: {
                tr: `${printtemplate?.Name} Yazdırma Taslağı ${username} tarafından Silindi.`,
                en: `${printtemplate?.Name} Printtemplate Deleted by ${username}`
            }[req.language],
            pushurl: '/Printtemplates'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetPrinttemplates(req, res, next)
}

module.exports = {
    GetPrinttemplates,
    GetPrinttemplate,
    AddPrinttemplate,
    UpdatePrinttemplate,
    DeletePrinttemplate,
}

