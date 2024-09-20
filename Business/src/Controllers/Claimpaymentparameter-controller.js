const messages = require("../Constants/ClaimpaymentparameterMessages")
const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
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
        validationErrors.push(messages.VALIDATION_ERROR.CLAIMPAYMENTPARAMETERID_REQUIRED)
    }
    if (!validator.isUUID(req.params.claimpaymentparameterId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_CLAIMPAYMENTPARAMETERID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
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
        validationErrors.push(messages.VALIDATION_ERROR.STARTDATE_REQUIRED)
        return next(createValidationError(validationErrors, req.language))
    }
    if (Type !== claimpaymenttypes.Personel) {
        if (!validator.isUUID(CostumertypeID)) {
            return next(createValidationError([messages.VALIDATION_ERROR.COSTUMERTYPEID_REQUIRED], req.language))
        }
    }
    if (!validator.isUUID(CostumertypeID)) {
        return next(createValidationError([messages.VALIDATION_ERROR.COSTUMERTYPEID_REQUIRED], req.language))
    }
    if (!validator.isNumber(Patientclaimpaymentperpayment)) {
        return next(createValidationError([messages.VALIDATION_ERROR.PERPAYMENT_REQUIRED], req.language))
    }
    if (!validator.isNumber(Perpaymentkdvpercent)) {
        return next(createValidationError([messages.VALIDATION_ERROR.KDVPERCENT_REQUIRED], req.language))
    }
    if (!validator.isNumber(Perpaymentkdvwithholdingpercent)) {
        return next(createValidationError([messages.VALIDATION_ERROR.KDVWITHHOLDINGPERCENT_REQUIRED], req.language))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let parameteruuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {

        await db.claimpaymentparameterModel.create({
            ...req.body,
            Uuid: parameteruuid,
            Issettingactive: false,
            Isapproved: false,
            Approveduser: null,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })


        await CreateNotification({
            type: types.Create,
            service: 'Hakediş Parametreleri',
            role: 'claimpaymentparameternotification',
            message: `${parameteruuid} numaralı parametre ${username} tarafından Eklendi.`,
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
        validationErrors.push(messages.VALIDATION_ERROR.CLAIMPAYMENTPARAMETERID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_CLAIMPAYMENTPARAMETERID)
    }
    if (!validator.isNumber(Type)) {
        validationErrors.push(messages.VALIDATION_ERROR.STARTDATE_REQUIRED)
        return next(createValidationError(validationErrors, req.language))
    }
    if (Type !== claimpaymenttypes.Personel) {
        if (!validator.isUUID(CostumertypeID)) {
            return next(createValidationError([messages.VALIDATION_ERROR.COSTUMERTYPEID_REQUIRED], req.language))
        }
    }
    if (!validator.isUUID(CostumertypeID)) {
        return next(createValidationError([messages.VALIDATION_ERROR.COSTUMERTYPEID_REQUIRED], req.language))
    }
    if (!validator.isNumber(Patientclaimpaymentperpayment)) {
        return next(createValidationError([messages.VALIDATION_ERROR.PERPAYMENT_REQUIRED], req.language))
    }
    if (!validator.isNumber(Perpaymentkdvpercent)) {
        return next(createValidationError([messages.VALIDATION_ERROR.KDVPERCENT_REQUIRED], req.language))
    }
    if (!validator.isNumber(Perpaymentkdvwithholdingpercent)) {
        return next(createValidationError([messages.VALIDATION_ERROR.KDVWITHHOLDINGPERCENT_REQUIRED], req.language))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const claimpaymentparameter = await db.claimpaymentparameterModel.findOne({ where: { Uuid: Uuid } })
        if (!claimpaymentparameter) {
            return next(createNotfounderror([messages.ERROR.CLAIMPAYMENTPARAMETER_NOT_FOUND], req.language))
        }
        if (claimpaymentparameter.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.CLAIMPAYMENTPARAMETER_NOT_ACTIVE], req.language))
        }
        if (claimpaymentparameter.Isapproved === true) {
            return next(createAccessDenied([messages.ERROR.CLAIMPAYMENTPARAMETER_ALREADY_APPROVED], req.language))
        }

        await db.claimpaymentparameterModel.update({
            ...req.body,
            Issettingactive: false,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Hakediş Parametreleri',
            role: 'claimpaymentparameternotification',
            message: `${Uuid} numaralı hakediş parametresi ${username} tarafından Güncellendi.`,
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
        validationErrors.push(messages.VALIDATION_ERROR.CLAIMPAYMENTPARAMETERID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_CLAIMPAYMENTPARAMETERID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const claimpaymentparameter = await db.claimpaymentparameterModel.findOne({ where: { Uuid: Uuid } })
        if (!claimpaymentparameter) {
            return next(createNotfounderror([messages.ERROR.CLAIMPAYMENTPARAMETER_NOT_FOUND], req.language))
        }
        if (claimpaymentparameter.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.CLAIMPAYMENTPARAMETER_NOT_ACTIVE], req.language))
        }
        if (claimpaymentparameter.Isapproved === true) {
            return next(createAccessDenied([messages.ERROR.CLAIMPAYMENTPARAMETER_ALREADY_APPROVED], req.language))
        }

        await db.claimpaymentparameterModel.update({
            Issettingactive: false,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Isactive: true, Type: claimpaymentparameter?.Type || -1, } }, { transaction: t })

        await db.claimpaymentparameterModel.update({
            ...claimpaymentparameter,
            Isapproved: true,
            Issettingactive: true,
            Approveduser: username,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })


        await CreateNotification({
            type: types.Update,
            service: 'Hakediş Parametreleri',
            role: 'claimpaymentparameternotification',
            message: `${Uuid} numaralı hakediş parametresi ${username} tarafından Onaylandı.`,
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
        validationErrors.push(messages.VALIDATION_ERROR.CLAIMPAYMENTPARAMETERID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_CLAIMPAYMENTPARAMETERID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const claimpaymentparameter = await db.claimpaymentparameterModel.findOne({ where: { Uuid: Uuid } })
        if (!claimpaymentparameter) {
            return next(createNotfounderror([messages.ERROR.CLAIMPAYMENTPARAMETER_NOT_FOUND], req.language))
        }
        if (claimpaymentparameter.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.CLAIMPAYMENTPARAMETER_NOT_ACTIVE], req.language))
        }
        if (claimpaymentparameter.Isapproved === false) {
            return next(createAccessDenied([messages.ERROR.CLAIMPAYMENTPARAMETER_IS_NOT_APPROVED], req.language))
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
            service: 'Hakediş Parametreleri',
            role: 'claimpaymentparameternotification',
            message: `${Uuid} numaralı hakediş parametresi ${username} tarafından Aktif Edildi.`,
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
        validationErrors.push(messages.VALIDATION_ERROR.CLAIMPAYMENTPARAMETERID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_CLAIMPAYMENTPARAMETERID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const claimpaymentparameter = await db.claimpaymentparameterModel.findOne({ where: { Uuid: Uuid } })
        if (!claimpaymentparameter) {
            return next(createNotfounderror([messages.ERROR.CLAIMPAYMENTPARAMETER_NOT_FOUND], req.language))
        }
        if (claimpaymentparameter.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.CLAIMPAYMENTPARAMETER_NOT_ACTIVE], req.language))
        }
        if (claimpaymentparameter.Isapproved === false) {
            return next(createAccessDenied([messages.ERROR.CLAIMPAYMENTPARAMETER_IS_NOT_APPROVED], req.language))
        }

        await db.claimpaymentparameterModel.update({
            ...claimpaymentparameter,
            Issettingactive: false,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })


        await CreateNotification({
            type: types.Update,
            service: 'Hakediş Parametreleri',
            role: 'claimpaymentparameternotification',
            message: `${Uuid} numaralı hakediş parametresi ${username} tarafından İnaktif edildi.`,
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
        validationErrors.push(messages.VALIDATION_ERROR.CLAIMPAYMENTPARAMETERID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_CLAIMPAYMENTPARAMETERID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const claimpaymentparameter = await db.claimpaymentparameterModel.findOne({ where: { Uuid: Uuid } })
        if (!claimpaymentparameter) {
            return next(createNotfounderror([messages.ERROR.CLAIMPAYMENTPARAMETER_NOT_FOUND], req.language))
        }
        if (claimpaymentparameter.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.CLAIMPAYMENTPARAMETER_NOT_ACTIVE], req.language))
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
            service: 'Hakediş Parametreleri',
            role: 'claimpaymentparameternotification',
            message: `${Uuid} numaralı hakediş parametresi ${username} tarafından Silindi.`,
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
}