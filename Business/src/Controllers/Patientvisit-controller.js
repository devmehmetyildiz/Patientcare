const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetPatientvisits(req, res, next) {
    try {
        const patientvisits = await db.patientvisitModel.findAll()
        res.status(200).json(patientvisits)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPatientvisit(req, res, next) {

    let validationErrors = []
    if (!req.params.patientvisitId) {
        validationErrors.push(req.t('Patientvisits.Error.PatientvisitIDRequired'))
    }
    if (!validator.isUUID(req.params.patientvisitId)) {
        validationErrors.push(req.t('Patientvisits.Error.UnsupportedPatientvisitID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patientvisits'), req.language))
    }

    try {
        const patientvisit = await db.patientvisitModel.findOne({ where: { Uuid: req.params.patientvisitId } });
        res.status(200).json(patientvisit)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddPatientvisit(req, res, next) {

    let validationErrors = []
    const {
        PatientID,
        Contactname,
        Contactstatus,
        Starttime,
        Endtime,
        ParticipateuserID,
    } = req.body

    if (!validator.isUUID(PatientID)) {
        validationErrors.push(req.t('Patientvisits.Error.PatientIDRequired'))
    }
    if (!validator.isString(Contactname)) {
        validationErrors.push(req.t('Patientvisits.Error.ContactnameRequired'))
    }
    if (!validator.isString(Contactstatus)) {
        validationErrors.push(req.t('Patientvisits.Error.ContactstatusRequired'))
    }
    if (!validator.isISODate(Starttime)) {
        validationErrors.push(req.t('Patientvisits.Error.StarttimeRequired'))
    }
    if (!validator.isISODate(Endtime)) {
        validationErrors.push(req.t('Patientvisits.Error.EndtimeRequired'))
    }
    if (!validator.isUUID(ParticipateuserID)) {
        validationErrors.push(req.t('Patientvisits.Error.ParticipateuserIDRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patientvisits'), req.language))
    }

    let visituuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.patientvisitModel.create({
            ...req.body,
            Uuid: visituuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        const patient = await db.patientModel.findOne({ where: { Uuid: PatientID } });
        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } });

        await CreateNotification({
            type: types.Create,
            service: req.t('Patientvisits'),
            role: 'patientvisitnotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Hastasına Ait Ziyaret ${username} tarafından Oluşturuldu.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient Visit Created By ${username}`
            }[req.language],
            pushurl: '/Patientvisits'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetPatientvisits(req, res, next)
}

async function UpdatePatientvisit(req, res, next) {

    let validationErrors = []
    const {
        Uuid,
        PatientID,
        Contactname,
        Contactstatus,
        Starttime,
        Endtime,
        ParticipateuserID,
    } = req.body

    if (!Uuid) {
        validationErrors.push(req.t('Patientvisits.Error.PatientvisitIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patientvisits.Error.UnsupportedPatientvisitID'))
    }
    if (!validator.isUUID(PatientID)) {
        validationErrors.push(req.t('Patientvisits.Error.PatientIDRequired'))
    }
    if (!validator.isString(Contactname)) {
        validationErrors.push(req.t('Patientvisits.Error.ContactnameRequired'))
    }
    if (!validator.isString(Contactstatus)) {
        validationErrors.push(req.t('Patientvisits.Error.ContactstatusRequired'))
    }
    if (!validator.isISODate(Starttime)) {
        validationErrors.push(req.t('Patientvisits.Error.StarttimeRequired'))
    }
    if (!validator.isISODate(Endtime)) {
        validationErrors.push(req.t('Patientvisits.Error.EndtimeRequired'))
    }
    if (!validator.isUUID(ParticipateuserID)) {
        validationErrors.push(req.t('Patientvisits.Error.ParticipateuserIDRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patientvisits'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patientvisit = await db.patientvisitModel.findOne({ where: { Uuid: Uuid } })
        if (!patientvisit) {
            return next(createNotFoundError(req.t('Patientvisits.Error.NotFound'), req.t('Patientvisits'), req.language))
        }
        if (patientvisit.Isactive === false) {
            return next(createNotFoundError(req.t('Patientvisits.Error.NotActive'), req.t('Patientvisits'), req.language))
        }

        await db.patientvisitModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: Uuid }, transaction: t })


        const patient = await db.patientModel.findOne({ where: { Uuid: PatientID } });
        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } });

        await CreateNotification({
            type: types.Update,
            service: req.t('Patientvisits'),
            role: 'patientvisitnotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Hastasına Ait Ziyaret ${username} tarafından Güncellendi.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient Visit Updated By ${username}`
            }[req.language],
            pushurl: '/Patientvisits'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetPatientvisits(req, res, next)
}

async function DeletePatientvisit(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.patientvisitId

    if (!Uuid) {
        validationErrors.push(req.t('Patientvisits.Error.PatientvisitIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patientvisits.Error.UnsupportedPatientvisitID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patientvisits'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patientvisit = await db.patientvisitModel.findOne({ where: { Uuid: Uuid } })
        if (!patientvisit) {
            return next(createNotFoundError(req.t('Patientvisits.Error.NotFound'), req.t('Patientvisits'), req.language))
        }
        if (patientvisit.Isactive === false) {
            return next(createNotFoundError(req.t('Patientvisits.Error.NotActive'), req.t('Patientvisits'), req.language))
        }

        await db.patientvisitModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })


        const patient = await db.patientModel.findOne({ where: { Uuid: patientvisit?.PatientID } });
        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } });

        await CreateNotification({
            type: types.Delete,
            service: req.t('Patientvisits'),
            role: 'patientvisitnotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Hastasına Ait Ziyaret ${username} tarafından Silindi.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient Visit Deleted By ${username}`
            }[req.language],
            pushurl: '/Patientvisits'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPatientvisits(req, res, next)
}

module.exports = {
    GetPatientvisits,
    GetPatientvisit,
    AddPatientvisit,
    UpdatePatientvisit,
    DeletePatientvisit
}