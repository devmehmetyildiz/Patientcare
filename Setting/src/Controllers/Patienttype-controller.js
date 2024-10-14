const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetPatienttypes(req, res, next) {
    try {
        const patienttypes = await db.patienttypeModel.findAll()
        res.status(200).json(patienttypes)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function GetPatienttype(req, res, next) {

    let validationErrors = []
    if (!req.params.patienttypeId) {
        validationErrors.push(req.t('Patienttypes.Error.PatienttypeIDRequired'))
    }
    if (!validator.isUUID(req.params.patienttypeId)) {
        validationErrors.push(req.t('Patienttypes.Error.UnsupportedPatienttypeID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patienttypes'), req.language))
    }

    try {
        const patienttype = await db.patienttypeModel.findOne({ where: { Uuid: req.params.patienttypeId } });
        res.status(200).json(patienttype)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}


async function AddPatienttype(req, res, next) {

    let validationErrors = []
    const {
        Name
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Patienttypes.Error.NameRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patienttypes'), req.language))
    }

    let patienttypeuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.patienttypeModel.create({
            ...req.body,
            Uuid: patienttypeuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: req.t('Patienttypes'),
            role: 'patienttypenotification',
            message: {
                en: `${Name} Patient Type Created By ${username}.`,
                tr: `${Name} Hasta Türü ${username} Tarafından Oluşturuldu.`
            }[req.language],
            pushurl: '/Patienttypes'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetPatienttypes(req, res, next)
}

async function UpdatePatienttype(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Uuid
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Patienttypes.Error.NameRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Patienttypes.Error.PatienttypeIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patienttypes.Error.UnsupportedPatienttypeID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patienttypes'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patienttype = await db.patienttypeModel.findOne({ where: { Uuid: Uuid } })
        if (!patienttype) {
            return next(createNotFoundError(req.t('Patienttypes.Error.NotFound'), req.t('Patienttypes'), req.language))
        }
        if (patienttype.Isactive === false) {
            return next(createNotFoundError(req.t('Patienttypes.Error.NotActive'), req.t('Patienttypes'), req.language))
        }

        await db.patienttypeModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Patienttypes'),
            role: 'patienttypenotification',
            message: {
                en: `${Name} Patient Type Updated By ${username}.`,
                tr: `${Name} Hasta Türü ${username} Tarafından Güncellendi.`
            }[req.language],
            pushurl: '/Patienttypes'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPatienttypes(req, res, next)
}

async function DeletePatienttype(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.patienttypeId

    if (!Uuid) {
        validationErrors.push(req.t('Patienttypes.Error.PatienttypeIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patienttypes.Error.UnsupportedPatienttypeID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patienttypes'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patienttype = await db.patienttypeModel.findOne({ where: { Uuid: Uuid } })
        if (!patienttype) {
            return next(createNotFoundError(req.t('Patienttypes.Error.NotActive'), req.t('Patienttypes'), req.language))
        }
        if (patienttype.Isactive === false) {
            return next(createNotFoundError(req.t('Patienttypes.Error.NotActive'), req.t('Patienttypes'), req.language))
        }

        await db.patienttypeModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Patienttypes'),
            role: 'patienttypenotification',
            message: {
                en: `${patienttype?.Name} Patient Type Deleted By ${username}.`,
                tr: `${patienttype?.Name} Hasta Türü ${username} Tarafından Silindi.`
            }[req.language],
            pushurl: '/Patienttypes'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetPatienttypes(req, res, next)
}

module.exports = {
    GetPatienttypes,
    GetPatienttype,
    AddPatienttype,
    UpdatePatienttype,
    DeletePatienttype,
}