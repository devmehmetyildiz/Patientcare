const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const DoGet = require('../Utilities/DoGet')
const config = require("../Config")

async function GetUserincidents(req, res, next) {
    try {
        const userincidents = await db.userincidentModel.findAll()
        res.status(200).json(userincidents)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetUserincident(req, res, next) {

    let validationErrors = []
    if (!req.params.userincidentId) {
        validationErrors.push(req.t('Patientvisits.Error.PatientvisitIDRequired'))
    }
    if (!validator.isUUID(req.params.userincidentId)) {
        validationErrors.push(req.t('Patientvisits.Error.UnsupportedPatientvisitID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patientvisits'), req.language))
    }

    try {
        const userincident = await db.userincidentModel.findOne({ where: { Uuid: req.params.userincidentId } });
        res.status(200).json(userincident)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddUserincident(req, res, next) {

    let validationErrors = []
    const {
        UserID,
        Type,
        Event,
    } = req.body

    if (!validator.isUUID(UserID)) {
        validationErrors.push(req.t('Userincidents.Error.UserIDRequired'))
    }
    if (!validator.isNumber(Type)) {
        validationErrors.push(req.t('Userincidents.Error.TypeRequired'))
    }
    if (!validator.isString(Event)) {
        validationErrors.push(req.t('Userincidents.Error.EventRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Userincidents'), req.language))
    }

    let incidentuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.userincidentModel.create({
            ...req.body,
            Uuid: incidentuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        const user = await DoGet(config.services.Userrole, 'Users/' + UserID)

        await CreateNotification({
            type: types.Create,
            service: req.t('Userincidents'),
            role: 'userincidentnotification',
            message: {
                tr: `${user?.Name} ${user?.Surname} Kullanıcısına Ait Olay ${username} tarafından Oluşturuldu.`,
                en: `${user?.Name} ${user?.Surname} User Incident Created By ${username}`
            }[req.language],
            pushurl: '/Userincidents'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetUserincidents(req, res, next)
}

async function UpdateUserincident(req, res, next) {

    let validationErrors = []
    const {
        Uuid,
        UserID,
        Type,
        Event,
    } = req.body

    if (!Uuid) {
        validationErrors.push(req.t('Userincidents.Error.UserincidentIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Userincidents.Error.UnsupportedUserincidentID'))
    }
    if (!validator.isUUID(UserID)) {
        validationErrors.push(req.t('Userincidents.Error.UserIDRequired'))
    }
    if (!validator.isNumber(Type)) {
        validationErrors.push(req.t('Userincidents.Error.TypeRequired'))
    }
    if (!validator.isString(Event)) {
        validationErrors.push(req.t('Userincidents.Error.EventRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Userincidents'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const userincident = await db.userincidentModel.findOne({ where: { Uuid: Uuid } })
        if (!userincident) {
            return next(createNotFoundError(req.t('Userincidents.Error.NotFound'), req.t('Userincidents'), req.language))
        }
        if (userincident.Isactive === false) {
            return next(createNotFoundError(req.t('Userincidents.Error.NotActive'), req.t('Userincidents'), req.language))
        }

        await db.userincidentModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: Uuid }, transaction: t })

        const user = await DoGet(config.services.Userrole, 'Users/' + UserID)

        await CreateNotification({
            type: types.Update,
            service: req.t('Userincidents'),
            role: 'userincidentnotification',
            message: {
                tr: `${user?.Name} ${user?.Surname} Kullanıcısına Ait Olay ${username} tarafından Güncellendi.`,
                en: `${user?.Name} ${user?.Surname} User Incident Updated By ${username}`
            }[req.language],
            pushurl: '/Userincidents'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetUserincidents(req, res, next)
}

async function DeleteUserincident(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.userincidentId

    if (!Uuid) {
        validationErrors.push(req.t('Userincidents.Error.UserincidentIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Userincidents.Error.UnsupportedUserincidentID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Userincidents'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const userincident = await db.userincidentModel.findOne({ where: { Uuid: Uuid } })
        if (!userincident) {
            return next(createNotFoundError(req.t('Userincidents.Error.NotFound'), req.t('Userincidents'), req.language))
        }
        if (userincident.Isactive === false) {
            return next(createNotFoundError(req.t('Userincidents.Error.NotActive'), req.t('Userincidents'), req.language))
        }

        await db.userincidentModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        const user = await DoGet(config.services.Userrole, 'Users/' + UserID)

        await CreateNotification({
            type: types.Delete,
            service: req.t('Userincidents'),
            role: 'userincidentnotification',
            message: {
                tr: `${user?.Name} ${user?.Surname} Kullanıcısına Ait Olay ${username} tarafından Silindi.`,
                en: `${user?.Name} ${user?.Surname} User Incident Deleted By ${username}`
            }[req.language],
            pushurl: '/Userincidents'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetUserincidents(req, res, next)
}

module.exports = {
    GetUserincidents,
    GetUserincident,
    AddUserincident,
    UpdateUserincident,
    DeleteUserincident
}