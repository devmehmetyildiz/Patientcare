const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetPatienteventmovements(req, res, next) {
    try {
        const patienteventmovemens = await db.patienteventmovementModel.findAll()
        res.status(200).json(patienteventmovemens)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPatienteventmovement(req, res, next) {

    let validationErrors = []
    if (!req.params.patienteventmovementId) {
        validationErrors.push(req.t('Patienteventmovements.Error.PatienteventmovementIDRequired'))
    }
    if (!validator.isUUID(req.params.patienteventmovementId)) {
        validationErrors.push(req.t('Patienteventmovements.Error.UnsupportedPatienteventmovementID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patienteventmovements'), req.language))
    }

    try {
        const patienteventmovement = await db.patienteventmovementModel.findOne({ where: { Uuid: req.params.patienteventmovementId } });
        res.status(200).json(patienteventmovement)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}


async function AddPatienteventmovement(req, res, next) {

    let validationErrors = []
    const {
        Type,
        PatientID,
        EventID,
        UserID,
        Occureddate,
        Solutiontime,
    } = req.body

    if (!validator.isString(Type)) {
        validationErrors.push(req.t('Patienteventmovements.Error.TypeRequired'))
    }
    if (!validator.isString(PatientID)) {
        validationErrors.push(req.t('Patienteventmovements.Error.PatientIDRequired'))
    }
    if (!validator.isString(EventID)) {
        validationErrors.push(req.t('Patienteventmovements.Error.EventIDRequired'))
    }
    if (!validator.isString(UserID)) {
        validationErrors.push(req.t('Patienteventmovements.Error.UserIDRequired'))
    }
    if (!validator.isString(Occureddate)) {
        validationErrors.push(req.t('Patienteventmovements.Error.OccureddateRequired'))
    }
    if (!validator.isString(Solutiontime)) {
        validationErrors.push(req.t('Patienteventmovements.Error.SolutiontimeRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patienteventmovements'), req.language))
    }

    let movementuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.patienteventmovementModel.create({
            ...req.body,
            Uuid: movementuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        const patient = await db.patientModel.findOne({ where: { Uuid: PatientID } })
        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } })

        await CreateNotification({
            type: types.Create,
            service: req.t('Patienteventmovements'),
            role: 'patienteventmovementnotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Hastasına Ait Vaka  ${username} tarafından Oluşturuldu.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient Created By ${username}`
            }[req.language],
            pushurl: '/Patienteventmovements'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetPatienteventmovements(req, res, next)
}

async function UpdatePatienteventmovement(req, res, next) {

    let validationErrors = []
    const {
        Type,
        PatientID,
        EventID,
        UserID,
        Occureddate,
        Solutiontime,
        Uuid
    } = req.body


    if (!validator.isString(Type)) {
        validationErrors.push(req.t('Patienteventmovements.Error.TypeRequired'))
    }
    if (!validator.isString(PatientID)) {
        validationErrors.push(req.t('Patienteventmovements.Error.PatientIDRequired'))
    }
    if (!validator.isString(EventID)) {
        validationErrors.push(req.t('Patienteventmovements.Error.EventIDRequired'))
    }
    if (!validator.isString(UserID)) {
        validationErrors.push(req.t('Patienteventmovements.Error.UserIDRequired'))
    }
    if (!validator.isString(Occureddate)) {
        validationErrors.push(req.t('Patienteventmovements.Error.OccureddateRequired'))
    }
    if (!validator.isString(Solutiontime)) {
        validationErrors.push(req.t('Patienteventmovements.Error.SolutiontimeRequired'))
    }

    if (!Uuid) {
        validationErrors.push(req.t('Patienteventmovements.Error.PatienteventmovementIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patienteventmovements.Error.UnsupportedPatienteventmovementID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patienteventmovements'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patienteventmovement = await db.patienteventmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!patienteventmovement) {
            return next(createNotFoundError(req.t('Patienteventmovements.Error.NotFound'), req.t('Patienteventmovements'), req.language))
        }
        if (patienteventmovement.Isactive === false) {
            return next(createNotFoundError(req.t('Patienteventmovements.Error.NotActive'), req.t('Patienteventmovements'), req.language))
        }

        await db.patienteventmovementModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Patienteventmovements'),
            role: 'patienteventmovementnotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Hastasına Ait Vaka  ${username} tarafından Güncellendi.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient Updated By ${username}`
            }[req.language],
            pushurl: '/Patienteventmovements'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPatienteventmovements(req, res, next)

}

async function DeletePatienteventmovement(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.patienteventmovementId

    if (!Uuid) {
        validationErrors.push(req.t('Patienteventmovements.Error.PatienteventmovementIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patienteventmovements.Error.UnsupportedPatienteventmovementID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patienteventmovements'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patienteventmovement = await db.patienteventmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!patienteventmovement) {
            return next(createNotFoundError(req.t('Patienteventmovements.Error.NotFound'), req.t('Patienteventmovements'), req.language))
        }
        if (patienteventmovement.Isactive === false) {
            return next(createNotFoundError(req.t('Patienteventmovements.Error.NotActive'), req.t('Patienteventmovements'), req.language))
        }

        await db.patienteventmovementModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Patienteventmovements'),
            role: 'patienteventmovementnotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Hastasına Ait Vaka  ${username} tarafından Silindi.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient Deleted By ${username}`
            }[req.language],
            pushurl: '/Patienteventmovements'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetPatienteventmovements(req, res, next)
}

module.exports = {
    GetPatienteventmovements,
    GetPatienteventmovement,
    AddPatienteventmovement,
    UpdatePatienteventmovement,
    DeletePatienteventmovement,
}