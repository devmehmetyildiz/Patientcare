const { sequelizeErrorCatcher, } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
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
        validationErrors.push(messages.VALIDATION_ERROR.ROLEID_REQUIRED)
    }
    if (!validator.isUUID(req.params.roleId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_ROLEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const role = await db.roleModel.findOne({ where: { Uuid: req.params.roleId } });
        if (!role) {
            return next(createNotfounderror([messages.ERROR.ROLE_NOT_FOUND]))
        }
        if (!role.Isactive) {
            return next(createNotfounderror([messages.ERROR.ROLE_NOT_ACTIVE]))
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

async function Getprivileges(req, res, next) {
    res.status(200).json(Priveleges)
}

async function Getprivilegegroups(req, res, next) {
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
            validationErrors.push(messages.VALIDATION_ERROR.USERID_REQUIRED)
        }
        if (!validator.isUUID(req.params.userId)) {
            validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_USERID)
        }
        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.language))
        }
        const userroles = await db.userroleModel.findAll({ where: { UserID: req.params.userId } })
        if (!userroles) {
            return next(createNotfounderror([messages.ERROR.USERROLE_NOT_FOUND], req.language))
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
            validationErrors.push(messages.ERROR.USER_NOT_FOUND)
        }
        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.language))
        }
        const userroles = await db.userroleModel.findAll({ where: { UserID: req.identity.user.Uuid } })
        if (!userroles) {
            return next(createNotfounderror([messages.ERROR.USERROLE_NOT_FOUND], req.language))
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
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isArray(Privileges)) {
        validationErrors.push(messages.VALIDATION_ERROR.PRIVILEGES_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
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
            service: 'Roller',
            role: 'rolenotification',
            message: `${Name} rolü ${username} tarafından oluşturuldu.`,
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
        validationErrors.push(messages.VALIDATION_ERROR.ROLEID_REQUIRED)
    }
    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isArray(Privileges)) {
        validationErrors.push(messages.VALIDATION_ERROR.PRIVILEGES_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_ROLEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const role = await db.roleModel.findOne({ where: { Uuid: Uuid } })
        if (!role) {
            return next(createNotfounderror([messages.ERROR.ROLE_NOT_FOUND], req.language))
        }
        if (role.Isactive === false) {
            return next(createNotfounderror([messages.ERROR.ROLE_NOT_ACTIVE], req.language))
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
            service: 'Roller',
            role: 'rolenotification',
            message: `${Name} rolü ${username} tarafından Güncellendi.`,
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
        validationErrors.push(messages.VALIDATION_ERROR.USERID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_USERID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const role = await db.roleModel.findOne({ where: { Uuid: Uuid } })
        if (!role) {
            return next(createNotfounderror([messages.ERROR.ROLE_NOT_FOUND], req.language))
        }
        if (!role.Isactive) {
            return next(createNotfounderror([messages.ERROR.ROLE_NOT_ACTIVE], req.language))
        }

        await db.ruleModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: notificationTypes.Delete,
            service: 'Roller',
            role: 'rolenotification',
            message: `${role?.Name} rolü ${username} tarafından Silindi.`,
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

const messages = {
    ERROR: {
        ROLE_NOT_FOUND: {
            code: 'ROLE_NOT_FOUND', description: {
                en: 'Role not found',
                tr: 'Rol bulunamadı',
            }
        },
        USER_NOT_FOUND: {
            code: 'USER_NOT_FOUND', description: {
                en: 'User not found',
                tr: 'Kullanıcı bulunamadı',
            }
        },
        ROLE_NOT_ACTIVE: {
            code: 'ROLE_NOT_ACTIVE', description: {
                en: 'Role not active',
                tr: 'Rol aktif değil',
            }
        },
        USERROLE_NOT_FOUND: {
            code: 'USERROLE_NOT_FOUND', description: {
                en: 'User role not found',
                tr: 'Kullanıcı rolü bulunamadı',
            }
        },
    },
    VALIDATION_ERROR: {
        NAME_REQUIRED: {
            code: 'NAME_REQUIRED', description: {
                en: 'The name required',
                tr: 'Bu işlem için isim gerekli',
            }
        },
        ROLEID_REQUIRED: {
            code: 'ROLEID_REQUIRED', description: {
                en: 'The role uuid required',
                tr: 'Bu işlem için rol uuid gerekli',
            }
        },
        UNSUPPORTED_ROLEID: {
            code: 'UNSUPPORTED_ROLEID', description: {
                en: 'Unstupported uuid has given',
                tr: 'Geçersiz role id',
            }
        },
        PRIVILEGES_REQUIRED: {
            code: 'PRIVILEGES_REQUIRED', description: {
                en: 'At least 1 privileges required',
                tr: 'En az 1 adet yetki seçilmelidir.',
            }
        },
        USERID_REQUIRED: {
            code: 'USERID_REQUIRED', description: {
                en: 'The user uuid required',
                tr: 'Bu işlem için kullanıcı uuid gerekli',
            }
        },
        UNSUPPORTED_USERID: {
            code: 'UNSUPPORTED_USERID', description: {
                en: 'Unstupported uuid has given',
                tr: 'Geçersiz kullanıcı id girişi',
            }
        },
    }

}
