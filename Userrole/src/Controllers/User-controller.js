const messages = require("../Constants/UserMessages")
const { sequelizeErrorCatcher, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const bcrypt = require('bcrypt')
const CreateNotification = require("../Utilities/CreateNotification")
const { types } = require("../Constants/Defines")
const { usermovementypes } = require("../Constants/Usermovementypes")

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
                Username: Username,
                Email: Email,
                Uuid: useruuid,
                Name: "Admin",
                Surname: "Sys",
                Language: "tr",
                PasswordHash: hash,
                Createduser: "System",
                Createtime: new Date(),
                Isactive: true,
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
        let data = null
        const users = await db.userModel.findAll({ where: { Isactive: true } })
        for (const user of users) {
            user.Roleuuids = await db.userroleModel.findAll({
                where: {
                    UserID: user.Uuid
                },
                attributes: ['RoleID']
            })
            user.Movements = await db.usermovementModel.findAll({
                where: {
                    MovementuserID: user?.Uuid,
                    Isactive: true
                },
                order: [['Occureddate', 'ASC']]
            });
        }
        users.forEach(element => {
            element.PasswordHash && delete element.PasswordHash
        });
        if (req?.Uuid) {
            data = await db.userModel.findOne({ where: { Uuid: req?.Uuid } });
        }
        res.status(200).json({ list: users, data: data })
    } catch (error) {
        next(sequelizeErrorCatcher(error))
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
        user.Roleuuids = await db.userroleModel.findAll({
            where: {
                UserID: user.Uuid
            },
            attributes: ['RoleID']
        })
        user.Movements = await db.usermovementModel.findAll({
            where: {
                MovementuserID: user?.Uuid,
                Isactive: true
            },
            order: [['Occureddate', 'ASC']]
        });
        user.PasswordHash && delete user.PasswordHash
        res.status(200).json(user)
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
        Roles,
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
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.userModel.create({
            ...req.body,
            Uuid: useruuid,
            PasswordHash: hash,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true,
        }, { transaction: t })

        await db.usersaltModel.create({
            UserID: useruuid,
            Salt: salt
        }, { transaction: t })
        for (const role of Roles) {
            if (!role.Uuid || !validator.isUUID(role.Uuid)) {
                return next(createValidationError([messages.VALIDATION_ERROR.UNSUPPORTED_ROLEID], req.language))
            }
            await db.userroleModel.create({
                UserID: useruuid,
                RoleID: role.Uuid
            }, { transaction: t });
        }

        await CreateNotification({
            type: types.Create,
            service: 'Kullanıcılar',
            role: 'usernotification',
            message: `${Username} kullanıcısı ${username} tarafından Oluşturuldu.`,
            pushurl: '/Users'
        })
        await t.commit()
    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
    req.Uuid = useruuid
    GetUsers(req, res, next)
}

async function UpdateUser(req, res, next) {

    let validationErrors = []
    const {
        Uuid,
        Username,
        Language,
        Email,
        Roles,
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
    const username = req?.identity?.user?.Username || 'System'

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
            Username: user?.Username,
            PasswordHash: user?.PasswordHash,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.userroleModel.destroy({ where: { UserID: Uuid }, transaction: t });

        for (const role of Roles) {
            if (!role.Uuid || !validator.isUUID(role.Uuid)) {
                return next(createValidationError(messages.VALIDATION_ERROR.UNSUPPORTED_ROLEID, req.language))
            }
            await db.userroleModel.create({
                UserID: Uuid,
                RoleID: role.Uuid
            }, { transaction: t });
        }

        await CreateNotification({
            type: types.Update,
            service: 'Kullanıcılar',
            role: 'usernotification',
            message: `${Username} kullanıcısı ${username} tarafından Güncellendi.`,
            pushurl: '/Users'
        })
        await t.commit()
    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
    req.Uuid = Uuid
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

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const user = await db.userModel.findOne({ where: { Uuid: Uuid } })
        if (!user) {
            return next(createNotfounderror([messages.ERROR.USER_NOT_FOUND], req.language))
        }
        if (!user.Isactive) {
            return next(createNotfounderror([messages.ERROR.USER_NOT_ACTIVE], req.language))
        }

        await db.userModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: 'Kullanıcılar',
            role: 'usernotification',
            message: `${user?.Username} kullanıcısı ${username} tarafından Silindi.`,
            pushurl: '/Users'
        })
        await t.commit();

    } catch (error) {
        await t.rollback();
        next(sequelizeErrorCatcher(error))
    }
    GetUsers(req, res, next)
}

async function DeleteUsermovement(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.usermovementId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.USERMOVEMENTID_REQUIRED)
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
        const usermovement = await db.usermovementModel.findOne({ where: { Uuid: Uuid } })
        if (!usermovement) {
            return next(createNotfounderror([messages.ERROR.USERMOVEMENT_NOT_FOUND], req.language))
        }
        if (usermovement.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.USERMOVEMENT_NOT_ACTIVE], req.language))
        }

        await db.usermovementModel.update({
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        const user = await db.userModel.findOne({ where: { Uuid: usermovement?.MovementuserID } })

        await CreateNotification({
            type: types.Delete,
            service: 'Kullanıcılar',
            role: 'usernotification',
            message: `${user?.Name} ${user?.Surname} kullanıcısına ait hareket ${username} tarafından silindi.`,
            pushurl: '/Users'
        })
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetUsers(req, res, next)
}

async function UpdateUsermovement(req, res, next) {

    let validationErrors = []
    const {
        Uuid,
        Occureddate
    } = req.body


    if (!validator.isISODate(Occureddate)) {
        validationErrors.push(messages.VALIDATION_ERROR.OCCUREDDATE_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.USERMOVEMENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_USERMOVEMENTID)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const usermovement = await db.usermovementModel.findOne({ where: { Uuid: Uuid } })
        if (!usermovement) {
            return next(createNotfounderror([messages.ERROR.USERMOVEMENT_NOT_FOUND], req.language))
        }
        if (usermovement.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.USERMOVEMENT_NOT_ACTIVE], req.language))
        }

        await db.usermovementModel.update({
            Occureddate: Occureddate,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        const user = await db.userModel.findOne({ where: { Uuid: usermovement?.MovementuserID } })

        await CreateNotification({
            type: types.Update,
            service: 'Kullanıcılar',
            role: 'usernotification',
            message: `${user?.Name} ${user?.Surname} kullanıcısına ait hareket ${username} tarafından güncellendi.`,
            pushurl: '/Users'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    req.Uuid = Uuid
    GetUsers(req, res, next)
}

async function UpdateUsercase(req, res, next) {

    let validationErrors = []
    const {
        UserID,
        CaseID,
        Occureddate,
        Occuredenddate,
        Ispastdate
    } = req.body

    if (!validator.isUUID(UserID)) {
        validationErrors.push(messages.VALIDATION_ERROR.USERID_REQUIRED)
    }
    if (!validator.isUUID(CaseID)) {
        validationErrors.push(messages.VALIDATION_ERROR.CASEID_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {

        const user = await db.userModel.findOne({ where: { Uuid: UserID } })
        if (!user) {
            return next(createNotfounderror([messages.ERROR.USER_NOT_FOUND], req.language))
        }
        if (!user.Isactive) {
            return next(createNotfounderror([messages.ERROR.USER_NOT_ACTIVE], req.language))
        }

        if (!Ispastdate) {
            await db.userModel.update({
                ...user,
                CaseID: CaseID,
                Updateduser: username,
                Updatetime: new Date(),
            }, { where: { Uuid: UserID }, transaction: t })
        }

        if (validator.isISODate(Occureddate)) {
            const usermovements = await db.usermovementModel.findAll({
                where: {
                    MovementuserID: user?.Uuid,
                    Isactive: true,
                    Occureddate: {
                        [Sequelize.Op.gte]: Occureddate
                    }
                },
                order: [['Occureddate', 'ASC']]
            });

            if ((usermovements || []).length > 0) {

                const isHaveenddate = validator.isISODate(Occuredenddate)
                if (!isHaveenddate) {
                    return next(createAccessDenied([messages.VALIDATION_ERROR.MOVEMENT_END_DATE_REQUIRED], req.language))
                }

                const nextmovement = usermovements[0]

                const isEnddatelowerthanfirstmovement = Checkdatelowerthanother(Occuredenddate, usermovements[0]?.Occureddate)
                if (!isEnddatelowerthanfirstmovement) {
                    return next(createAccessDenied([messages.VALIDATION_ERROR.MOVEMENT_END_DATE_TOO_BIG], req.language))
                }

                if (isEnddatelowerthanfirstmovement) {
                    await db.usermovementModel.update({
                        Occureddate: Occuredenddate,
                        Updateduser: username,
                        Updatetime: new Date(),
                    }, { where: { Uuid: nextmovement?.Uuid || '' }, transaction: t })
                }
            }
        }

        await db.usermovementModel.create({
            Uuid: uuid(),
            MovementuserID: UserID,
            CaseID: CaseID,
            Type: usermovementypes.Usercasechange,
            UserID: req?.identity?.user?.Uuid || username,
            Info: '',
            Occureddate: Occureddate,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Kullanıcılar',
            role: 'usernotification',
            message: `${user?.Name} ${user?.Surname} personel durumu ${username} tarafından güncellendi.`,
            pushurl: '/Users'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetUsers(req, res, next)
}

async function GetUsersforshift(req, res, next) {
    try {
        const {
            ProfessionID,
        } = req.body

        const users = await db.userModel.findAll({
            where: {
                Isactive: true,
                Includeshift: true,
                ProfessionID: ProfessionID,
                Workendtime: null
            }
        })
        for (const user of users) {
            user.Roleuuids = await db.userroleModel.findAll({
                where: {
                    UserID: user.Uuid
                },
                attributes: ['RoleID']
            })
        }
        users.forEach(element => {
            element.PasswordHash && delete element.PasswordHash
        });
        res.status(200).json(users)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

function GetUserByEmail(next, Email, language) {
    return new Promise((resolve, reject) => {
        db.userModel.findOne({ where: { Email: Email, Isactive: true } })
            .then(user => {
                resolve(user)
            })
            .catch(err => sequelizeErrorCatcher(err))
            .catch(next)
    })
}

function GetUserByUsername(next, Username, language) {
    return new Promise((resolve, reject) => {
        db.userModel.findOne({ where: { Username: Username, Isactive: true } })
            .then(user => {
                resolve(user)
            })
            .catch(err => sequelizeErrorCatcher(err))
            .catch(next)
    })
}



module.exports = {
    GetUsers,
    GetUser,
    AddUser,
    UpdateUser,
    DeleteUser,
    Register,
    GetUsersforshift,
    UpdateUsercase,
    UpdateUsermovement,
    DeleteUsermovement
}