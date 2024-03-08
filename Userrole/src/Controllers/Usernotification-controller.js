const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
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

async function GetUsernotification(req, res, next) {

    let validationErrors = []
    if (req.params.notificationId === undefined) {
        validationErrors.push(messages.VALIDATION_ERROR.NOTIFICATIONID_REQUIRED)
    }
    if (!validator.isUUID(req.params.notificationId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_NOTIFICATIONID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const notification = await db.usernotificationModel.findOne({ where: { Uuid: req.params.notificationId } });
        if (!notification) {
            return next(createNotfounderror([messages.ERROR.NOTIFICATION_NOT_FOUND]))
        }
        if (!notification.Isactive) {
            return next(createNotfounderror([messages.ERROR.NOTIFICATION_NOT_ACTIVE]))
        }
        res.status(200).json(notification)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetUsernotificationsbyUserid(req, res, next) {
    try {
        let validationErrors = []
        if (req.params.userId === undefined) {
            validationErrors.push(messages.VALIDATION_ERROR.NOTIFICATIONID_REQUIRED)
        }
        if (!validator.isUUID(req.params.userId)) {
            validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_NOTIFICATIONID)
        }
        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.language))
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
            return next(createNotfounderror([messages.ERROR.NOTIFICATION_NOT_FOUND], req.language))
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

async function AddUsernotification(req, res, next) {

    let notificationuuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.usernotificationModel.create({
            ...req.body,
            Uuid: notificationuuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetUsernotifications(req, res, next)
}

async function UpdateUsernotification(req, res, next) {

    const t = await db.sequelize.transaction();
    try {
        const notification = await db.usernotificationModel.findOne({ where: { Uuid: req.body.Uuid } })
        if (!notification) {
            return next(createNotfounderror([messages.ERROR.NOTIFICATION_NOT_FOUND], req.language))
        }
        if (notification.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.NOTIFICATION_NOT_ACTIVE], req.language))
        }

        await db.usernotificationModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: req.body?.Uuid } }, { transaction: t })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetUsernotifications(req, res, next)
}

async function UpdateUsernotifications(req, res, next) {

    const t = await db.sequelize.transaction();
    try {
        const list = req.body
        for (const data of list) {
            const notification = await db.usernotificationModel.findOne({ where: { Uuid: data?.Uuid } })
            if (!notification) {
                return next(createNotfounderror([messages.ERROR.NOTIFICATION_NOT_FOUND], req.language))
            }
            if (notification.Isactive === false) {
                return next(createAccessDenied([messages.ERROR.NOTIFICATION_NOT_ACTIVE], req.language))
            }

            await db.usernotificationModel.update({
                ...data,
                Updateduser: "System",
                Updatetime: new Date(),
            }, { where: { Uuid: data?.Uuid } }, { transaction: t })
        }

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetUsernotifications(req, res, next)
}

async function DeleteUsernotification(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.notificationId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.NOTIFICATIONID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_NOTIFICATIONID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const notification = await db.usernotificationModel.findOne({ where: { Uuid: Uuid } })
        if (!notification) {
            return next(createNotfounderror([messages.ERROR.NOTIFICATION_NOT_FOUND], req.language))
        }
        if (!notification.Isactive) {
            return next(createNotfounderror([messages.ERROR.NOTIFICATION_NOT_ACTIVE], req.language))
        }

        await db.usernotificationModel.update({
            Updateduser: "System",
            Updatetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid } }, { transaction: t })
        req.params.userId = notification?.UserID
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetUsernotifications(req, res, next)
}

async function DeleteUsernotificationbyid(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.userId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.NOTIFICATIONID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_NOTIFICATIONID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        await db.usernotificationModel.update({
            Updateduser: "System",
            Updatetime: new Date(),
            Isactive: false
        }, { where: { UserID: Uuid } }, { transaction: t })
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetUsernotifications(req, res, next)
}

async function DeleteUsernotificationbyidreaded(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.userId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.NOTIFICATIONID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_NOTIFICATIONID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        await db.usernotificationModel.update({
            Updateduser: "System",
            Updatetime: new Date(),
            Isactive: false
        }, { where: { UserID: Uuid, Isreaded: true } }, { transaction: t })
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }

    GetUsernotifications(req, res, next)
}

module.exports = {
    GetUsernotifications,
    GetUsernotification,
    AddUsernotification,
    UpdateUsernotification,
    DeleteUsernotification,
    GetUsernotificationsbyUserid,
    UpdateUsernotifications,
    DeleteUsernotificationbyid,
    DeleteUsernotificationbyidreaded,
    AddUsernotificationbyrole
}