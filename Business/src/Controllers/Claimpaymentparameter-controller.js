const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const { claimpaymenttypes } = require('../Constants/Claimpaymenttypes')

async function GetClaimpaymentparameters(req, res, next) {
    try {
        const claimpaymentparameters = await db.claimpaymentparameterModel.findAll()
        res.status(200).json(claimpaymentparameters)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetClaimpaymentparameter(req, res, next) {

    let validationErrors = []
    if (!req.params.claimpaymentparameterId) {
        validationErrors.push(req.t('Claimpaymentparameters.Error.ClaimpaymentparameterIDRequired'))
    }
    if (!validator.isUUID(req.params.claimpaymentparameterId)) {
        validationErrors.push(req.t('Claimpaymentparameters.Error.UnsupportedClaimpaymentparameterID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Claimpaymentparameters'), req.language))
    }

    try {
        const claimpaymentparameter = await db.claimpaymentparameterModel.findOne({ where: { Uuid: req.params.claimpaymentparameterId } });
        res.status(200).json(claimpaymentparameter)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddClaimpaymentparameter(req, res, next) {

    let validationErrors = []
    const {
        Type,
        CostumertypeID,
        Patientclaimpaymentperpayment,
        Perpaymentkdvpercent,
        Perpaymentkdvwithholdingpercent
    } = req.body

    if (!validator.isNumber(Type)) {
        validationErrors.push(req.t('Claimpaymentparameters.Error.TypeRequired'))
    }
    if (Type !== claimpaymenttypes.Personel) {
        if (!validator.isUUID(CostumertypeID)) {
            validationErrors.push(req.t('Claimpaymentparameters.Error.CostumertypeIDRequired'))
        }
    }
    if (!validator.isUUID(CostumertypeID)) {
        validationErrors.push(req.t('Claimpaymentparameters.Error.CostumertypeIDRequired'))
    }
    if (!validator.isNumber(Patientclaimpaymentperpayment)) {
        validationErrors.push(req.t('Claimpaymentparameters.Error.PatientclaimpaymentperpaymentRequired'))
    }
    if (!validator.isNumber(Perpaymentkdvpercent)) {
        validationErrors.push(req.t('Claimpaymentparameters.Error.PerpaymentkdvpercentRequired'))
    }
    if (!validator.isNumber(Perpaymentkdvwithholdingpercent)) {
        validationErrors.push(req.t('Claimpaymentparameters.Error.PerpaymentkdvwithholdingpercentRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Claimpaymentparameters'), req.language))
    }

    let parameteruuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {

        await db.claimpaymentparameterModel.create({
            ...req.body,
            Uuid: parameteruuid,
            Issettingactive: false,
            Isonpreview: true,
            Isapproved: false,
            Approveduser: null,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })


        await CreateNotification({
            type: types.Create,
            service: req.t('Claimpaymentparameters'),
            role: 'claimpaymentparameternotification',
            message: {
                tr: `${new Date()} Tarihli'li Hakediş parametresi ${username} tarafından Oluşturuldu.`,
                en: `${new Date()} With Start Date Claimpaymentparameter Created By ${username}`
            }[req.language],
            pushurl: '/Claimpaymentparameters'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetClaimpaymentparameters(req, res, next)
}

async function UpdateClaimpaymentparameter(req, res, next) {

    let validationErrors = []
    const {
        Type,
        CostumertypeID,
        Patientclaimpaymentperpayment,
        Uuid,
        Perpaymentkdvpercent,
        Perpaymentkdvwithholdingpercent
    } = req.body

    if (!Uuid) {
        validationErrors.push(req.t('Claimpaymentparameters.Error.ClaimpaymentparameterIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Claimpaymentparameters.Error.UnsupportedClaimpaymentparameterID'))
    }
    if (!validator.isNumber(Type)) {
        validationErrors.push(req.t('Claimpaymentparameters.Error.TypeRequired'))
    }
    if (Type !== claimpaymenttypes.Personel) {
        if (!validator.isUUID(CostumertypeID)) {
            validationErrors.push(req.t('Claimpaymentparameters.Error.CostumertypeIDRequired'))
        }
    }
    if (!validator.isUUID(CostumertypeID)) {
        validationErrors.push(req.t('Claimpaymentparameters.Error.CostumertypeIDRequired'))
    }
    if (!validator.isNumber(Patientclaimpaymentperpayment)) {
        validationErrors.push(req.t('Claimpaymentparameters.Error.PatientclaimpaymentperpaymentRequired'))
    }
    if (!validator.isNumber(Perpaymentkdvpercent)) {
        validationErrors.push(req.t('Claimpaymentparameters.Error.PerpaymentkdvpercentRequired'))
    }
    if (!validator.isNumber(Perpaymentkdvwithholdingpercent)) {
        validationErrors.push(req.t('Claimpaymentparameters.Error.PerpaymentkdvwithholdingpercentRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Claimpaymentparameters'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const claimpaymentparameter = await db.claimpaymentparameterModel.findOne({ where: { Uuid: Uuid } })
        if (!claimpaymentparameter) {
            return next(createNotFoundError(req.t('Claimpaymentparameters.Error.NotFound'), req.t('Claimpaymentparameters'), req.language))
        }
        if (claimpaymentparameter.Isactive === false) {
            return next(createNotFoundError(req.t('Claimpaymentparameters.Error.NotActive'), req.t('Claimpaymentparameters'), req.language))
        }
        if (claimpaymentparameter.Isapproved === true) {
            return next(createNotFoundError(req.t('Claimpaymentparameters.Error.Approved'), req.t('Claimpaymentparameters'), req.language))
        }

        await db.claimpaymentparameterModel.update({
            ...req.body,
            Issettingactive: false,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Claimpaymentparameters'),
            role: 'claimpaymentparameternotification',
            message: {
                tr: `${claimpaymentparameter?.Createtime} Tarihli'li Hakediş parametresi ${username} tarafından Güncellendi.`,
                en: `${claimpaymentparameter?.Createtime} With Start Date Claimpaymentparameter Updated By ${username}`
            }[req.language],
            pushurl: '/Claimpaymentparameters'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetClaimpaymentparameters(req, res, next)
}

async function ApproveClaimpaymentparameter(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.claimpaymentparameterId

    if (!Uuid) {
        validationErrors.push(req.t('Claimpaymentparameters.Error.ClaimpaymentparameterIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Claimpaymentparameters.Error.UnsupportedClaimpaymentparameterID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Claimpaymentparameters'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const claimpaymentparameter = await db.claimpaymentparameterModel.findOne({ where: { Uuid: Uuid } })
        if (!claimpaymentparameter) {
            return next(createNotFoundError(req.t('Claimpaymentparameters.Error.NotFound'), req.t('Claimpaymentparameters'), req.language))
        }
        if (claimpaymentparameter.Isactive === false) {
            return next(createNotFoundError(req.t('Claimpaymentparameters.Error.NotActive'), req.t('Claimpaymentparameters'), req.language))
        }
        if (claimpaymentparameter.Isapproved === true) {
            return next(createNotFoundError(req.t('Claimpaymentparameters.Error.Approved'), req.t('Claimpaymentparameters'), req.language))
        }

        await db.claimpaymentparameterModel.update({
            Issettingactive: false,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Isactive: true, Type: claimpaymentparameter?.Type || -1, }, transaction: t })

        await db.claimpaymentparameterModel.update({
            ...claimpaymentparameter,
            Isapproved: true,
            Issettingactive: true,
            Approveduser: username,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })


        await CreateNotification({
            type: types.Update,
            service: req.t('Claimpaymentparameters'),
            role: 'claimpaymentparameternotification',
            message: {
                tr: `${claimpaymentparameter?.Createtime} Tarihli'li Hakediş parametresi ${username} tarafından Onaylandı.`,
                en: `${claimpaymentparameter?.Createtime} With Start Date Claimpaymentparameter Approved By ${username}`
            }[req.language],
            pushurl: '/Claimpaymentparameters'
        })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetClaimpaymentparameters(req, res, next)
}

async function SavepreviewClaimpaymentparameter(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.claimpaymentparameterId

    if (!Uuid) {
        validationErrors.push(req.t('Claimpaymentparameters.Error.ClaimpaymentparameterIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Claimpaymentparameters.Error.UnsupportedClaimpaymentparameterID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Claimpaymentparameters'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const claimpaymentparameter = await db.claimpaymentparameterModel.findOne({ where: { Uuid: Uuid } })
        if (!claimpaymentparameter) {
            return next(createNotFoundError(req.t('Claimpaymentparameters.Error.NotFound'), req.t('Claimpaymentparameters'), req.language))
        }
        if (claimpaymentparameter.Isactive === false) {
            return next(createNotFoundError(req.t('Claimpaymentparameters.Error.NotActive'), req.t('Claimpaymentparameters'), req.language))
        }
        if (claimpaymentparameter.Isapproved === true) {
            return next(createNotFoundError(req.t('Claimpaymentparameters.Error.Approved'), req.t('Claimpaymentparameters'), req.language))
        }

        await db.claimpaymentparameterModel.update({
            ...claimpaymentparameter,
            Isonpreview: false,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })


        await CreateNotification({
            type: types.Update,
            service: req.t('Claimpaymentparameters'),
            role: 'claimpaymentparameternotification',
            message: {
                tr: `${claimpaymentparameter?.Createtime} Tarihli'li Hakediş parametresi ${username} tarafından Kayıt Edildi.`,
                en: `${claimpaymentparameter?.Createtime} With Start Date Claimpaymentparameter Saved By ${username}`
            }[req.language],
            pushurl: '/Claimpaymentparameters'
        })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetClaimpaymentparameters(req, res, next)
}

async function ActivateClaimpaymentparameter(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.claimpaymentparameterId

    if (!Uuid) {
        validationErrors.push(req.t('Claimpaymentparameters.Error.ClaimpaymentparameterIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Claimpaymentparameters.Error.UnsupportedClaimpaymentparameterID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Claimpaymentparameters'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const claimpaymentparameter = await db.claimpaymentparameterModel.findOne({ where: { Uuid: Uuid } })
        if (!claimpaymentparameter) {
            return next(createNotFoundError(req.t('Claimpaymentparameters.Error.NotFound'), req.t('Claimpaymentparameters'), req.language))
        }
        if (claimpaymentparameter.Isactive === false) {
            return next(createNotFoundError(req.t('Claimpaymentparameters.Error.NotActive'), req.t('Claimpaymentparameters'), req.language))
        }
        if (claimpaymentparameter.Isapproved === false) {
            return next(createNotFoundError(req.t('Claimpaymentparameters.Error.NotApproved'), req.t('Claimpaymentparameters'), req.language))
        }

        await db.claimpaymentparameterModel.update({
            Issettingactive: false,
            Updateduser: username,
            Updatetime: new Date(),
        }, {
            where: { Isactive: true, Type: Number(claimpaymentparameter.Type) },
            transaction: t
        });

        await db.claimpaymentparameterModel.update({
            Issettingactive: true,
            Updateduser: username,
            Updatetime: new Date(),
        }, {
            where: { Uuid: Uuid },
            transaction: t
        });

        await CreateNotification({
            type: types.Update,
            service: req.t('Claimpaymentparameters'),
            role: 'claimpaymentparameternotification',
            message: {
                tr: `${claimpaymentparameter?.Createtime} Tarihli'li Hakediş parametresi ${username} tarafından Aktif Edildi.`,
                en: `${claimpaymentparameter?.Createtime} With Start Date Claimpaymentparameter Activated By ${username}`
            }[req.language],
            pushurl: '/Claimpaymentparameters'
        })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetClaimpaymentparameters(req, res, next)
}

async function DeactivateClaimpaymentparameter(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.claimpaymentparameterId

    if (!Uuid) {
        validationErrors.push(req.t('Claimpaymentparameters.Error.ClaimpaymentparameterIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Claimpaymentparameters.Error.UnsupportedClaimpaymentparameterID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Claimpaymentparameters'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const claimpaymentparameter = await db.claimpaymentparameterModel.findOne({ where: { Uuid: Uuid } })
        if (!claimpaymentparameter) {
            return next(createNotFoundError(req.t('Claimpaymentparameters.Error.NotFound'), req.t('Claimpaymentparameters'), req.language))
        }
        if (claimpaymentparameter.Isactive === false) {
            return next(createNotFoundError(req.t('Claimpaymentparameters.Error.NotActive'), req.t('Claimpaymentparameters'), req.language))
        }
        if (claimpaymentparameter.Isapproved === false) {
            return next(createNotFoundError(req.t('Claimpaymentparameters.Error.NotApproved'), req.t('Claimpaymentparameters'), req.language))
        }

        await db.claimpaymentparameterModel.update({
            ...claimpaymentparameter,
            Issettingactive: false,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })


        await CreateNotification({
            type: types.Update,
            service: req.t('Claimpaymentparameters'),
            role: 'claimpaymentparameternotification',
            message: {
                tr: `${claimpaymentparameter?.Createtime} Tarihli'li Hakediş parametresi ${username} tarafından İnaktif Edildi.`,
                en: `${claimpaymentparameter?.Createtime} With Start Date Claimpaymentparameter Deactivated By ${username}`
            }[req.language],
            pushurl: '/Claimpaymentparameters'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetClaimpaymentparameters(req, res, next)
}

async function DeleteClaimpaymentparameter(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.claimpaymentparameterId

    if (!Uuid) {
        validationErrors.push(req.t('Claimpaymentparameters.Error.ClaimpaymentparameterIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Claimpaymentparameters.Error.UnsupportedClaimpaymentparameterID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Claimpaymentparameters'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const claimpaymentparameter = await db.claimpaymentparameterModel.findOne({ where: { Uuid: Uuid } })
        if (!claimpaymentparameter) {
            return next(createNotFoundError(req.t('Claimpaymentparameters.Error.NotFound'), req.t('Claimpaymentparameters'), req.language))
        }
        if (claimpaymentparameter.Isactive === false) {
            return next(createNotFoundError(req.t('Claimpaymentparameters.Error.NotActive'), req.t('Claimpaymentparameters'), req.language))
        }

        await db.claimpaymentparameterModel.update({
            ...claimpaymentparameter,
            Isapproved: true,
            Issettingactive: false,
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Claimpaymentparameters'),
            role: 'claimpaymentparameternotification',
            message: {
                tr: `${claimpaymentparameter?.Createtime} Tarihli'li Hakediş parametresi ${username} tarafından Silindi.`,
                en: `${claimpaymentparameter?.Createtime} With Start Date Claimpaymentparameter Deleted By ${username}`
            }[req.language],
            pushurl: '/Claimpaymentparameters'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetClaimpaymentparameters(req, res, next)
}

module.exports = {
    GetClaimpaymentparameters,
    GetClaimpaymentparameter,
    AddClaimpaymentparameter,
    ApproveClaimpaymentparameter,
    UpdateClaimpaymentparameter,
    DeleteClaimpaymentparameter,
    ActivateClaimpaymentparameter,
    DeactivateClaimpaymentparameter,
    SavepreviewClaimpaymentparameter
}