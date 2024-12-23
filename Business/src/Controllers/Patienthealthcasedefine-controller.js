const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetPatienthealthcasedefines(req, res, next) {
    try {
        const patienthealthcasedefines = await db.patienthealthcasedefineModel.findAll()
        res.status(200).json(patienthealthcasedefines)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPatienthealthcasedefine(req, res, next) {

    let validationErrors = []
    if (!req.params.patienthealthcasedefineId) {
        validationErrors.push(req.t('Patienthealthcasedefines.Error.PatienthealthcasedefineIDRequired'))
    }
    if (!validator.isUUID(req.params.patienthealthcasedefineId)) {
        validationErrors.push(req.t('Patienthealthcasedefines.Error.UnsupportedPatienthealthcasedefineID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patienthealthcasedefines'), req.language))
    }

    try {
        const patienthealthcasedefine = await db.patienthealthcasedefineModel.findOne({ where: { Uuid: req.params.patienthealthcasedefineId } });
        res.status(200).json(patienthealthcasedefine)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}


async function AddPatienthealthcasedefine(req, res, next) {

    let validationErrors = []
    const {
        Name,
    } = req.body


    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Patienthealthcasedefines.Error.NameRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patienthealthcasedefines'), req.language))
    }

    let patienthealthcasedefineuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.patienthealthcasedefineModel.create({
            ...req.body,
            Uuid: patienthealthcasedefineuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: req.t('Patienthealthcasedefines'),
            role: 'patienthealthcasedefinenotification',
            message: {
                tr: `${Name} İsimli Hasta Sağlık Durum Tanımı  ${username} tarafından Oluşturuldu.`,
                en: `${Name} Patient Health Case Define Created By ${username}`
            }[req.language],
            pushurl: '/Patienthealthcasedefines'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetPatienthealthcasedefines(req, res, next)
}

async function UpdatePatienthealthcasedefine(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Uuid
    } = req.body


    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Patienthealthcasedefines.Error.NameRequired'))
    }

    if (!Uuid) {
        validationErrors.push(req.t('Patienthealthcasedefines.Error.PatienthealthcasedefineIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patienthealthcasedefines.Error.UnsupportedPatienthealthcasedefineID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patienthealthcasedefines'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patienthealthcasedefine = await db.patienthealthcasedefineModel.findOne({ where: { Uuid: Uuid } })
        if (!patienthealthcasedefine) {
            return next(createNotFoundError(req.t('Patienthealthcasedefines.Error.NotFound'), req.t('Patienthealthcasedefines'), req.language))
        }
        if (patienthealthcasedefine.Isactive === false) {
            return next(createNotFoundError(req.t('Patienthealthcasedefines.Error.NotActive'), req.t('Patienthealthcasedefines'), req.language))
        }

        await db.patienthealthcasedefineModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Patienthealthcasedefines'),
            role: 'patienthealthcasedefinenotification',
            message: {
                tr: `${Name} İsimli  Hasta Sağlık Durum Tanımı  ${username} tarafından Güncellendi.`,
                en: `${Name} Patient Health Case Define Updated By ${username}`
            }[req.language],
            pushurl: '/Patienthealthcasedefines'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPatienthealthcasedefines(req, res, next)

}

async function DeletePatienthealthcasedefine(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.patienthealthcasedefineId

    if (!Uuid) {
        validationErrors.push(req.t('Patienthealthcasedefines.Error.PatienthealthcasedefineIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patienthealthcasedefines.Error.UnsupportedPatienthealthcasedefineID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patienthealthcasedefines'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patienthealthcasedefine = await db.patienthealthcasedefineModel.findOne({ where: { Uuid: Uuid } })
        if (!patienthealthcasedefine) {
            return next(createNotFoundError(req.t('Patienthealthcasedefines.Error.NotFound'), req.t('Patienthealthcasedefines'), req.language))
        }
        if (patienthealthcasedefine.Isactive === false) {
            return next(createNotFoundError(req.t('Patienthealthcasedefines.Error.NotActive'), req.t('Patienthealthcasedefines'), req.language))
        }

        await db.patienthealthcasedefineModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Patienthealthcasedefines'),
            role: 'patienthealthcasedefinenotification',
            message: {
                tr: `${patienthealthcasedefine?.Name} İsimli Hasta Sağlık Durum Tanımı  ${username} tarafından Silindi.`,
                en: `${patienthealthcasedefine?.Name} Patient Health Case Define Deleted By ${username}`
            }[req.language],
            pushurl: '/Patienthealthcasedefines'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetPatienthealthcasedefines(req, res, next)
}

module.exports = {
    GetPatienthealthcasedefines,
    GetPatienthealthcasedefine,
    AddPatienthealthcasedefine,
    UpdatePatienthealthcasedefine,
    DeletePatienthealthcasedefine,
}