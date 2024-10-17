const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetCareplans(req, res, next) {
    try {
        const careplans = await db.careplanModel.findAll()
        for (const careplan of careplans) {
            careplan.Careplanservices = await db.careplanserviceModel.findAll({ where: { CareplanID: careplan?.Uuid, Isactive: true } })
        }
        res.status(200).json(careplans)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetCareplan(req, res, next) {

    let validationErrors = []
    if (!req.params.careplanId) {
        validationErrors.push(req.t('Careplans.Error.CareplanIDRequired'))
    }
    if (!validator.isUUID(req.params.careplanId)) {
        validationErrors.push(req.t('Careplans.Error.UnsupportedCareplanID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Careplans'), req.language))
    }

    try {
        const careplan = await db.careplanModel.findOne({ where: { Uuid: req.params.careplanId } });
        careplan.Careplanservices = await db.careplanserviceModel.findAll({ where: { CareplanID: careplan?.Uuid, Isactive: true } })
        res.status(200).json(careplan)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}


async function AddCareplan(req, res, next) {

    let validationErrors = []
    const {
        Type,
        Startdate,
        Enddate,
        PatientID,
        Createdate,
        Careplanservices
    } = req.body

    if (!validator.isNumber(Type)) {
        validationErrors.push(req.t('Careplans.Error.TypeRequired'))
    }
    if (!validator.isISODate(Startdate)) {
        validationErrors.push(req.t('Careplans.Error.StartdateRequired'))
    }
    if (!validator.isISODate(Enddate)) {
        validationErrors.push(req.t('Careplans.Error.EnddateRequired'))
    }
    if (!validator.isString(PatientID)) {
        validationErrors.push(req.t('Careplans.Error.PatientIDRequired'))
    }
    if (!validator.isISODate(Createdate)) {
        validationErrors.push(req.t('Careplans.Error.CreatedateRequired'))
    }
    if (!validator.isArray(Careplanservices)) {
        validationErrors.push(req.t('Careplans.Error.CareplanservicesRequired'))
    } else {
        for (const careplanservice of Careplanservices) {
            if (!validator.isUUID(careplanservice?.SupportplanID)) {
                validationErrors.push(req.t('Careplans.Error.SupportplanIDRequired'))
            }
        }
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Careplans'), req.language))
    }

    let careplanuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.careplanModel.create({
            ...req.body,
            Uuid: careplanuuid,
            Isonpreview: true,
            Isapproved: false,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        for (const careplanservice of Careplanservices) {

            let careplanserviceuuid = uuid()

            await db.careplanserviceModel.create({
                ...careplanservice,
                Uuid: careplanserviceuuid,
                CareplanID: careplanuuid,
                Createduser: username,
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
        }

        await CreateNotification({
            type: types.Create,
            service: req.t('Careplans'),
            role: 'careplannotification',
            message: {
                tr: `${Createdate} Tarihli Bakım Planı ${username} tarafından Oluşturuldu.`,
                en: `${Createdate} Dated Care Plan Created By ${username}`
            }[req.language],
            pushurl: '/Careplans'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetCareplans(req, res, next)
}

async function UpdateCareplan(req, res, next) {

    let validationErrors = []
    const {
        Type,
        Startdate,
        Enddate,
        PatientID,
        Createdate,
        Careplanservices,
        Uuid
    } = req.body

    if (!validator.isNumber(Type)) {
        validationErrors.push(req.t('Careplans.Error.TypeRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Careplans.Error.CareplanIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Careplans.Error.UnsupportedCareplanID'))
    }
    if (!validator.isISODate(Startdate)) {
        validationErrors.push(req.t('Careplans.Error.StartdateRequired'))
    }
    if (!validator.isISODate(Enddate)) {
        validationErrors.push(req.t('Careplans.Error.EnddateRequired'))
    }
    if (!validator.isString(PatientID)) {
        validationErrors.push(req.t('Careplans.Error.PatientIDRequired'))
    }
    if (!validator.isISODate(Createdate)) {
        validationErrors.push(req.t('Careplans.Error.CreatedateRequired'))
    }
    if (!validator.isArray(Careplanservices)) {
        validationErrors.push(req.t('Careplans.Error.CareplanservicesRequired'))
    } else {
        for (const careplanservice of Careplanservices) {
            if (!careplanservice?.Uuid) {
                validationErrors.push(req.t('Careplans.Error.SupportplanIDRequired'))
            }
        }
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Careplans'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const careplan = await db.careplanModel.findOne({ where: { Uuid: Uuid } })
        if (!careplan) {
            return next(createNotFoundError(req.t('Careplans.Error.NotFound'), req.t('Careplans'), req.language))
        }
        if (careplan.Isactive === false) {
            return next(createNotFoundError(req.t('Careplans.Error.NotActive'), req.t('Careplans'), req.language))
        }

        await db.careplanModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        for (const careplanservice of Careplanservices) {
            await db.careplanserviceModel.update({
                ...careplanservice,
                Updateduser: username,
                Updatetime: new Date(),
            }, { where: { Uuid: careplanservice?.Uuid }, transaction: t })
        }

        await CreateNotification({
            type: types.Update,
            service: req.t('Careplans'),
            role: 'careplannotification',
            message: {
                tr: `${Createdate} Tarihli Bakım Planı ${username} tarafından Güncellendi.`,
                en: `${Createdate} Dated Care Plan Updated By ${username}`
            }[req.language],
            pushurl: '/Careplans'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetCareplans(req, res, next)

}

async function SavepreviewCareplan(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.careplanId

    if (!Uuid) {
        validationErrors.push(req.t('Careplans.Error.CareplanIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Careplans.Error.UnsupportedCareplanID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Careplans'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const careplan = await db.careplanModel.findOne({ where: { Uuid: Uuid } })
        if (!careplan) {
            return next(createNotFoundError(req.t('Careplans.Error.NotFound'), req.t('Careplans'), req.language))
        }
        if (careplan.Isactive === false) {
            return next(createNotFoundError(req.t('Careplans.Error.NotActive'), req.t('Careplans'), req.language))
        }
        if (careplan.Needapprove === false) {
            return next(createNotFoundError(req.t('Careplans.Error.Approved'), req.t('Careplans'), req.language))
        }

        await db.careplanModel.update({
            ...careplan,
            Isonpreview: false,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Careplans'),
            role: 'careplannotification',
            message: {
                tr: `${careplan?.Createdate} Tarihli Bakım Planı ${username} tarafından Kayıt Edildi.`,
                en: `${careplan?.Createdate} Dated Care Plan Saved By ${username}`
            }[req.language],
            pushurl: '/Careplans'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetCareplans(req, res, next)
}

async function ApproveCareplan(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.careplanId

    if (!Uuid) {
        validationErrors.push(req.t('Careplans.Error.CareplanIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Careplans.Error.UnsupportedCareplanID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Careplans'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const careplan = await db.careplanModel.findOne({ where: { Uuid: Uuid } })
        if (!careplan) {
            return next(createNotFoundError(req.t('Careplans.Error.NotFound'), req.t('Careplans'), req.language))
        }
        if (careplan.Isactive === false) {
            return next(createNotFoundError(req.t('Careplans.Error.NotActive'), req.t('Careplans'), req.language))
        }
        if (careplan.Needapprove === false) {
            return next(createNotFoundError(req.t('Careplans.Error.Approved'), req.t('Careplans'), req.language))
        }

        await db.careplanModel.update({
            ...careplan,
            Isapproved: true,
            Approveduser: username,
            Updateduser: username,
            Approvetime: new Date(),
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })


        await CreateNotification({
            type: types.Update,
            service: req.t('Careplans'),
            role: 'careplannotification',
            message: {
                tr: `${careplan?.Createdate} Tarihli Bakım Planı ${username} tarafından Onaylandı.`,
                en: `${careplan?.Createdate} Dated Care Plan Approved By ${username}`
            }[req.language],
            pushurl: '/Careplans'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetCareplans(req, res, next)
}


async function DeleteCareplan(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.careplanId

    if (!Uuid) {
        validationErrors.push(req.t('Careplans.Error.CareplanIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Careplans.Error.UnsupportedCareplanID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Careplans'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const careplan = await db.careplanModel.findOne({ where: { Uuid: Uuid } })
        if (!careplan) {
            return next(createNotFoundError(req.t('Careplans.Error.NotFound'), req.t('Careplans'), req.language))
        }
        if (careplan.Isactive === false) {
            return next(createNotFoundError(req.t('Careplans.Error.NotActive'), req.t('Careplans'), req.language))
        }

        await db.careplanModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.careplanserviceModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { CareplanID: Uuid }, transaction: t })


        await CreateNotification({
            type: types.Delete,
            service: req.t('Careplans'),
            role: 'careplannotification',
            message: {
                tr: `${careplan?.Createdate} Tarihli Bakım Planı ${username} tarafından Silindi.`,
                en: `${careplan?.Createdate} Dated Care Plan Deleted By ${username}`
            }[req.language],
            pushurl: '/Careplans'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetCareplans(req, res, next)
}

module.exports = {
    GetCareplans,
    GetCareplan,
    AddCareplan,
    ApproveCareplan,
    UpdateCareplan,
    DeleteCareplan,
    SavepreviewCareplan
}