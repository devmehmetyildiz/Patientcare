const { sequelizeErrorCatcher, } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const Priveleges = require("../Constants/Privileges")
const { notificationTypes } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")

async function GetRoles(req, res, next) {
    try {
        const roles = await db.roleModel.findAll()
        for (const role of roles) {
            role.Privileges = []
            let privileges = await db.roleprivilegeModel.findAll({
                where: {
                    RoleID: role.Uuid,
                }
            });
            privileges.forEach(privilege => {
                role.Privileges.push(Priveleges.find(u => u.code === privilege.PrivilegeID))
            });
        }
        res.status(200).json(roles)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetRolescount(req, res, next) {
    try {
        const roles = await db.roleModel.count()
        res.status(200).json(roles)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetRole(req, res, next) {

    let validationErrors = []
    if (req.params.roleId === undefined) {
        validationErrors.push(req.t('Roles.Error.RoleIDRequired'))
    }
    if (!validator.isUUID(req.params.roleId)) {
        validationErrors.push(req.t('Roles.Error.UnsupportedRoleID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Roles'), req.language))
    }

    try {
        const role = await db.roleModel.findOne({ where: { Uuid: req.params.roleId } });
        if (!role) {
            return next(createNotFoundError(req.t('Roles.Error.NotFound'), req.t('Roles'), req.language))
        }
        if (!role.Isactive) {
            return next(createNotFoundError(req.t('Roles.Error.NotActive'), req.t('Roles'), req.language))
        }
        role.Privileges = []
        let privileges = await db.roleprivilegeModel.findAll({
            where: {
                RoleID: role.Uuid,
            }
        });
        privileges.forEach(privilege => {
            role.Privileges.push(Priveleges.find(u => u.code === privilege.PrivilegeID))
        });
        res.status(200).json(role)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function Getprivileges(req, res) {
    res.status(200).json(Priveleges)
}

async function Getprivilegegroups(req, res) {
    let groups = []
    Priveleges.forEach(element => {
        let foundedValue = groups.find(u => u.en === element.group.en && u.tr === element.group.tr)
        if (!foundedValue) {
            groups.push(element.group)
        }
    })
    res.status(200).json(groups)
}

async function Getprivilegesbyuserid(req, res, next) {
    let userprivileges = []
    try {
        let validationErrors = []
        if (req.params.userId === undefined) {
            validationErrors.push(req.t('Roles.Error.UserIDRequired'))
        }
        if (!validator.isUUID(req.params.userId)) {
            validationErrors.push(req.t('Roles.Error.UnsupportedUserID'))
        }
        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Roles'), req.language))
        }
        const userroles = await db.userroleModel.findAll({ where: { UserID: req.params.userId } })
        if (!userroles) {
            return next(createNotFoundError(req.t('Roles.Error.UserroleNotFound'), req.t('Roles'), req.language))
        }
        for (const userrole of userroles) {
            let privileges = await db.roleprivilegeModel.findAll({ where: { RoleID: userrole.RoleID } })
            userprivileges = privileges.map(u => { return u.PrivilegeID }).concat(userprivileges)
        }
        res.status(200).json(userprivileges)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetActiveuserprivileges(req, res, next) {
    let userprivileges = []
    try {
        let validationErrors = []
        if (!req.identity.user) {
            validationErrors.push(req.t('Roles.Error.UserNotFound'))
        }
        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Roles'), req.language))
        }
        const userroles = await db.userroleModel.findAll({ where: { UserID: req.identity.user.Uuid } })
        if (!userroles) {
            return next(createNotFoundError(req.t('Roles.Error.UserroleNotFound'), req.t('Roles'), req.language))
        }
        for (const userrole of userroles) {
            let privileges = await db.roleprivilegeModel.findAll({ where: { RoleID: userrole.RoleID } })
            userprivileges = privileges.map(u => { return u.PrivilegeID }).concat(userprivileges)
        }
        res.status(200).json(userprivileges)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddRole(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Privileges
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Roles.Error.NameRequired'))
    }
    if (!validator.isArray(Privileges)) {
        validationErrors.push(req.t('Roles.Error.PrevilegesRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Roles'), req.language))
    }

    let roleuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.roleModel.create({
            Name: Name,
            Uuid: roleuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        for (const privilege of Privileges) {
            await db.roleprivilegeModel.create({
                RoleID: roleuuid,
                PrivilegeID: privilege
            }, { transaction: t });
        }

        await CreateNotification({
            type: notificationTypes.Create,
            service: req.t('Roles'),
            role: 'rolenotification',
            message: {
                tr: `${Name} Rolü ${username} Tarafından Oluşturuldu.`,
                en: `${Name} Role Created By ${username}`
            }[req.language],
            pushurl: '/Roles'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetRoles(req, res, next)
}

async function UpdateRole(req, res, next) {

    let validationErrors = []
    const {
        Uuid,
        Name,
        Privileges
    } = req.body

    if (!Uuid) {
        validationErrors.push(req.t('Roles.Error.RoleIDRequired'))
    }
    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Roles.Error.NameRequired'))
    }
    if (!validator.isArray(Privileges)) {
        validationErrors.push(req.t('Roles.Error.PrevilegesRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Roles.Error.UnsupportedRoleID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Roles'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const role = await db.roleModel.findOne({ where: { Uuid: Uuid } })
        if (!role) {
            return next(createNotFoundError(req.t('Roles.Error.NotFound'), req.t('Roles'), req.language))
        }
        if (role.Isactive === false) {
            return next(createNotFoundError(req.t('Roles.Error.NotActive'), req.t('Roles'), req.language))
        }

        await db.roleModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.roleprivilegeModel.destroy({ where: { RoleID: Uuid }, transaction: t });
        for (const privilege of Privileges) {
            await db.roleprivilegeModel.create({
                RoleID: Uuid,
                PrivilegeID: privilege
            }, { transaction: t })
        }

        await CreateNotification({
            type: notificationTypes.Update,
            service: req.t('Roles'),
            role: 'rolenotification',
            message: {
                tr: `${Name} Rolü ${username} Tarafından Güncellendi.`,
                en: `${Name} Role Updated By ${username}`
            }[req.language],
            pushurl: '/Roles'
        })
        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetRoles(req, res, next)
}

async function DeleteRole(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.roleId

    if (!Uuid) {
        validationErrors.push(req.t('Roles.Error.UserIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Roles.Error.UnsupportedUserID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Roles'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const role = await db.roleModel.findOne({ where: { Uuid: Uuid } })
        if (!role) {
            return next(createNotFoundError(req.t('Roles.Error.NotFound'), req.t('Roles'), req.language))
        }
        if (!role.Isactive) {
            return next(createNotFoundError(req.t('Roles.Error.NotActive'), req.t('Roles'), req.language))
        }

        await db.roleModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: notificationTypes.Update,
            service: req.t('Roles'),
            role: 'rolenotification',
            message: {
                tr: `${role?.Name} Rolü ${username} Tarafından Silindi.`,
                en: `${role?.Name} Role Deleted By ${username}`
            }[req.language],
            pushurl: '/Roles'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetRoles(req, res, next)
}


module.exports = {
    GetRoles,
    GetRole,
    AddRole,
    UpdateRole,
    DeleteRole,
    Getprivilegesbyuserid,
    GetActiveuserprivileges,
    Getprivileges,
    Getprivilegegroups,
    GetRolescount
}