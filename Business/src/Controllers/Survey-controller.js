const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetSurveys(req, res, next) {
    try {
        const survey = await db.surveyModel.findAll()
        res.status(200).json(survey)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetSurvey(req, res, next) {

    let validationErrors = []
    if (!req.params.surveyId) {
        validationErrors.push(req.t('Surveys.Error.SurveyIDRequired'))
    }
    if (!validator.isUUID(req.params.surveyId)) {
        validationErrors.push(req.t('Surveys.Error.UnsupportedSurveyID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Surveys'), req.language))
    }

    try {
        const survey = await db.surveyModel.findOne({ where: { Uuid: req.params.surveyId } });
        res.status(200).json(survey)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddSurvey(req, res, next) {

    let validationErrors = []
    const {
        Type,
        Name,
        PrepareduserID,
        Minnumber,
        Maxnumber,
        Surveydetails,
    } = req.body

    if (!validator.isNumber(Type)) {
        validationErrors.push(req.t('Surveys.Error.TypeRequired'))
    }
    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Surveys.Error.NameRequired'))
    }
    if (!validator.isUUID(PrepareduserID)) {
        validationErrors.push(req.t('Surveys.Error.PrepareduserIDRequired'))
    }
    if (!validator.isNumber(Minnumber)) {
        validationErrors.push(req.t('Surveys.Error.MinnumberRequired'))
    }
    if (!validator.isNumber(Maxnumber)) {
        validationErrors.push(req.t('Surveys.Error.MaxnumberRequired'))
    }
    if (validator.isNumber(Minnumber) && validator.isNumber(Maxnumber)) {
        if (Minnumber >= Maxnumber) {
            validationErrors.push(req.t('Surveys.Error.MaxnumberShouldBigger'))
        }
    }
    if (!validator.isArray(Surveydetails)) {
        validationErrors.push(req.t('Surveys.Error.SurveydetailsRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Surveys'), req.language))
    }

    let surveyuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.surveyModel.create({
            ...req.body,
            Uuid: surveyuuid,
            Isonpreview: true,
            Isapproved: false,
            Iscompleted: false,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        for (const surveydetail of Surveydetails) {

            if (!validator.isArray(surveydetail?.Question)) {
                validationErrors.push(req.t('Surveys.Error.SurveydetailsRequired'))
            }

            const detailuuid = uuid()

            await db.surveydetailModel.create({
                Uuid: detailuuid,
                Order: surveydetail?.Order || 0,
                SurveyID: surveyuuid,
                Question: surveydetail?.Question || '',
                Createduser: username,
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
        }

        await CreateNotification({
            type: types.Create,
            service: req.t('Surveys'),
            role: 'surveynotification',
            message: {
                tr: `${Name} Anketi ${username} tarafından Oluşturuldu.`,
                en: `${Name} Survey Created By ${username}`
            }[req.language],
            pushurl: '/Surveys'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetSurveys(req, res, next)
}

async function UpdateSurvey(req, res, next) {

    let validationErrors = []
    const {
        Uuid,
        Type,
        Name,
        PrepareduserID,
        Minnumber,
        Maxnumber,
        Surveydetails,
    } = req.body

    if (!Uuid) {
        validationErrors.push(req.t('Surveys.Error.SurveyIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Surveys.Error.UnsupportedSurveyID'))
    }
    if (!validator.isNumber(Type)) {
        validationErrors.push(req.t('Surveys.Error.TypeRequired'))
    }
    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Surveys.Error.NameRequired'))
    }
    if (!validator.isUUID(PrepareduserID)) {
        validationErrors.push(req.t('Surveys.Error.PrepareduserIDRequired'))
    }
    if (!validator.isNumber(Minnumber)) {
        validationErrors.push(req.t('Surveys.Error.MinnumberRequired'))
    }
    if (!validator.isNumber(Maxnumber)) {
        validationErrors.push(req.t('Surveys.Error.MaxnumberRequired'))
    }
    if (validator.isNumber(Minnumber) && validator.isNumber(Maxnumber)) {
        if (Minnumber >= Maxnumber) {
            validationErrors.push(req.t('Surveys.Error.MaxnumberShouldBigger'))
        }
    }
    if (!validator.isArray(Surveydetails)) {
        validationErrors.push(req.t('Surveys.Error.SurveydetailsRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Surveys'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const survey = await db.surveyModel.findOne({ where: { Uuid: Uuid } })
        if (!survey) {
            return next(createNotFoundError(req.t('Surveys.Error.NotFound'), req.t('Surveys'), req.language))
        }
        if (survey.Isactive === false) {
            return next(createNotFoundError(req.t('Surveys.Error.NotActive'), req.t('Surveys'), req.language))
        }
        if (survey.Isonpreview === false) {
            return next(createNotFoundError(req.t('Surveys.Error.NotOnPreview'), req.t('Surveys'), req.language))
        }
        if (survey.Isapproved === true) {
            return next(createNotFoundError(req.t('Surveys.Error.Approved'), req.t('Surveys'), req.language))
        }
        if (survey.Iscompleted === true) {
            return next(createNotFoundError(req.t('Surveys.Error.Completed'), req.t('Surveys'), req.language))
        }

        await db.surveyModel.update({
            ...req.body,
            Uuid: Uuid,
            Isonpreview: true,
            Isapproved: false,
            Iscompleted: false,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.surveydetailModel.destroy({ where: { SurveyID: Uuid }, transaction: t });

        for (const surveydetail of Surveydetails) {

            if (!validator.isArray(surveydetail?.Question)) {
                validationErrors.push(req.t('Surveys.Error.SurveydetailsRequired'))
            }

            const detailuuid = uuid()

            await db.surveydetailModel.create({
                Uuid: detailuuid,
                Order: surveydetail?.Order || 0,
                SurveyID: surveyuuid,
                Question: surveydetail?.Question || '',
                Createduser: username,
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
        }

        await CreateNotification({
            type: types.Update,
            service: req.t('Surveys'),
            role: 'surveynotification',
            message: {
                tr: `${Name} Anketi ${username} tarafından Güncellendi.`,
                en: `${Name} Survey Updated By ${username}`
            }[req.language],
            pushurl: '/Surveys'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetSurveys(req, res, next)
}

async function SavepreviewSurvey(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.surveyId

    if (!Uuid) {
        validationErrors.push(req.t('Surveys.Error.SurveyIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Surveys.Error.UnsupportedSurveyID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Surveys'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const survey = await db.surveyModel.findOne({ where: { Uuid: Uuid } })
        if (!survey) {
            return next(createNotFoundError(req.t('Surveys.Error.NotFound'), req.t('Surveys'), req.language))
        }
        if (survey.Isactive === false) {
            return next(createNotFoundError(req.t('Surveys.Error.NotActive'), req.t('Surveys'), req.language))
        }
        if (survey.Isonpreview === false) {
            return next(createNotFoundError(req.t('Surveys.Error.NotOnPreview'), req.t('Surveys'), req.language))
        }
        if (survey.Isapproved === true) {
            return next(createNotFoundError(req.t('Surveys.Error.Approved'), req.t('Surveys'), req.language))
        }
        if (survey.Iscompleted === true) {
            return next(createNotFoundError(req.t('Surveys.Error.Completed'), req.t('Surveys'), req.language))
        }

        await db.surveyModel.update({
            Isonpreview: true,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: Uuid }, transaction: t })


        await CreateNotification({
            type: types.Update,
            service: req.t('Surveys'),
            role: 'surveynotification',
            message: {
                tr: `${survey?.Name} Anketi ${username} tarafından Kayıt Edildi.`,
                en: `${survey?.Name} Survey Saved By ${username}`
            }[req.language],
            pushurl: '/Surveys'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetSurveys(req, res, next)
}

async function ApproveSurvey(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.surveyId

    if (!Uuid) {
        validationErrors.push(req.t('Surveys.Error.SurveyIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Surveys.Error.UnsupportedSurveyID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Surveys'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const survey = await db.surveyModel.findOne({ where: { Uuid: Uuid } })
        if (!survey) {
            return next(createNotFoundError(req.t('Surveys.Error.NotFound'), req.t('Surveys'), req.language))
        }
        if (survey.Isactive === false) {
            return next(createNotFoundError(req.t('Surveys.Error.NotActive'), req.t('Surveys'), req.language))
        }
        if (survey.Isonpreview === true) {
            return next(createNotFoundError(req.t('Surveys.Error.OnPreview'), req.t('Surveys'), req.language))
        }
        if (survey.Isapproved === true) {
            return next(createNotFoundError(req.t('Surveys.Error.Approved'), req.t('Surveys'), req.language))
        }
        if (survey.Iscompleted === true) {
            return next(createNotFoundError(req.t('Surveys.Error.Completed'), req.t('Surveys'), req.language))
        }

        await db.surveyModel.update({
            Isapproved: true,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Surveys'),
            role: 'surveynotification',
            message: {
                tr: `${survey?.Name} Anketi ${username} tarafından Onaylandı.`,
                en: `${survey?.Name} Survey Approved By ${username}`
            }[req.language],
            pushurl: '/Surveys'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetSurveys(req, res, next)
}

async function CleanSurvey(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.surveyId

    if (!Uuid) {
        validationErrors.push(req.t('Surveys.Error.SurveyIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Surveys.Error.UnsupportedSurveyID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Surveys'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const survey = await db.surveyModel.findOne({ where: { Uuid: Uuid } })
        if (!survey) {
            return next(createNotFoundError(req.t('Surveys.Error.NotFound'), req.t('Surveys'), req.language))
        }
        if (survey.Isactive === false) {
            return next(createNotFoundError(req.t('Surveys.Error.NotActive'), req.t('Surveys'), req.language))
        }
        if (survey.Isonpreview === true) {
            return next(createNotFoundError(req.t('Surveys.Error.OnPreview'), req.t('Surveys'), req.language))
        }
        if (survey.Isapproved === false) {
            return next(createNotFoundError(req.t('Surveys.Error.NotApproved'), req.t('Surveys'), req.language))
        }
        if (survey.Iscompleted === true) {
            return next(createNotFoundError(req.t('Surveys.Error.Completed'), req.t('Surveys'), req.language))
        }

        await db.surveyresultModel.destroy({ where: { SurveyID: Uuid }, transaction: t });

        await db.surveyModel.update({
            Completedusercount: 0,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Surveys'),
            role: 'surveynotification',
            message: {
                tr: `${survey?.Name} Anketi ${username} tarafından Temizlendi.`,
                en: `${survey?.Name} Survey Cleaned By ${username}`
            }[req.language],
            pushurl: '/Surveys'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetSurveys(req, res, next)
}

async function CompleteSurvey(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.surveyId

    if (!Uuid) {
        validationErrors.push(req.t('Surveys.Error.SurveyIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Surveys.Error.UnsupportedSurveyID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Surveys'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const survey = await db.surveyModel.findOne({ where: { Uuid: Uuid } })
        if (!survey) {
            return next(createNotFoundError(req.t('Surveys.Error.NotFound'), req.t('Surveys'), req.language))
        }
        if (survey.Isactive === false) {
            return next(createNotFoundError(req.t('Surveys.Error.NotActive'), req.t('Surveys'), req.language))
        }
        if (survey.Isonpreview === true) {
            return next(createNotFoundError(req.t('Surveys.Error.OnPreview'), req.t('Surveys'), req.language))
        }
        if (survey.Isapproved === false) {
            return next(createNotFoundError(req.t('Surveys.Error.NotApproved'), req.t('Surveys'), req.language))
        }
        if (survey.Iscompleted === true) {
            return next(createNotFoundError(req.t('Surveys.Error.Completed'), req.t('Surveys'), req.language))
        }

        await db.surveyModel.update({
            Isapproved: true,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Surveys'),
            role: 'surveynotification',
            message: {
                tr: `${survey?.Name} Anketi ${username} tarafından Onaylandı.`,
                en: `${survey?.Name} Survey Approved By ${username}`
            }[req.language],
            pushurl: '/Surveys'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetSurveys(req, res, next)
}

async function FillSurvey(req, res, next) {

    const Answers = req.body

    if (!validator.isArray(Answers)) {
        return next(createValidationError(req.t('Surveys.Error.AnswersRequired'), req.t('Surveys'), req.language))
    }
    if (!(Answers.length > 0)) {
        return next(createValidationError(req.t('Surveys.Error.AnswersRequired'), req.t('Surveys'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        for (const answer of Answers) {
            let validationErrors = []

            const {
                SurveyID,
                SurveydetailID,
                Answer,
            } = answer

            if (!validator.isUUID(SurveyID)) {
                validationErrors.push(req.t('Surveys.Error.SurveyIDRequired'))
            }
            if (!validator.isUUID(SurveydetailID)) {
                validationErrors.push(req.t('Surveys.Error.SurveydetailIDRequired'))
            }
            if (!validator.isNumber(Answer)) {
                validationErrors.push(req.t('Surveys.Error.AnswerRequired'))
            }

            if (validationErrors.length > 0) {
                return next(createValidationError(validationErrors, req.t('Surveys'), req.language))
            }

            const survey = await db.surveyModel.findOne({ where: { Uuid: SurveyID } })
            if (!survey) {
                return next(createNotFoundError(req.t('Surveys.Error.NotFound'), req.t('Surveys'), req.language))
            }
            if (survey.Isactive === false) {
                return next(createNotFoundError(req.t('Surveys.Error.NotActive'), req.t('Surveys'), req.language))
            }
            if (survey.Isonpreview === true) {
                return next(createNotFoundError(req.t('Surveys.Error.OnPreview'), req.t('Surveys'), req.language))
            }
            if (survey.Isapproved === false) {
                return next(createNotFoundError(req.t('Surveys.Error.NotApproved'), req.t('Surveys'), req.language))
            }
            if (survey.Iscompleted === true) {
                return next(createNotFoundError(req.t('Surveys.Error.Completed'), req.t('Surveys'), req.language))
            }

            await db.surveyModel.update({
                Completedusercount: (survey?.Completedusercount || 0) + 1,
                Updateduser: username,
                Updatetime: new Date(),
                Isactive: true
            }, { where: { Uuid: SurveyID }, transaction: t })


            await db.surveyresultModel.create({
                ...answer,
                Uuid: uuid(),
                Createduser: username,
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
        }

        await CreateNotification({
            type: types.Update,
            service: req.t('Surveys'),
            role: 'surveynotification',
            message: {
                tr: `Anket ${username} tarafından Dolduruldu.`,
                en: `Survey Filled By ${username}`
            }[req.language],
            pushurl: '/Surveys'
        })
        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetSurveys(req, res, next)
}

async function RemoveSurveyanswer(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.surveyresultId

    if (!Uuid) {
        validationErrors.push(req.t('Surveys.Error.SurveyresultIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Surveys.Error.UnsupportedSurveyresultID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Surveys'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const surveyresult = await db.surveyresultModel.findOne({ where: { Uuid: Uuid } })
        if (!surveyresult) {
            return next(createNotFoundError(req.t('Surveys.Error.ResultNotFound'), req.t('Surveys'), req.language))
        }
        if (surveyresult.Isactive === false) {
            return next(createNotFoundError(req.t('Surveys.Error.ResultNotActive'), req.t('Surveys'), req.language))
        }

        const survey = await db.surveyModel.findOne({ where: { Uuid: surveyresult?.SurveyID || '' } })
        if (!survey) {
            return next(createNotFoundError(req.t('Surveys.Error.NotFound'), req.t('Surveys'), req.language))
        }
        if (survey.Isactive === false) {
            return next(createNotFoundError(req.t('Surveys.Error.NotActive'), req.t('Surveys'), req.language))
        }
        if (survey.Isonpreview === false) {
            return next(createNotFoundError(req.t('Surveys.Error.OnPreview'), req.t('Surveys'), req.language))
        }
        if (survey.Isapproved === false) {
            return next(createNotFoundError(req.t('Surveys.Error.NotApproved'), req.t('Surveys'), req.language))
        }
        if (survey.Iscompleted === true) {
            return next(createNotFoundError(req.t('Surveys.Error.Completed'), req.t('Surveys'), req.language))
        }

        await db.surveyModel.update({
            Completedusercount: (survey?.Completedusercount || 0) - 1,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: surveyresult?.SurveyID || '' }, transaction: t })

        await db.surveyresultModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: true
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Surveys'),
            role: 'surveynotification',
            message: {
                tr: `${survey?.Name} Anketine ait Cevap ${username} tarafından Silindi.`,
                en: `${survey?.Name} Survey Result Deleted By ${username}`
            }[req.language],
            pushurl: '/Surveys'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetSurveys(req, res, next)
}

async function DeleteSurvey(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.surveyId

    if (!Uuid) {
        validationErrors.push(req.t('Surveys.Error.SurveyIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Surveys.Error.UnsupportedSurveyID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Surveys'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const survey = await db.surveyModel.findOne({ where: { Uuid: Uuid } })
        if (!survey) {
            return next(createNotFoundError(req.t('Surveys.Error.NotFound'), req.t('Surveys'), req.language))
        }
        if (survey.Isactive === false) {
            return next(createNotFoundError(req.t('Surveys.Error.NotActive'), req.t('Surveys'), req.language))
        }
        if (survey.Iscompleted === true) {
            return next(createNotFoundError(req.t('Surveys.Error.Completed'), req.t('Surveys'), req.language))
        }

        await db.surveyModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.surveydetailModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { SurveyID: Uuid }, transaction: t })

        await db.surveyresultModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { SurveyID: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Surveys'),
            role: 'surveynotification',
            message: {
                tr: `${survey?.Name} Anketi ${username} tarafından Silindi.`,
                en: `${survey?.Name} Survey Deleted By ${username}`
            }[req.language],
            pushurl: '/Surveys'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetSurveys(req, res, next)
}

module.exports = {
    GetSurveys,
    GetSurvey,
    AddSurvey,
    UpdateSurvey,
    SavepreviewSurvey,
    ApproveSurvey,
    CompleteSurvey,
    FillSurvey,
    RemoveSurveyanswer,
    CleanSurvey,
    DeleteSurvey
}