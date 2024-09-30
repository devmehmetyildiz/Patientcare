const config = require("../Config")
const { types } = require("../Constants/Defines")
const messages = require("../Constants/TrainingMessages")
const { trainingtypes } = require("../Constants/Trainingtypes")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')

async function GetTrainings(req, res, next) {
    try {
        let data = null
        const trainings = await db.trainingModel.findAll()
        for (const training of trainings) {
            training.Trainingusers = await db.trainingusersModel.findAll({
                where: {
                    TrainingID: training?.Uuid,
                },
            });
        }
        if (req?.Uuid) {
            data = await db.trainingModel.findOne({ where: { Uuid: req?.Uuid } });
        }
        res.status(200).json({ list: trainings, data: data })
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetTraining(req, res, next) {

    let validationErrors = []
    if (!req.params.trainingId) {
        validationErrors.push(messages.VALIDATION_ERROR.TRAININGID_REQUIRED)
    }
    if (!validator.isUUID(req.params.trainingId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_TRAININGID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const training = await db.trainingModel.findOne({ where: { Uuid: req.params.trainingId } });
        training.Trainingusers = await db.trainingusersModel.findAll({
            where: {
                TrainingID: training?.Uuid,
            },
        });
        res.status(200).json(training)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}


async function AddTraining(req, res, next) {

    let validationErrors = []
    const {
        Type,
        Name,
        Trainingdate,
        Companyname,
        Duration,
        Educator,
        EducatoruserID,
        Trainingusers
    } = req.body

    if (!validator.isNumber(Type)) {
        validationErrors.push(messages.VALIDATION_ERROR.TYPE_REQUIRED)
    }
    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isISODate(Trainingdate)) {
        validationErrors.push(messages.VALIDATION_ERROR.TRAININGDATE_REQUIRED)
    }
    if (!validator.isString(Duration)) {
        validationErrors.push(messages.VALIDATION_ERROR.DURATION_REQUIRED)
    }
    if (Type === trainingtypes.Company && !validator.isString(Educator)) {
        validationErrors.push(messages.VALIDATION_ERROR.EDUCATOR_REQUIRED)
    }
    if (Type === trainingtypes.Company && !validator.isString(Companyname)) {
        validationErrors.push(messages.VALIDATION_ERROR.COMPANYNAME_REQUIRED)
    }
    if (Type === trainingtypes.Organization && !validator.isUUID(EducatoruserID)) {
        validationErrors.push(messages.VALIDATION_ERROR.EDUCATORUSERID_REQUIRED)
    }
    if (Type === trainingtypes.Organization && !validator.isUUID(EducatoruserID)) {
        validationErrors.push(messages.VALIDATION_ERROR.EDUCATORUSERID_REQUIRED)
    }
    if (!validator.isArray(Trainingusers) || (Trainingusers || []).length <= 0) {
        validationErrors.push(messages.VALIDATION_ERROR.TRAININGUSERS_REQUIRED)
    } else {
        for (const user of Trainingusers) {
            if (!validator.isUUID(user)) {
                validationErrors.push(messages.VALIDATION_ERROR.USERID_REQUIRED)
            }
        }
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let traininguuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.trainingModel.create({
            ...req.body,
            Uuid: traininguuid,
            Isonpreview: true,
            Isapproved: false,
            Iscompleted: false,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        for (const user of Trainingusers) {
            await db.trainingusersModel.create({
                Uuid: uuid(),
                TrainingID: traininguuid,
                UserID: user,
                Iscompleted: false,
                Createduser: username,
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
        }

        await CreateNotification({
            type: types.Create,
            service: 'Eğitimler',
            role: 'trainingnotification',
            message: `${Name} isimli eğitim  ${username} tarafından Taslak Olarak Oluşturuldu.`,
            pushurl: '/Trainings'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    req.Uuid = traininguuid
    GetTrainings(req, res, next)
}

async function UpdateTraining(req, res, next) {

    let validationErrors = []
    const {
        Uuid,
        Type,
        Name,
        Trainingdate,
        Place,
        Companyname,
        Duration,
        Educator,
        EducatoruserID,
        Trainingusers
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.TRAININGID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_TRAININGID)
    }
    if (!validator.isNumber(Type)) {
        validationErrors.push(messages.VALIDATION_ERROR.TYPE_REQUIRED)
    }
    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isISODate(Trainingdate)) {
        validationErrors.push(messages.VALIDATION_ERROR.TRAININGDATE_REQUIRED)
    }
    if (!validator.isString(Duration)) {
        validationErrors.push(messages.VALIDATION_ERROR.DURATION_REQUIRED)
    }
    if (Type === trainingtypes.Company && !validator.isString(Educator)) {
        validationErrors.push(messages.VALIDATION_ERROR.EDUCATOR_REQUIRED)
    }
    if (Type === trainingtypes.Company && !validator.isString(Companyname)) {
        validationErrors.push(messages.VALIDATION_ERROR.COMPANYNAME_REQUIRED)
    }
    if (Type === trainingtypes.Organization && !validator.isUUID(EducatoruserID)) {
        validationErrors.push(messages.VALIDATION_ERROR.EDUCATORUSERID_REQUIRED)
    }
    if (Type === trainingtypes.Organization && !validator.isUUID(EducatoruserID)) {
        validationErrors.push(messages.VALIDATION_ERROR.EDUCATORUSERID_REQUIRED)
    }
    if (!validator.isArray(Trainingusers) || (Trainingusers || []).length <= 0) {
        validationErrors.push(messages.VALIDATION_ERROR.TRAININGUSERS_REQUIRED)
    } else {
        for (const user of Trainingusers) {
            if (!validator.isUUID(user)) {
                validationErrors.push(messages.VALIDATION_ERROR.USERID_REQUIRED)
            }
        }
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const training = await db.trainingModel.findOne({ where: { Uuid: Uuid } })
        if (!training) {
            return next(createNotfounderror([messages.ERROR.TRAINING_NOT_FOUND], req.language))
        }
        if (training.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.TRAINING_NOT_ACTIVE], req.language))
        }

        await db.trainingModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.trainingusersModel.destroy({ where: { TrainingID: Uuid }, transaction: t });

        for (const user of Trainingusers) {
            await db.trainingusersModel.create({
                Uuid: uuid(),
                TrainingID: Uuid,
                UserID: user,
                Iscompleted: false,
                Createduser: username,
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
        }

        await CreateNotification({
            type: types.Update,
            service: 'Eğitimler',
            role: 'trainingnotification',
            message: `${Name} isimli Eğitim ${username} tarafından Güncellendi.`,
            pushurl: '/Trainings'
        })
        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    req.Uuid = Uuid
    GetTrainings(req, res, next)

}

async function DeleteTraining(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.trainingId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.TRAININGID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_TRAININGID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const training = await db.trainingModel.findOne({ where: { Uuid: Uuid } })
        if (!training) {
            return next(createNotfounderror([messages.ERROR.TRAINING_NOT_FOUND], req.language))
        }
        if (training.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.TRAINING_NOT_ACTIVE], req.language))
        }

        await db.trainingModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.trainingusersModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { TrainingID: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: 'Eğitimler',
            role: 'trainingnotification',
            message: `${training?.Name} isimli Eğitim  ${username} tarafından Silindi.`,
            pushurl: '/Trainings'
        })
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    req.Uuid = Uuid
    GetTrainings(req, res, next)
}

async function SavepreviewTraining(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.trainingId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.TRAININGID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_TRAININGID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const training = await db.trainingModel.findOne({ where: { Uuid: Uuid } })
        if (!training) {
            return next(createNotfounderror([messages.ERROR.TRAINING_NOT_FOUND], req.language))
        }
        if (training.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.TRAINING_NOT_ACTIVE], req.language))
        }

        await db.trainingModel.update({
            Isonpreview: false,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Eğitimler',
            role: 'trainingnotification',
            message: `${training?.Name} isimli Eğitim  ${username} tarafından Kayıt Edildi.`,
            pushurl: '/Trainings'
        })
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    req.Uuid = Uuid
    GetTrainings(req, res, next)
}

async function ApproveTraining(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.trainingId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.TRAININGID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_TRAININGID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const training = await db.trainingModel.findOne({ where: { Uuid: Uuid } })
        if (!training) {
            return next(createNotfounderror([messages.ERROR.TRAINING_NOT_FOUND], req.language))
        }
        if (training.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.TRAINING_NOT_ACTIVE], req.language))
        }

        await db.trainingModel.update({
            Isapproved: true,
            Approveduser: username,
            Updateduser: username,
            Approvetime: new Date(),
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Eğitimler',
            role: 'trainingnotification',
            message: `${training?.Name} isimli Eğitim  ${username} tarafından Onaylandı.`,
            pushurl: '/Trainings'
        })
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    req.Uuid = Uuid
    GetTrainings(req, res, next)
}

async function CompleteTraininguser(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.traininguserId
    console.log('Uuid: ', Uuid);

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.TRAININGUSERID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_TRAININGUSERID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const traininguser = await db.trainingusersModel.findOne({ where: { Uuid: Uuid } })
        console.log('traininguser: ', traininguser);
        if (!traininguser) {
            return next(createNotfounderror([messages.ERROR.TRAININGUSER_NOT_FOUND], req.language))
        }
        if (traininguser.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.TRAININGUSER_NOT_ACTIVE], req.language))
        }

        await db.trainingusersModel.update({
            Iscompleted: true,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        const training = await db.trainingModel.findOne({ where: { Uuid: traininguser?.TrainingID || '' } });

        await CreateNotification({
            type: types.Update,
            service: 'Eğitimler',
            role: 'trainingnotification',
            message: `${training?.Name} isimli Eğitim  ${username} tarafından Katıldı Olarak Tamamlandı.`,
            pushurl: '/Trainings'
        })
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetTrainings(req, res, next)
}

async function CompleteTraining(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.trainingId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.TRAININGID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_TRAININGID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const training = await db.trainingModel.findOne({ where: { Uuid: Uuid } })
        if (!training) {
            return next(createNotfounderror([messages.ERROR.TRAINING_NOT_FOUND], req.language))
        }
        if (training.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.TRAINING_NOT_ACTIVE], req.language))
        }

        await db.trainingModel.update({
            Iscompleted: true,
            Completeduser: username,
            Completedtime: new Date(),
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Eğitimler',
            role: 'trainingnotification',
            message: `${training?.Name} isimli Eğitim  ${username} tarafından Tamamlandı.`,
            pushurl: '/Trainings'
        })
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    req.Uuid = Uuid
    GetTrainings(req, res, next)
}

module.exports = {
    GetTrainings,
    GetTraining,
    AddTraining,
    UpdateTraining,
    DeleteTraining,
    SavepreviewTraining,
    ApproveTraining,
    CompleteTraining,
    CompleteTraininguser
}