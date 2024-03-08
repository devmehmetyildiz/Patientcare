const { types } = require("../Constants/Defines")
const config = require("../Config")
const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')
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
        validationErrors.push(messages.VALIDATION_ERROR.PRINTTEMPLATEID_REQUIRED)
    }
    if (!validator.isUUID(req.params.printtemplateId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PRINTTEMPLATEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const printtemplate = await db.printtemplateModel.findOne({ where: { Uuid: req.params.printtemplateId } });
        if (!printtemplate) {
            return next(createNotfounderror([messages.ERROR.PRINTTEMPLATE_NOT_FOUND], req.language))
        }
        if (!printtemplate.Isactive) {
            return next(createNotfounderror([messages.ERROR.PRINTTEMPLATE_NOT_ACTIVE], req.language))
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
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isString(Printtemplate)) {
        validationErrors.push(messages.VALIDATION_ERROR.PRINTTEMPLATE_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
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
            service: 'Yazdırma Taslakları',
            role: 'printtemplatenotification',
            message: `${Name} yazdırma taslağı ${username} tarafından Oluşturuldu.`,
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
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isString(Printtemplate)) {
        validationErrors.push(messages.VALIDATION_ERROR.PRINTTEMPLATE_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.PRINTTEMPLATEID_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PRINTTEMPLATEID)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const printtemplate = await db.printtemplateModel.findOne({ where: { Uuid: Uuid } })
        if (!printtemplate) {
            return next(createNotfounderror([messages.ERROR.PRINTTEMPLATE_NOT_FOUND], req.language))
        }
        if (!printtemplate.Isactive) {
            return next(createAccessDenied([messages.ERROR.PRINTTEMPLATE_NOT_ACTIVE], req.language))
        }

        await db.printtemplateModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Yazdırma Taslakları',
            role: 'printtemplatenotification',
            message: `${Name} yazdırma taslağı ${username} tarafından Güncellendi.`,
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

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PRINTTEMPLATEID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PRINTTEMPLATEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const printtemplate = await db.printtemplateModel.findOne({ where: { Uuid: Uuid } })
        if (!printtemplate) {
            return next(createNotfounderror([messages.ERROR.PRINTTEMPLATE_NOT_FOUND], req.language))
        }
        if (!printtemplate.Isactive) {
            return next(createAccessDenied([messages.ERROR.PRINTTEMPLATE_NOT_ACTIVE], req.language))
        }

        await db.printtemplateModel.destroy({ where: { Uuid: Uuid }, transaction: t });

        await CreateNotification({
            type: types.Delete,
            service: 'Yazdırma Taslakları',
            role: 'printtemplatenotification',
            message: `${Name} yazdırma taslağı ${username} tarafından Silindi.`,
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