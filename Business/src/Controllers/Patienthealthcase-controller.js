const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetPatienthealthcases(req, res, next) {
    try {
        const patienthealthcases = await db.patienthealthcaseModel.findAll()
        res.status(200).json(patienthealthcases)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPatienthealthcase(req, res, next) {

    let validationErrors = []
    if (!req.params.patienthealthcaseId) {
        validationErrors.push(req.t('Patienthealthcases.Error.PatienthealthcaseIDRequired'))
    }
    if (!validator.isUUID(req.params.patienthealthcaseId)) {
        validationErrors.push(req.t('Patienthealthcases.Error.UnsupportedPatienthealthcaseID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patienthealthcases'), req.language))
    }

    try {
        const patienthealthcase = await db.patienthealthcaseModel.findOne({ where: { Uuid: req.params.patienthealthcaseId } });
        res.status(200).json(patienthealthcase)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}


async function AddPatienthealthcase(req, res, next) {

    let validationErrors = []
    const {
        PatientID,
        DefineID,
    } = req.body


    if (!validator.isUUID(PatientID)) {
        validationErrors.push(req.t('Patienthealthcases.Error.PatientIDRequired'))
    }
    if (!validator.isUUID(DefineID)) {
        validationErrors.push(req.t('Patienthealthcases.Error.DefineIDRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patienthealthcases'), req.language))
    }

    let patienthealthcaseuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.patienthealthcaseModel.create({
            ...req.body,
            Uuid: patienthealthcaseuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        const patient = await db.patientModel.findOne({ where: { Uuid: PatientID || '' } });
        const patientdefine = await db.patientModel.findOne({ where: { Uuid: patient?.PatientdefineID || '' } });
        const define = await db.patienthealthcasedefineModel.findOne({ where: { Uuid: DefineID || '' } });

        await CreateNotification({
            type: types.Create,
            service: req.t('Patienthealthcases'),
            role: 'patienthealthcasenotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} İsimli Hasta ${define?.Name} Durumu  ${username} tarafından Oluşturuldu.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient ${define?.Name} Case Created By ${username}`
            }[req.language],
            pushurl: '/Patienthealthcases'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetPatienthealthcases(req, res, next)
}

async function UpdatePatienthealthcase(req, res, next) {

    let validationErrors = []
    const {
        PatientID,
        DefineID,
        Uuid
    } = req.body


    if (!validator.isUUID(PatientID)) {
        validationErrors.push(req.t('Patienthealthcases.Error.PatientIDRequired'))
    }
    if (!validator.isUUID(DefineID)) {
        validationErrors.push(req.t('Patienthealthcases.Error.DefineIDRequired'))
    }


    if (!Uuid) {
        validationErrors.push(req.t('Patienthealthcases.Error.PatienthealthcaseIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patienthealthcases.Error.UnsupportedPatienthealthcaseID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patienthealthcases'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patienthealthcase = await db.patienthealthcaseModel.findOne({ where: { Uuid: Uuid } })
        if (!patienthealthcase) {
            return next(createNotFoundError(req.t('Patienthealthcases.Error.NotFound'), req.t('Patienthealthcases'), req.language))
        }
        if (patienthealthcase.Isactive === false) {
            return next(createNotFoundError(req.t('Patienthealthcases.Error.NotActive'), req.t('Patienthealthcases'), req.language))
        }

        await db.patienthealthcaseModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        const patient = await db.patientModel.findOne({ where: { Uuid: PatientID || '' } });
        const patientdefine = await db.patientModel.findOne({ where: { Uuid: patient?.PatientdefineID || '' } });
        const define = await db.patienthealthcasedefineModel.findOne({ where: { Uuid: DefineID || '' } });

        await CreateNotification({
            type: types.Update,
            service: req.t('Patienthealthcases'),
            role: 'patienthealthcasenotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} İsimli  Hasta ${define?.Name} Durumu  ${username} tarafından Güncellendi.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient ${define?.Name} Case Updated By ${username}`
            }[req.language],
            pushurl: '/Patienthealthcases'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPatienthealthcases(req, res, next)

}

async function DeletePatienthealthcase(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.patienthealthcaseId

    if (!Uuid) {
        validationErrors.push(req.t('Patienthealthcases.Error.PatienthealthcaseIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patienthealthcases.Error.UnsupportedPatienthealthcaseID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patienthealthcases'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patienthealthcase = await db.patienthealthcaseModel.findOne({ where: { Uuid: Uuid } })
        if (!patienthealthcase) {
            return next(createNotFoundError(req.t('Patienthealthcases.Error.NotFound'), req.t('Patienthealthcases'), req.language))
        }
        if (patienthealthcase.Isactive === false) {
            return next(createNotFoundError(req.t('Patienthealthcases.Error.NotActive'), req.t('Patienthealthcases'), req.language))
        }

        await db.patienthealthcaseModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        const patient = await db.patientModel.findOne({ where: { Uuid: patienthealthcase?.PatientID || '' } });
        const patientdefine = await db.patientModel.findOne({ where: { Uuid: patient?.PatientdefineID || '' } });
        const define = await db.patienthealthcasedefineModel.findOne({ where: { Uuid: patienthealthcase?.DefineID || '' } });

        await CreateNotification({
            type: types.Update,
            service: req.t('Patienthealthcases'),
            role: 'patienthealthcasenotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} İsimli Hasta ${define?.Name} Durumu  ${username} tarafından Silindi.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient ${define?.Name} Case Deleted By ${username}`
            }[req.language],
            pushurl: '/Patienthealthcases'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetPatienthealthcases(req, res, next)
}

module.exports = {
    GetPatienthealthcases,
    GetPatienthealthcase,
    AddPatienthealthcase,
    UpdatePatienthealthcase,
    DeletePatienthealthcase,
}