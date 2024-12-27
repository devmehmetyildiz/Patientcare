const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetUsernotifications(req, res, next) {
    try {
        const notifications = await db.usernotificationModel.findAll()
        res.status(200).json(notifications)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetUsernotificationsbyUserid(req, res, next) {
    try {
        let validationErrors = []
        if (req.params.userId === undefined) {
            validationErrors.push(req.t('Usernotifications.Error.UsernotificationIDRequired'))
        }
        if (!validator.isUUID(req.params.userId)) {
            validationErrors.push(req.t('Usernotifications.Error.UnsupportedUsernotificationID'))
        }
        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Usernotifications'), req.language))
        }
        const notifications = await db.usernotificationModel.findAll({
            where: {
                UserID: req.params.userId,
                Isactive: true,
            },
            order: [
                ['Createtime', 'DESC'],
            ],
        })
        if (!notifications) {
            return next(createNotFoundError(req.t('Usernotifications.Error.NotFound'), req.t('Usernotifications'), req.language))
        }
        res.status(200).json(notifications)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetLastUsernotificationsbyUserid(req, res, next) {
    try {
        let validationErrors = []
        if (req.params.userId === undefined) {
            validationErrors.push(req.t('Usernotifications.Error.UsernotificationIDRequired'))
        }
        if (!validator.isUUID(req.params.userId)) {
            validationErrors.push(req.t('Usernotifications.Error.UnsupportedUsernotificationID'))
        }
        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Usernotifications'), req.language))
        }
        const notifications = await db.usernotificationModel.findAll({
            where: {
                Isreaded: false,
                UserID: req.params.userId,
                Isactive: true,
            },
            order: [
                ['Createtime', 'DESC'],
            ],
            limit: 50
        })
        if (!notifications) {
            return next(createNotFoundError(req.t('Usernotifications.Error.NotFound'), req.t('Usernotifications'), req.language))
        }
        res.status(200).json(notifications)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddUsernotificationbyrole(req, res, next) {

    const { Privilege, Message } = req.body

    const t = await db.sequelize.transaction();
    try {
        const users = await db.userModel.findAll({ where: { Isactive: true } })

        for (const user of users) {
            let notificationSended = false
            const roles = await db.userroleModel.findAll({ where: { UserID: user?.Uuid } })
            for (const role of roles) {
                const privileges = await db.roleprivilegeModel.findAll({ where: { RoleID: role?.RoleID || '' } })
                const willCreatenotification = ((privileges || []).map(u => u.PrivilegeID) || []).includes('admin') || ((privileges || []).map(u => u.PrivilegeID) || []).includes(Privilege)
                if (willCreatenotification) {

                    let notificationuuid = uuid()
                    await db.usernotificationModel.create({
                        ...Message,
                        UserID: user?.Uuid,
                        Uuid: notificationuuid,
                        Createduser: "System",
                        Createtime: new Date(),
                        Isactive: true
                    }, { transaction: t })
                    notificationSended = true
                }

                if (notificationSended) {
                    break;
                }
            }
        }

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    res.status(200).json({ message: 'NotificationCreated' })
}

async function UpdateUsernotifications(req, res, next) {

    const t = await db.sequelize.transaction();
    try {
        const list = req.body
        for (const data of list) {
            const notification = await db.usernotificationModel.findOne({ where: { Uuid: data?.Uuid } })
            if (!notification) {
                return next(createNotFoundError(req.t('Usernotifications.Error.NotFound'), req.t('Usernotifications'), req.language))
            }
            if (notification.Isactive === false) {
                return next(createNotFoundError(req.t('Usernotifications.Error.NotActive'), req.t('Usernotifications'), req.language))
            }

            await db.usernotificationModel.update({
                ...data,
                Updateduser: "System",
                Updatetime: new Date(),
            }, { where: { Uuid: data?.Uuid }, transaction: t })
        }

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    res.status(200).json({ message: 'NotificationUpdated' })
}

async function DeleteUsernotification(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.notificationId

    if (!Uuid) {
        validationErrors.push(req.t('Usernotifications.Error.UsernotificationIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Usernotifications.Error.UnsupportedUsernotificationID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Usernotifications'), req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const notification = await db.usernotificationModel.findOne({ where: { Uuid: Uuid } })
        if (!notification) {
            return next(createNotFoundError(req.t('Usernotifications.Error.NotFound'), req.t('Usernotifications'), req.language))
        }
        if (!notification.Isactive) {
            return next(createNotFoundError(req.t('Usernotifications.Error.NotActive'), req.t('Usernotifications'), req.language))
        }

        await db.usernotificationModel.update({
            Updateduser: "System",
            Updatetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })
        req.params.userId = notification?.UserID
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    res.status(200).json({ message: 'NotificationDeleted' })
}

async function DeleteUsernotificationbyid(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.userId

    if (!Uuid) {
        validationErrors.push(req.t('Usernotifications.Error.UserIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Usernotifications.Error.UnsupportedUserID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Usernotifications'), req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        await db.usernotificationModel.update({
            Updateduser: "System",
            Updatetime: new Date(),
            Isactive: false
        }, { where: { UserID: Uuid }, transaction: t })
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    res.status(200).json({ message: 'NotificationDeleted' })
}

async function DeleteUsernotificationbyidreaded(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.userId

    if (!Uuid) {
        validationErrors.push(req.t('Usernotifications.Error.UsernotificationIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Usernotifications.Error.UnsupportedUsernotificationID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Usernotifications'), req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        await db.usernotificationModel.update({
            Updateduser: "System",
            Updatetime: new Date(),
            Isactive: false
        }, { where: { UserID: Uuid, Isreaded: true }, transaction: t })
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }

    res.status(200).json({ message: 'NotificationDeleted' })
}

async function ReadAllNotificationByUser(req, res, next) {
    try {
        let validationErrors = []
        if (req.params.userId === undefined) {
            validationErrors.push(req.t('Usernotifications.Error.UsernotificationIDRequired'))
        }
        if (!validator.isUUID(req.params.userId)) {
            validationErrors.push(req.t('Usernotifications.Error.UnsupportedUsernotificationID'))
        }
        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Usernotifications'), req.language))
        }
        const notifications = await db.usernotificationModel.count({
            where: {
                Isreaded: false,
                UserID: req.params.userId,
                Isactive: true,
            },
        })
        res.status(200).json(notifications)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function ShowAllNotificationByUser(req, res, next) {
    try {
        let validationErrors = []
        if (req.params.userId === undefined) {
            validationErrors.push(req.t('Usernotifications.Error.UsernotificationIDRequired'))
        }
        if (!validator.isUUID(req.params.userId)) {
            validationErrors.push(req.t('Usernotifications.Error.UnsupportedUsernotificationID'))
        }
        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Usernotifications'), req.language))
        }
        await db.usernotificationModel.update({
            Isshowed: true,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { UserID: req.params.userId, }, transaction: t })

        res.status(200).json({ message: 'success' })
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetUnreadNotificationCountByUser(req, res, next) {
    try {
        let validationErrors = []
        if (req.params.userId === undefined) {
            validationErrors.push(req.t('Usernotifications.Error.UsernotificationIDRequired'))
        }
        if (!validator.isUUID(req.params.userId)) {
            validationErrors.push(req.t('Usernotifications.Error.UnsupportedUsernotificationID'))
        }
        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Usernotifications'), req.language))
        }
        const notifications = await db.usernotificationModel.count({
            where: {
                Isreaded: false,
                UserID: req.params.userId,
                Isactive: true,
            },
        })
        res.status(200).json(notifications)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetUnshowedNotificationCountByUser(req, res, next) {
    try {
        let validationErrors = []
        if (req.params.userId === undefined) {
            validationErrors.push(req.t('Usernotifications.Error.UsernotificationIDRequired'))
        }
        if (!validator.isUUID(req.params.userId)) {
            validationErrors.push(req.t('Usernotifications.Error.UnsupportedUsernotificationID'))
        }
        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Usernotifications'), req.language))
        }
        const notifications = await db.usernotificationModel.count({
            where: {
                Isshowed: false,
                UserID: req.params.userId,
                Isactive: true,
            },
        })
        res.status(200).json(notifications)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

module.exports = {
    GetUsernotifications,
    DeleteUsernotification,
    GetUsernotificationsbyUserid,
    UpdateUsernotifications,
    DeleteUsernotificationbyid,
    DeleteUsernotificationbyidreaded,
    AddUsernotificationbyrole,
    GetLastUsernotificationsbyUserid,
    ReadAllNotificationByUser,
    ShowAllNotificationByUser,
    GetUnreadNotificationCountByUser,
    GetUnshowedNotificationCountByUser,
}
