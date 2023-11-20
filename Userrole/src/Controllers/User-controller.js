const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const bcrypt = require('bcrypt')
const axios = require('axios')
const config = require("../Config")

async function Register(req, res, next) {

    try {
        const usercount = await db.userModel.count({
            where: {
                Isactive: true
            }
        });
        if (usercount > 0) {
            return next(createValidationError([messages.ERROR.ADMIN_USER_ALREADY_ACTIVE], req.language))
        }
        const {
            Username,
            Email,
            Password,
        } = req.body
        let validationErrors = []
        if (!validator.isString(Username)) {
            validationErrors.push(messages.VALIDATION_ERROR.USERNAME_REQUIRED)
        }
        if (!validator.isString(Password)) {
            validationErrors.push(messages.VALIDATION_ERROR.PASSWORD_REQUIRED)
        }
        if (!validator.isString(Email)) {
            validationErrors.push(messages.VALIDATION_ERROR.EMAIL_REQUIRED)
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.language))
        }


        const salt = await bcrypt.genSalt(16)
        const hash = await bcrypt.hash(Password, salt)
        let useruuid = uuid()
        let adminRoleuuid = uuid()

        const t = await db.sequelize.transaction();
        try {
            const createadminRolePromise = db.roleModel.create({
                Uuid: adminRoleuuid,
                Name: "Admin",
                Createduser: "System",
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })

            const createadminRoleprivelegesPromise = db.roleprivilegeModel.create({
                RoleID: adminRoleuuid,
                PrivilegeID: "admin"
            }, { transaction: t })

            const createUserPromise = db.userModel.create({
                Uuid: useruuid,
                NormalizedUsername: Username.toUpperCase(),
                Name: "",
                Surname: "",
                EmailConfirmed: false,
                PhoneNumber: "",
                PhoneNumberConfirmed: false,
                AccessFailedCount: 0,
                Town: "",
                City: "",
                Address: "",
                Language: "en",
                UserID: 0,
                Defaultdepartment: "",
                PasswordHash: hash,
                Createduser: "System",
                Createtime: new Date(),
                Isactive: true,
                ...req.body
            }, { transaction: t })

            const createUserSaltPromise = db.usersaltModel.create({
                UserID: useruuid,
                Salt: salt
            }, { transaction: t })

            const createUserrolePromise = db.userroleModel.create({
                UserID: useruuid,
                RoleID: adminRoleuuid
            }, { transaction: t })

            await Promise.all([createadminRolePromise, createadminRoleprivelegesPromise,
                createUserPromise, createUserSaltPromise, createUserrolePromise])
            await t.commit()


            res.status(200).json({
                messages: "Admin User Created Successfully"
            })
        } catch (error) {
            await t.rollback()
            next(sequelizeErrorCatcher(error))
        }
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }

}

async function GetUsers(req, res, next) {
    try {
        const users = await db.userModel.findAll({ where: { Isactive: true } })
        for (const user of users) {
            user.Roleuuids = await db.userroleModel.findAll({
                where: {
                    UserID: user.Uuid
                },
                attributes: ['RoleID']
            })
            user.Departmentuuids = await db.userdepartmentModel.findAll({
                where: {
                    UserID: user.Uuid,
                },
                attributes: ['DepartmentID']
            });
            user.Stationuuids = await db.userstationModel.findAll({
                where: {
                    UserID: user.Uuid
                },
                attributes: ['StationID']
            })
            try {
                const fileresponse = await axios({
                    method: 'GET',
                    url: config.services.File + `Files/GetbyparentID/${user.Uuid}`,
                    headers: {
                        session_key: config.session.secret
                    }
                })
                user.Files = fileresponse.data
            } catch (error) {
                return next(requestErrorCatcher(error, 'Setting'))
            }
        }
        users.forEach(element => {
            element.PasswordHash && delete element.PasswordHash
        });
        res.status(200).json(users)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function GetUserscount(req, res, next) {
    try {
        const users = await db.userModel.count()
        res.status(200).json(users)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetUser(req, res, next) {

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
    try {
        const user = await db.userModel.findOne({ where: { Uuid: req.params.userId } })
        if (!user) {
            return next(createNotfounderror([messages.ERROR.USER_NOT_FOUND], req.language))
        }
        if (!user.Isactive) {
            return next(createNotfounderror([messages.ERROR.USER_NOT_ACTIVE], req.language))
        }
        try {
            const fileresponse = await axios({
                method: 'GET',
                url: config.services.File + `Files/GetbyparentID/${user.Uuid}`,
                headers: {
                    session_key: config.session.secret
                }
            })
            user.Files = fileresponse.data
        } catch (error) {
            next(requestErrorCatcher(error, 'File'))
        }
        user.Roleuuids = await db.userroleModel.findAll({
            where: {
                UserID: user.Uuid
            },
            attributes: ['RoleID']
        })
        user.Departmentuuids = await db.userdepartmentModel.findAll({
            where: {
                UserID: user.Uuid,
            },
            attributes: ['DepartmentID']
        });
        user.Stationuuids = await db.userstationModel.findAll({
            where: {
                UserID: user.Uuid
            },
            attributes: ['StationID']
        })

        user.PasswordHash && delete user.PasswordHash
        res.status(200).json(user)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function Getbyusername(req, res, next) {

    let validationErrors = []
    if (req.params.username === undefined) {
        validationErrors.push(messages.VALIDATION_ERROR.USERNAME_REQUIRED)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    try {
        const user = await db.userModel.findOne({ where: { Username: req.params.username } })
        if (!user) {
            return next(createNotfounderror([messages.ERROR.USER_NOT_FOUND], req.language))
        }
        if (!user.Isactive) {
            return next(createNotfounderror([messages.ERROR.USER_NOT_ACTIVE], req.language))
        }
        res.status(200).json(user)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function Getbyemail(req, res, next) {

    let validationErrors = []
    if (req.params.email === undefined) {
        validationErrors.push(messages.VALIDATION_ERROR.EMAIL_REQUIRED)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    try {
        const user = await db.userModel.findOne({ where: { Email: req.params.email } })
        if (!user) {
            return next(createNotfounderror([messages.ERROR.USER_NOT_FOUND], req.language))
        }
        if (!user.Isactive) {
            return next(createNotfounderror([messages.ERROR.USER_NOT_ACTIVE], req.language))
        }
        res.status(200).json(user)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function Getusersalt(req, res, next) {

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
    try {
        const usersalt = await db.usersaltModel.findOne({ where: { UserID: req.params.userId } })
        if (!usersalt) {
            return next(createNotfounderror([messages.ERROR.USERSALT_NOT_FOUND], req.language))
        }
        res.status(200).json(usersalt)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function Getusertablemetaconfig(req, res, next) {

    if (!req.identity.user) {
        return next(createNotfounderror([messages.ERROR.USER_NOT_FOUND], req.language))
    }
    try {
        const tablemetaconfigs = await db.tablemetaconfigModel.findAll({ where: { UserID: req.identity.user.Uuid } })
        if (!tablemetaconfigs) {
            return next(createNotfounderror([messages.ERROR.TABLEMETA_NOT_FOUND], req.language))
        }
        res.status(200).json(tablemetaconfigs)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function Saveusertablemetaconfig(req, res, next) {

    let validationErrors = []
    const {
        Meta,
        Config,
    } = req.body

    if (validator.isString(Meta)) {
        validationErrors.push(messages.VALIDATION_ERROR.META_REQUIRED)
    }
    if (validator.isString(Config)) {
        validationErrors.push(messages.VALIDATION_ERROR.CONFIG_REQUIRED)
    }
    try {
        const tablemetaconfig = await db.tablemetaconfigModel.findOne({ where: { UserID: req.identity.user.Uuid, Meta: Meta } })
        if (!tablemetaconfig) {
            await db.tablemetaconfigModel.create({
                ...req.body,
                UserID: req.identity.user.Uuid
            })
        } else {
            await db.tablemetaconfigModel.update({
                ...req.body,
            }, { where: { Id: tablemetaconfig.Id } })
        }
        const tablemetaconfigs = await db.tablemetaconfigModel.findAll({ where: { UserID: req.identity.user.Uuid } })
        if (!tablemetaconfigs) {
            return next(createNotfounderror([messages.ERROR.TABLEMETA_NOT_FOUND], req.language))
        }
        res.status(200).json(tablemetaconfigs)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function AddUser(req, res, next) {

    let validationErrors = []
    const {
        Username,
        Name,
        Surname,
        Language,
        Email,
        Password,
        Departments,
        Roles,
        Stations,
    } = req.body

    if (!validator.isString(Username)) {
        validationErrors.push(messages.VALIDATION_ERROR.USERNAME_REQUIRED)
    }
    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isString(Surname)) {
        validationErrors.push(messages.VALIDATION_ERROR.SURNAME_REQUIRED)
    }
    if (!validator.isString(Language)) {
        validationErrors.push(messages.VALIDATION_ERROR.LANGUAGE_REQUIRED)
    }
    if (!validator.isString(Password)) {
        validationErrors.push(messages.VALIDATION_ERROR.PASSWORD_REQUIRED)
    }
    if (!validator.isString(Email)) {
        validationErrors.push(messages.VALIDATION_ERROR.EMAIL_REQUIRED)
    }
    if (!validator.isArray(Departments)) {
        validationErrors.push(messages.VALIDATION_ERROR.DEPARTMENTS_REQUIRED)
    }
    if (!validator.isArray(Stations)) {
        validationErrors.push(messages.VALIDATION_ERROR.STATIONS_REQUIRED)
    }
    if (!validator.isArray(Roles)) {
        validationErrors.push(messages.VALIDATION_ERROR.ROLES_REQUIRED)
    }
    const usernamecheck = GetUserByUsername(next, Username)
        .then(user => {
            if (user && Object.keys(user).length > 0) {
                validationErrors.push(messages.VALIDATION_ERROR.USERNAME_DUPLICATE)
            }
        })
    const emailcheck = GetUserByEmail(next, Email)
        .then(user => {
            if (user && Object.keys(user).length > 0) {
                validationErrors.push(messages.VALIDATION_ERROR.EMAIL_DUPLICATE)
            }
        })
    await Promise.all([usernamecheck, emailcheck])
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const salt = await bcrypt.genSalt(16)
    const hash = await bcrypt.hash(Password, salt)
    let useruuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.userModel.create({
            Uuid: useruuid,
            NormalizedUsername: Username.toUpperCase(),
            EmailConfirmed: false,
            PhoneNumber: "",
            UserID: 0,
            PhoneNumberConfirmed: false,
            AccessFailedCount: 0,
            Defaultdepartment: "",
            PasswordHash: hash,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true,
            ...req.body,
        }, { transaction: t })

        await db.usersaltModel.create({
            UserID: useruuid,
            Salt: salt
        }, { transaction: t })
        for (const department of Departments) {
            if (!department.Uuid || !validator.isUUID(department.Uuid)) {
                return next(createValidationError(messages.VALIDATION_ERROR.UNSUPPORTED_DEPARTMENTID, req.language))
            }
            await db.userdepartmentModel.create({
                UserID: useruuid,
                DepartmentID: department.Uuid
            }, { transaction: t });
        }
        for (const role of Roles) {
            if (!role.Uuid || !validator.isUUID(role.Uuid)) {
                return next(createValidationError(messages.VALIDATION_ERROR.UNSUPPORTED_ROLEID, req.language))
            }
            await db.userroleModel.create({
                UserID: useruuid,
                RoleID: role.Uuid
            }, { transaction: t });
        }
        for (const station of Stations) {
            if (!station.Uuid || !validator.isUUID(station.Uuid)) {
                return next(createValidationError(messages.VALIDATION_ERROR.UNSUPPORTED_STATIONID, req.language))
            }
            await db.userstationModel.create({
                UserID: useruuid,
                StationID: station.Uuid
            }, { transaction: t });
        }
        await t.commit()
    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
    GetUsers(req, res, next)
}

async function UpdateUser(req, res, next) {

    let validationErrors = []
    const {
        Uuid,
        Username,
        Language,
        Email,
        Departments,
        Roles,
        Stations
    } = req.body

    if (!validator.isString(Username)) {
        validationErrors.push(messages.VALIDATION_ERROR.USERNAME_REQUIRED)
    }
    if (!validator.isString(Language)) {
        validationErrors.push(messages.VALIDATION_ERROR.LANGUAGE_REQUIRED)
    }
    if (!validator.isString(Email)) {
        validationErrors.push(messages.VALIDATION_ERROR.EMAIL_REQUIRED)
    }
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
    try {
        const user = await db.userModel.findOne({ where: { Uuid: Uuid } })
        if (!user) {
            return next(createNotfounderror([messages.ERROR.USER_NOT_FOUND], req.language))
        }
        if (!user.Isactive) {
            return next(createNotfounderror([messages.ERROR.USER_NOT_ACTIVE], req.language))
        }

        await db.userModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })
        await db.userdepartmentModel.destroy({ where: { UserID: Uuid }, transaction: t });
        await db.userroleModel.destroy({ where: { UserID: Uuid }, transaction: t });
        await db.userstationModel.destroy({ where: { UserID: Uuid }, transaction: t });
        for (const department of Departments) {
            if (!department.Uuid || !validator.isUUID(department.Uuid)) {
                return next(createValidationError(messages.VALIDATION_ERROR.UNSUPPORTED_DEPARTMENTID, req.language))
            }
            await db.userdepartmentModel.create({
                UserID: Uuid,
                DepartmentID: department.Uuid
            }, { transaction: t });
        }
        for (const role of Roles) {
            if (!role.Uuid || !validator.isUUID(role.Uuid)) {
                return next(createValidationError(messages.VALIDATION_ERROR.UNSUPPORTED_ROLEID, req.language))
            }
            await db.userroleModel.create({
                UserID: Uuid,
                RoleID: role.Uuid
            }, { transaction: t });
        }
        for (const station of Stations) {
            if (!station.Uuid || !validator.isUUID(station.Uuid)) {
                return next(createValidationError(messages.VALIDATION_ERROR.UNSUPPORTED_STATIONID, req.language))
            }
            await db.userstationModel.create({
                UserID: Uuid,
                StationID: station.Uuid
            }, { transaction: t });
        }
        await t.commit()
    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
    GetUsers(req, res, next)
}

async function DeleteUser(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.userId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.USERID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_USERID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const user = await db.userModel.findOne({ where: { Uuid: Uuid } })
        if (!user) {
            return next(createNotfounderror([messages.ERROR.USER_NOT_FOUND], req.language))
        }
        if (!user.Isactive) {
            return next(createNotfounderror([messages.ERROR.USER_NOT_ACTIVE], req.language))
        }
        const t = await db.sequelize.transaction();

        //await db.userModel.destroy({ where: { uuid: Uuid }, transaction: t });
        //await db.usersaltModel.destroy({ where: { Userid: Uuid }, transaction: t });
        //await db.userroleModel.destroy({ where: { UserID: Uuid }, transaction: t });
        await db.userModel.update({
            Updateduser: "System",
            Updatetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid } }, { transaction: t })
        await t.commit();
    } catch (error) {
        await t.rollback();
        next(sequelizeErrorCatcher(error))
    }
    GetUsers(req, res, next)
}

async function GetActiveUsername(req, res, next) {
    if (!req.identity.user) {
        return next(createNotfounderror([messages.ERROR.USER_NOT_FOUND], req.language))
    }
    res.status(200)
    return res.send(req.identity.user.Username)
}

async function GetActiveUserMeta(req, res, next) {
    if (!req.identity.user) {
        return next(createNotfounderror([messages.ERROR.USER_NOT_FOUND], req.language))
    }
    res.status(200)
    return res.send(req.identity.user)
}

async function Resettablemeta(req, res, next) {
    const key = req.params.metaKey
    if (!req.identity.user) {
        return next(createNotfounderror([messages.ERROR.USER_NOT_FOUND], req.language))
    }
    try {
        await db.tablemetaconfigModel.destroy({ where: { Meta: key, UserID: req.identity.user.Uuid } })
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    Getusertablemetaconfig(req, res, next)
}

async function Changepassword(req, res, next) {
    let validationErrors = []
    const {
        Oldpassword,
        Newpassword,
        Newpasswordre,
    } = req.body

    if (!validator.isString(Newpassword)) {
        validationErrors.push(messages.VALIDATION_ERROR.NEWPASSWORD_REQUIRED)
    }
    if (!validator.isString(Newpasswordre)) {
        validationErrors.push(messages.VALIDATION_ERROR.NEWPASSWORD_REQUIRED)
    }
    if (!validator.isString(Oldpassword)) {
        validationErrors.push(messages.VALIDATION_ERROR.OLDPASSWORD_REQUIRED)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    if (Newpassword !== Newpasswordre) {
        return next(createNotfounderror([messages.VALIDATION_ERROR.PASSWORD_DIDNT_MATCH], req.language))
    }

    let newSalt = ""
    let usersalt = null
    try {
        usersalt = await db.usersaltModel.findOne({ where: { UserID: req.identity?.user?.Uuid } })
        if (!usersalt) {
            return next(createNotfounderror([messages.ERROR.USERSALT_NOT_FOUND], req.language))
        }
        if (!ValidatePassword(Oldpassword, req.identity?.user?.PasswordHash, usersalt.Salt)) {
            return next(createValidationError([messages.VALIDATION_ERROR.OLDPASSWORD_DIDNT_MATCH], req.language))
        }
        newSalt = await bcrypt.genSalt(16)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    const t = await db.sequelize.transaction();
    try {
        const hash = await bcrypt.hash(Newpassword, newSalt)
        await db.userModel.update({
            ...req.identity?.user,
            PasswordHash: hash,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: req.identity?.user?.Uuid } }, { transaction: t })
        await db.usersaltModel.update({
            ...usersalt,
            Salt: newSalt,
        }, { where: { UserID: req.identity?.user?.Uuid } }, { transaction: t })
        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    res.status(200).json({
        messages: "Password changed Successfully"
    })
}

async function UpdateUsermeta(req, res, next) {

    let validationErrors = []
    const {
        Uuid,
    } = req.body

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
    try {
        const user = await db.userModel.findOne({ where: { Uuid: Uuid } })
        if (!user) {
            return next(createNotfounderror([messages.ERROR.USER_NOT_FOUND], req.language))
        }
        if (!user.Isactive) {
            return next(createNotfounderror([messages.ERROR.USER_NOT_ACTIVE], req.language))
        }

        await db.userModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await t.commit()
    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
    GetUsers(req, res, next)
}

function GetUserByEmail(next, Email, language) {
    return new Promise((resolve, reject) => {
        db.userModel.findOne({ where: { Email: Email } })
            .then(user => {
                resolve(user)
            })
            .catch(err => sequelizeErrorCatcher(err))
            .catch(next)
    })
}

function GetUserByUsername(next, Username, language) {
    return new Promise((resolve, reject) => {
        db.userModel.findOne({ where: { Username: Username } })
            .then(user => {
                resolve(user)
            })
            .catch(err => sequelizeErrorCatcher(err))
            .catch(next)
    })
}

async function ValidatePassword(UserPassword, DbPassword, salt) {
    try {
        let hash = bcrypt.hash(UserPassword, salt)
        if (hash === DbPassword) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

module.exports = {
    GetUsers,
    GetUser,
    AddUser,
    UpdateUser,
    DeleteUser,
    Register,
    Getbyusername,
    Getusersalt,
    GetActiveUsername,
    GetActiveUserMeta,
    Getusertablemetaconfig,
    Saveusertablemetaconfig,
    Getbyemail,
    Resettablemeta,
    GetUserscount,
    Changepassword,
    UpdateUsermeta
}