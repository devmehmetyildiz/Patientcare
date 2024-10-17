const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetPatienteventdefines(req, res, next) {
    try {
        const patienteventdefines = await db.patienteventdefineModel.findAll()
        res.status(200).json(patienteventdefines)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPatienteventdefine(req, res, next) {

    let validationErrors = []
    if (!req.params.patienteventdefineId) {
        validationErrors.push(req.t('Patienteventdefines.Error.PatienteventdefineIDRequired'))
    }
    if (!validator.isUUID(req.params.patienteventdefineId)) {
        validationErrors.push(req.t('Patienteventdefines.Error.UnsupportedPatienteventdefineID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patienteventdefines'), req.language))
    }

    try {
        const patienteventdefine = await db.patienteventdefineModel.findOne({ where: { Uuid: req.params.patienteventdefineId } });
        res.status(200).json(patienteventdefine)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}


async function AddPatienteventdefine(req, res, next) {

    let validationErrors = []
    const {
        Eventname,
    } = req.body


    if (!validator.isString(Eventname)) {
        validationErrors.push(req.t('Patienteventdefines.Error.EventnameRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patienteventdefines'), req.language))
    }

    let patienteventdefineuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.patienteventdefineModel.create({
            ...req.body,
            Uuid: patienteventdefineuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: req.t('Patienteventdefines'),
            role: 'patienteventdefinenotification',
            message: {
                tr: `${Eventname} İsimli Vaka Tanımı  ${username} tarafından Oluşturuldu.`,
                en: `${Eventname} Event Define Created By ${username}`
            }[req.language],
            pushurl: '/Patienteventdefines'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetPatienteventdefines(req, res, next)
}

async function UpdatePatienteventdefine(req, res, next) {

    let validationErrors = []
    const {
        Eventname,
        Uuid
    } = req.body


    if (!validator.isString(Eventname)) {
        validationErrors.push(req.t('Patienteventdefines.Error.EventnameRequired'))
    }

    if (!Uuid) {
        validationErrors.push(req.t('Patienteventdefines.Error.PatienteventdefineIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patienteventdefines.Error.UnsupportedPatienteventdefineID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patienteventdefines'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patienteventdefine = await db.patienteventdefineModel.findOne({ where: { Uuid: Uuid } })
        if (!patienteventdefine) {
            return next(createNotFoundError(req.t('Patienteventdefines.Error.NotFound'), req.t('Patienteventdefines'), req.language))
        }
        if (patienteventdefine.Isactive === false) {
            return next(createNotFoundError(req.t('Patienteventdefines.Error.NotActive'), req.t('Patienteventdefines'), req.language))
        }

        await db.patienteventdefineModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Patienteventdefines'),
            role: 'patienteventdefinenotification',
            message: {
                tr: `${Eventname} İsimli Vaka Tanımı  ${username} tarafından Güncellendi.`,
                en: `${Eventname} Event Define Updated By ${username}`
            }[req.language],
            pushurl: '/Patienteventdefines'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPatienteventdefines(req, res, next)

}

async function DeletePatienteventdefine(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.patienteventdefineId

    if (!Uuid) {
        validationErrors.push(req.t('Patienteventdefines.Error.PatienteventdefineIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patienteventdefines.Error.UnsupportedPatienteventdefineID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patienteventdefines'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patienteventdefine = await db.patienteventdefineModel.findOne({ where: { Uuid: Uuid } })
        if (!patienteventdefine) {
            return next(createNotFoundError(req.t('Patienteventdefines.Error.NotFound'), req.t('Patienteventdefines'), req.language))
        }
        if (patienteventdefine.Isactive === false) {
            return next(createNotFoundError(req.t('Patienteventdefines.Error.NotActive'), req.t('Patienteventdefines'), req.language))
        }

        await db.patienteventdefineModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Patienteventdefines'),
            role: 'patienteventdefinenotification',
            message: {
                tr: `${patienteventdefine?.Eventname} İsimli Vaka Tanımı  ${username} tarafından Silindi.`,
                en: `${patienteventdefine?.Eventname} Event Define Deleted By ${username}`
            }[req.language],
            pushurl: '/Patienteventdefines'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetPatienteventdefines(req, res, next)
}

module.exports = {
    GetPatienteventdefines,
    GetPatienteventdefine,
    AddPatienteventdefine,
    UpdatePatienteventdefine,
    DeletePatienteventdefine,
}