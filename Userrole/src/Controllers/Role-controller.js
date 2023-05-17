const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const crypto = require('crypto')


async function GetRoles(req, res, next) {
    try {
        const roles = await db.roleModel.findAll({ where: { Isactive: true } })
        for (const role of roles) {
            role.privileges = await db.roleprivilegeModel.findAll({
                where: {
                    RoleID: role.Uuid,
                }
            });
        }
        res.status(200).json(roles)
    } catch (error) {
        sequelizeErrorCatcher(error)
        next()
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
            return createNotfounderror([messages.ERROR.ROLE_NOT_FOUND], req.language)
        }
        if (!role.Isactive) {
            return createNotfounderror([messages.ERROR.ROLE_NOT_ACTIVE], req.language)
        }
        role.privileges = await db.roleprivilegeModel.findAll({ where: { RoleID: role.Uuid } })
        res.status(200).json(role)
    } catch (error) {
        sequelizeErrorCatcher(error)
        next()
    }
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
        const userroles = await db.userroleModel.findAll({ where: { UserID: user.Uuid } })
        if (!userroles) {
            return next(createNotfounderror([messages.ERROR.USERROLE_NOT_FOUND], req.language))
        }
        for (const userrole of userroles) {
            let privileges = await db.roleprivilegeModel.findAll({ where: { RoleID: userrole.RoleID } })
            userprivileges = privileges.map(u => { return u.PrivilegeID }).concat(userprivileges)
        }
        res.status(200).json(userprivileges)
    } catch (error) {
        sequelizeErrorCatcher(error)
        next()
    }
}

async function AddRole(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Privileges
    } = req.body

    if (Name === undefined) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
    }
    if (Privileges === undefined || !Array.isArray(Privileges) || Privileges.length <= 0) {
        validationErrors.push(messages.VALIDATION_ERROR.PRIVILEGES_REQUIRED, req.language)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let roleuuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.roleModel.create({
            Name: Name,
            Uuid: roleuuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        for (const privilege of Privileges) {
            await db.roleprivilegeModel.create({
                RoleID: roleuuid,
                PrivilegeID: privilege
            }, { transaction: t });
        }

        await t.commit()
        const createdRole = await db.roleModel.findOne({ where: { Uuid: roleuuid } })
        createdRole.privileges = await db.roleprivilegeModel.findAll({ where: { RoleID: roleuuid } })
        res.status(200).json(createdRole)
    } catch (err) {
        await t.rollback()
        sequelizeErrorCatcher(err)
        next()
    }
}

async function UpdateRole(req, res, next) {

    let validationErrors = []
    const {
        Uuid,
        Name,
        Privileges
    } = req.body

    if (Uuid === undefined) {
        validationErrors.push(messages.VALIDATION_ERROR.ROLEID_REQUIRED, req.language)
    }
    if (Name === undefined) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
    }
    if (Privileges === undefined || !Array.isArray(Privileges) || Privileges.length <= 0) {
        validationErrors.push(messages.VALIDATION_ERROR.PRIVILEGES_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_ROLEID, req.language)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const role = db.roleModel.findOne({ where: { Uuid: Uuid } })
        if (!role) {
            return next(createNotfounderror([messages.ERROR.ROLE_NOT_FOUND], req.language))
        }
        if (role.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.ROLE_NOT_ACTIVE], req.language))
        }

        const t = await db.sequelize.transaction();

        await db.roleModel.update({
            ...data,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await db.roleprivilegeModel.destroy({ where: { RoleID: Uuid }, transaction: t });
        for (const privilege of Privileges) {
            await db.roleprivilegeModel.create({
                RoleID: Uuid,
                PrivilegeID: privilege.PrivilegeID
            }, { transaction: t })
        }
        await t.commit()
        const updatedRole = await db.roleModel.findOne({ where: { Uuid: Uuid } })
        updatedRole.privileges = await db.roleprivilegeModel.findAll({ where: { RoleID: Uuid } })
        res.status(200).json(updatedRole)
    } catch (error) {
        sequelizeErrorCatcher(error)
        next()
    }


}

async function DeleteRole(req, res, next) {

    let validationErrors = []
    const {
        Uuid
    } = req.body

    if (Uuid === undefined) {
        validationErrors.push(messages.VALIDATION_ERROR.USERID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_USERID, req.language)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const role = db.roleModel.findOne({ where: { Uuid: Uuid } })
        if (!role) {
            return next(createNotfounderror([messages.ERROR.ROLE_NOT_FOUND], req.language))
        }
        if (!role.Isactive) {
            return next(createNotfounderror([messages.ERROR.ROLE_NOT_ACTIVE], req.language))
        }
        const t = await db.sequelize.transaction();

        await db.roleprivilegeModel.destroy({ where: { RoleID: Uuid }, transaction: t });
        await db.roleModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();

        res.status(200).json({ messages: "deleted", Uuid: Uuid })
    } catch (error) {
        await t.rollback();
        sequelizeErrorCatcher(error)
        next()
    }

}


module.exports = {
    GetRoles,
    GetRole,
    AddRole,
    UpdateRole,
    DeleteRole,
    Getprivilegesbyuserid
}