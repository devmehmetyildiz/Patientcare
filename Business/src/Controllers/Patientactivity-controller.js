const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetPatientactivities(req, res, next) {
    try {
        const patientactivities = await db.patientactivityModel.findAll()
        for (const patientactivity of patientactivities) {
            patientactivity.Participatedpatients = await db.patientactivityparticipatedpatientModel.findAll({ where: { ActivityID: patientactivity.Uuid } })
            patientactivity.Participatedusers = await db.patientactivityparticipateduserModel.findAll({ where: { ActivityID: patientactivity.Uuid } })
        }
        res.status(200).json(patientactivities)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPatientactivity(req, res, next) {

    let validationErrors = []
    if (!req.params.activityId) {
        validationErrors.push(req.t('Patientactivities.Error.PatientactivityIDRequired'))
    }
    if (!validator.isUUID(req.params.activityId)) {
        validationErrors.push(req.t('Patientactivities.Error.UnsupportedPatientactivityID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patientactivities'), req.language))
    }

    try {
        const patientactivity = await db.patientactivityModel.findOne({ where: { Uuid: req.params.activityId } });
        patientactivity.Participatedpatients = await db.patientactivityparticipatedpatientModel.findAll({ where: { ActivityID: patientactivity.Uuid } })
        patientactivity.Participatedusers = await db.patientactivityparticipateduserModel.findAll({ where: { ActivityID: patientactivity.Uuid } })
        res.status(200).json(patientactivity)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddPatientactivity(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Starttime,
        Endtime,
        Participatedpatients,
        Participatedusers,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Patientactivities.Error.NameRequired'))
    }
    if (!validator.isString(Starttime)) {
        validationErrors.push(req.t('Patientactivities.Error.NameRequired'))
    }
    if (!validator.isString(Endtime)) {
        validationErrors.push(req.t('Patientactivities.Error.NameRequired'))
    }
    if (!validator.isArray(Participatedpatients)) {
        validationErrors.push(req.t('Patientactivities.Error.NameRequired'))
    }
    if (!validator.isArray(Participatedusers)) {
        validationErrors.push(req.t('Patientactivities.Error.NameRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patientactivities'), req.language))
    }

    let activityuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.patientactivityModel.create({
            ...req.body,
            Uuid: activityuuid,
            Isonpreview: true,
            Isapproved: false,
            Iscompleted: false,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        for (const patient of Participatedpatients) {

            if (!validator.isUUID(patient)) {
                return next(createValidationError(req.t('Patientactivities.Error.UnsupportedPatientID'), req.t('Patientactivities'), req.language))
            }

            const patientuuid = uuid()

            await db.patientactivityparticipatedpatientModel.create({
                Uuid: patientuuid,
                ActivityID: activityuuid,
                PatientID: patient || '',
                Createduser: username,
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
        }

        for (const user of Participatedusers) {

            if (!validator.isUUID(user)) {
                return next(createValidationError(req.t('Patientactivities.Error.UnsupportedUserID'), req.t('Patientactivities'), req.language))
            }

            const useruuid = uuid()

            await db.patientactivityparticipatedpatientModel.create({
                Uuid: useruuid,
                ActivityID: activityuuid,
                UserID: user || '',
                Createduser: username,
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
        }

        await CreateNotification({
            type: types.Create,
            service: req.t('Patientactivities'),
            role: 'patientactivitynotification',
            message: {
                tr: `${Name} Hasta Etkinliği ${username} tarafından Oluşturuldu.`,
                en: `${Name} Patient Activity Created By ${username}`
            }[req.language],
            pushurl: '/Patientactivities'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetPatientactivities(req, res, next)
}

async function UpdatePatientactivity(req, res, next) {

    let validationErrors = []
    const {
        Uuid,
        Name,
        Starttime,
        Endtime,
        Participatedpatients,
        Participatedusers,
    } = req.body

    if (!Uuid) {
        validationErrors.push(req.t('Patientactivities.Error.PatientactivityIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patientactivities.Error.UnsupportedPatientactivityID'))
    }
    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Patientactivities.Error.NameRequired'))
    }
    if (!validator.isString(Starttime)) {
        validationErrors.push(req.t('Patientactivities.Error.NameRequired'))
    }
    if (!validator.isString(Endtime)) {
        validationErrors.push(req.t('Patientactivities.Error.NameRequired'))
    }
    if (!validator.isArray(Participatedpatients)) {
        validationErrors.push(req.t('Patientactivities.Error.NameRequired'))
    }
    if (!validator.isArray(Participatedusers)) {
        validationErrors.push(req.t('Patientactivities.Error.NameRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patientactivities'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patientactivity = await db.patientactivityModel.findOne({ where: { Uuid: Uuid } })
        if (!patientactivity) {
            return next(createNotFoundError(req.t('Patientactivities.Error.NotFound'), req.t('Patientactivities'), req.language))
        }
        if (patientactivity.Isactive === false) {
            return next(createNotFoundError(req.t('Patientactivities.Error.NotActive'), req.t('Patientactivities'), req.language))
        }
        if (patientactivity.Isonpreview === false) {
            return next(createNotFoundError(req.t('Patientactivities.Error.NotOnPreview'), req.t('Patientactivities'), req.language))
        }
        if (patientactivity.Isapproved === true) {
            return next(createNotFoundError(req.t('Patientactivities.Error.Approved'), req.t('Patientactivities'), req.language))
        }
        if (patientactivity.Iscompleted === true) {
            return next(createNotFoundError(req.t('Patientactivities.Error.Completed'), req.t('Patientactivities'), req.language))
        }

        await db.patientactivityModel.update({
            ...req.body,
            Isonpreview: true,
            Isapproved: false,
            Iscompleted: false,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.patientactivityparticipatedpatientModel.destroy({ where: { ActivityID: Uuid }, transaction: t });
        await db.patientactivityparticipateduserModel.destroy({ where: { ActivityID: Uuid }, transaction: t });

        for (const patient of Participatedpatients) {

            if (!validator.isUUID(patient)) {
                return next(createValidationError(req.t('Patientactivities.Error.UnsupportedPatientID'), req.t('Patientactivities'), req.language))
            }

            const patientuuid = uuid()

            await db.patientactivityparticipatedpatientModel.create({
                Uuid: patientuuid,
                ActivityID: activityuuid,
                PatientID: patient || '',
                Createduser: username,
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
        }

        for (const user of Participatedusers) {

            if (!validator.isUUID(user)) {
                return next(createValidationError(req.t('Patientactivities.Error.UnsupportedUserID'), req.t('Patientactivities'), req.language))
            }

            const useruuid = uuid()

            await db.patientactivityparticipatedpatientModel.create({
                Uuid: useruuid,
                ActivityID: activityuuid,
                UserID: user || '',
                Createduser: username,
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
        }

        await CreateNotification({
            type: types.Update,
            service: req.t('Patientactivities'),
            role: 'patientactivitynotification',
            message: {
                tr: `${Name} Hasta Etkinliği ${username} tarafından Güncellendi.`,
                en: `${Name} Patient Activity Updated By ${username}`
            }[req.language],
            pushurl: '/Patientactivities'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetPatientactivities(req, res, next)
}

async function SavepreviewPatientactivity(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.activityId

    if (!Uuid) {
        validationErrors.push(req.t('Patientactivities.Error.PatientactivityIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patientactivities.Error.UnsupportedPatientactivityID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patientactivities'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patientactivity = await db.patientactivityModel.findOne({ where: { Uuid: Uuid } })
        if (!patientactivity) {
            return next(createNotFoundError(req.t('Patientactivities.Error.NotFound'), req.t('Patientactivities'), req.language))
        }
        if (patientactivity.Isactive === false) {
            return next(createNotFoundError(req.t('Patientactivities.Error.NotActive'), req.t('Patientactivities'), req.language))
        }
        if (patientactivity.Isonpreview === false) {
            return next(createNotFoundError(req.t('Patientactivities.Error.NotOnPreview'), req.t('Patientactivities'), req.language))
        }
        if (patientactivity.Isapproved === true) {
            return next(createNotFoundError(req.t('Patientactivities.Error.Approved'), req.t('Patientactivities'), req.language))
        }
        if (patientactivity.Iscompleted === true) {
            return next(createNotFoundError(req.t('Patientactivities.Error.Completed'), req.t('Patientactivities'), req.language))
        }

        await db.patientactivityModel.update({
            Isonpreview: true,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: Uuid }, transaction: t })


        await CreateNotification({
            type: types.Update,
            service: req.t('Patientactivities'),
            role: 'patientactivitynotification',
            message: {
                tr: `${patientactivity?.Name} Hasta Etkinliği ${username} tarafından Kayıt Edildi.`,
                en: `${patientactivity?.Name} Patient Activity Updated By ${username}`
            }[req.language],
            pushurl: '/Patientactivities'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPatientactivities(req, res, next)
}

async function ApprovePatientactivity(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.activityId

    if (!Uuid) {
        validationErrors.push(req.t('Patientactivities.Error.PatientactivityIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patientactivities.Error.UnsupportedPatientactivityID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patientactivities'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patientactivity = await db.patientactivityModel.findOne({ where: { Uuid: Uuid } })
        if (!patientactivity) {
            return next(createNotFoundError(req.t('Patientactivities.Error.NotFound'), req.t('Patientactivities'), req.language))
        }
        if (patientactivity.Isactive === false) {
            return next(createNotFoundError(req.t('Patientactivities.Error.NotActive'), req.t('Patientactivities'), req.language))
        }
        if (patientactivity.Isonpreview === true) {
            return next(createNotFoundError(req.t('Patientactivities.Error.OnPreview'), req.t('Patientactivities'), req.language))
        }
        if (patientactivity.Isapproved === true) {
            return next(createNotFoundError(req.t('Patientactivities.Error.Approved'), req.t('Patientactivities'), req.language))
        }
        if (patientactivity.Iscompleted === true) {
            return next(createNotFoundError(req.t('Patientactivities.Error.Completed'), req.t('Patientactivities'), req.language))
        }

        await db.patientactivityModel.update({
            Isapproved: true,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Patientactivities'),
            role: 'patientactivitynotification',
            message: {
                tr: `${patientactivity?.Name} Hasta Etkinliği ${username} tarafından Onaylandı.`,
                en: `${patientactivity?.Name} Patient Activity Approved By ${username}`
            }[req.language],
            pushurl: '/Patientactivities'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPatientactivities(req, res, next)
}

async function CompletePatientactivity(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.activityId

    if (!Uuid) {
        validationErrors.push(req.t('Patientactivities.Error.PatientactivityIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patientactivities.Error.UnsupportedPatientactivityID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patientactivities'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patientactivity = await db.patientactivityModel.findOne({ where: { Uuid: Uuid } })
        if (!patientactivity) {
            return next(createNotFoundError(req.t('Patientactivities.Error.NotFound'), req.t('Patientactivities'), req.language))
        }
        if (patientactivity.Isactive === false) {
            return next(createNotFoundError(req.t('Patientactivities.Error.NotActive'), req.t('Patientactivities'), req.language))
        }
        if (patientactivity.Isonpreview === true) {
            return next(createNotFoundError(req.t('Patientactivities.Error.OnPreview'), req.t('Patientactivities'), req.language))
        }
        if (patientactivity.Isapproved === false) {
            return next(createNotFoundError(req.t('Patientactivities.Error.Notapproved'), req.t('Patientactivities'), req.language))
        }
        if (patientactivity.Iscompleted === true) {
            return next(createNotFoundError(req.t('Patientactivities.Error.Completed'), req.t('Patientactivities'), req.language))
        }

        await db.patientactivityModel.update({
            Iscompleted: true,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Patientactivities'),
            role: 'patientactivitynotification',
            message: {
                tr: `${patientactivity?.Name} Hasta Etkinliği ${username} tarafından Tamamlandı.`,
                en: `${patientactivity?.Name} Patient Activity Completed By ${username}`
            }[req.language],
            pushurl: '/Patientactivities'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPatientactivities(req, res, next)
}

async function DeletePatientactivity(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.activityId

    if (!Uuid) {
        validationErrors.push(req.t('Patientactivities.Error.PatientactivityIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patientactivities.Error.UnsupportedPatientactivityID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patientactivities'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patientactivity = await db.patientactivityModel.findOne({ where: { Uuid: Uuid } })
        if (!patientactivity) {
            return next(createNotFoundError(req.t('Patientactivities.Error.NotFound'), req.t('Patientactivities'), req.language))
        }
        if (patientactivity.Isactive === false) {
            return next(createNotFoundError(req.t('Patientactivities.Error.NotActive'), req.t('Patientactivities'), req.language))
        }

        await db.patientactivityModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.patientactivityparticipatedpatientModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { ActivityID: Uuid }, transaction: t })

        await db.patientactivityparticipateduserModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { ActivityID: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Patientactivities'),
            role: 'patientactivitynotification',
            message: {
                tr: `${patientactivity?.Name} Hasta Etkinliği ${username} tarafından Silindi.`,
                en: `${patientactivity?.Name} Patient Activity Deleted By ${username}`
            }[req.language],
            pushurl: '/Patientactivities'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPatientactivities(req, res, next)
}

module.exports = {
    GetPatientactivities,
    GetPatientactivity,
    AddPatientactivity,
    UpdatePatientactivity,
    SavepreviewPatientactivity,
    ApprovePatientactivity,
    CompletePatientactivity,
    DeletePatientactivity
}