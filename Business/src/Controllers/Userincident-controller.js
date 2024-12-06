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
        validationErrors.push(req.t('Userincidents.Error.UserincidentIDRequired'))
    }
    if (!validator.isUUID(req.params.userincidentId)) {
        validationErrors.push(req.t('Userincidents.Error.UnsupportedUserincidentID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Userincidents'), req.language))
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
        Occuredtime
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
    if (!validator.isISODate(Occuredtime)) {
        validationErrors.push(req.t('Userincidents.Error.OccuredtimeRequired'))
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
            Isonpreview: true,
            Isapproved: false,
            Iscompleted: false,
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
        Occuredtime
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
    if (!validator.isISODate(Occuredtime)) {
        validationErrors.push(req.t('Userincidents.Error.OccuredtimeRequired'))
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
        if (userincident.Isonpreview === false) {
            return next(createNotFoundError(req.t('Userincidents.Error.NotOnPreview'), req.t('Userincidents'), req.language))
        }
        if (userincident.Isapproved === true) {
            return next(createNotFoundError(req.t('Userincidents.Error.Approved'), req.t('Userincidents'), req.language))
        }
        if (userincident.Iscompleted === true) {
            return next(createNotFoundError(req.t('Userincidents.Error.Completed'), req.t('Userincidents'), req.language))
        }

        await db.userincidentModel.update({
            ...req.body,
            Isonpreview: true,
            Isapproved: false,
            Iscompleted: false,
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

async function SavepreviewUserincident(req, res, next) {

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
        if (userincident.Isonpreview === false) {
            return next(createNotFoundError(req.t('Userincidents.Error.NotOnPreview'), req.t('Userincidents'), req.language))
        }
        if (userincident.Isapproved === true) {
            return next(createNotFoundError(req.t('Userincidents.Error.Approved'), req.t('Userincidents'), req.language))
        }
        if (userincident.Iscompleted === true) {
            return next(createNotFoundError(req.t('Userincidents.Error.Completed'), req.t('Userincidents'), req.language))
        }

        await db.userincidentModel.update({
            Isonpreview: false,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: Uuid }, transaction: t })


        const user = await DoGet(config.services.Userrole, 'Users/' + userincident?.UserID || '')

        await CreateNotification({
            type: types.Update,
            service: req.t('Userincidents'),
            role: 'userincidentnotification',
            message: {
                tr: `${user?.Name} ${user?.Surname} Kullanıcısına Ait Olay ${username} tarafından Kayıt Edildi.`,
                en: `${user?.Name} ${user?.Surname} User Incident Saved By ${username}`
            }[req.language],
            pushurl: '/Userincidents'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetUserincidents(req, res, next)
}

async function ApproveUserincident(req, res, next) {

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
        if (userincident.Isonpreview === true) {
            return next(createNotFoundError(req.t('Userincidents.Error.OnPreview'), req.t('Userincidents'), req.language))
        }
        if (userincident.Isapproved === true) {
            return next(createNotFoundError(req.t('Userincidents.Error.Approved'), req.t('Userincidents'), req.language))
        }
        if (userincident.Iscompleted === true) {
            return next(createNotFoundError(req.t('Userincidents.Error.Completed'), req.t('Userincidents'), req.language))
        }

        await db.userincidentModel.update({
            Isapproved: true,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: Uuid }, transaction: t })

        const user = await DoGet(config.services.Userrole, 'Users/' + userincident?.UserID || '')

        await CreateNotification({
            type: types.Update,
            service: req.t('Userincidents'),
            role: 'userincidentnotification',
            message: {
                tr: `${user?.Name} ${user?.Surname} Kullanıcısına Ait Olay ${username} tarafından Onaylandı.`,
                en: `${user?.Name} ${user?.Surname} User Incident Approved By ${username}`
            }[req.language],
            pushurl: '/Userincidents'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetUserincidents(req, res, next)
}

async function CompleteUserincident(req, res, next) {

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
        if (userincident.Isonpreview === true) {
            return next(createNotFoundError(req.t('Userincidents.Error.OnPreview'), req.t('Userincidents'), req.language))
        }
        if (userincident.Isapproved === false) {
            return next(createNotFoundError(req.t('Userincidents.Error.NotApproved'), req.t('Userincidents'), req.language))
        }
        if (userincident.Iscompleted === true) {
            return next(createNotFoundError(req.t('Userincidents.Error.Completed'), req.t('Userincidents'), req.language))
        }

        await db.userincidentModel.update({
            Iscompleted: true,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: Uuid }, transaction: t })

        const user = await DoGet(config.services.Userrole, 'Users/' + userincident?.UserID || '')

        await CreateNotification({
            type: types.Update,
            service: req.t('Userincidents'),
            role: 'userincidentnotification',
            message: {
                tr: `${user?.Name} ${user?.Surname} Kullanıcısına Ait Olay ${username} tarafından Tamamlandı.`,
                en: `${user?.Name} ${user?.Surname} User Incident Completed By ${username}`
            }[req.language],
            pushurl: '/Userincidents'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
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

        const user = await DoGet(config.services.Userrole, 'Users/' + userincident?.UserID || '')

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
    DeleteUserincident,
    SavepreviewUserincident,
    ApproveUserincident,
    CompleteUserincident,
}