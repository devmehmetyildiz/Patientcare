const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const crypto = require('crypto')


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
        if (validator.isString(Username)) {
            validationErrors.push(messages.VALIDATION_ERROR.USERNAME_REQUIRED, req.language)
        }
        if (validator.isString(Password)) {
            validationErrors.push(messages.VALIDATION_ERROR.PASSWORD_REQUIRED, req.language)
        }
        if (validator.isString(Email)) {
            validationErrors.push(messages.VALIDATION_ERROR.EMAIL_REQUIRED, req.language)
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.language))
        }

        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(Password, salt, 1000, 64, 'sha512').toString('hex');
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
        } catch (err) {
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
        users.forEach(element => {
            element.PasswordHash && delete element.PasswordHash
        });
        res.status(200).json(users)
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

async function AddUser(req, res, next) {

    let validationErrors = []
    const {
        Username,
        Email,
        Password,
    } = req.body

    if (validator.isString(Username)) {
        validationErrors.push(messages.VALIDATION_ERROR.USERNAME_REQUIRED, req.language)
    }
    if (validator.isString(Password)) {
        validationErrors.push(messages.VALIDATION_ERROR.PASSWORD_REQUIRED, req.language)
    }
    if (validator.isString(Email)) {
        validationErrors.push(messages.VALIDATION_ERROR.EMAIL_REQUIRED, req.language)
    }
    const usernamecheck = GetUserByUsername(next, Username, req.language)
        .then(user => {
            if (user && Object.keys(user).length > 0) {
                validationErrors.push(messages.VALIDATION_ERROR.USERNAME_DUPLICATE, req.language)
            }
        })
    const emailcheck = GetUserByEmail(next, Email, req.language)
        .then(user => {
            if (user && Object.keys(user).length > 0) {
                validationErrors.push(messages.VALIDATION_ERROR.EMAIL_DUPLICATE, req.language)
            }
        })
    await Promise.all([usernamecheck, emailcheck])
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(Password, salt, 1000, 64, 'sha512').toString('hex');
    let useruuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.userModel.create({
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
            ...req.body,
        }, { transaction: t })

        await db.usersaltModel.create({
            UserID: useruuid,
            Salt: salt
        }, { transaction: t })

        await t.commit()
        const users = await db.userModel.findAll({ where: { Isactive: true } })
        users.forEach(element => {
            element.PasswordHash && delete element.PasswordHash
        });
        res.status(200).json(users)
    } catch (err) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }

}

async function UpdateUser(req, res, next) {

    let validationErrors = []
    const {
        Uuid
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.USERID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_USERID, req.language)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const user = db.userModel.findOne({ where: { Uuid: Uuid } })
        if (!user) {
            return next(createNotfounderror([messages.ERROR.USER_NOT_FOUND], req.language))
        }
        if (!user.Isactive) {
            return next(createNotfounderror([messages.ERROR.USER_NOT_ACTIVE], req.language))
        }

        let data = { ...req.body }
        data.PasswordHash && delete data.PasswordHash
        data.Username && delete data.Username
        data.NormalizedUsername && delete data.NormalizedUsername
        data.Uuid && delete data.Uuid

        const t = await db.sequelize.transaction();

        await db.userModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await t.commit()
        const users = await db.userModel.findAll({ where: { Isactive: true } })
        users.forEach(element => {
            element.PasswordHash && delete element.PasswordHash
        });
        res.status(200).json(users)
    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }

}

async function DeleteUser(req, res, next) {

    let validationErrors = []
    const {
        Uuid
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.USERID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_USERID, req.language)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const user = db.userModel.findOne({ where: { Uuid: Uuid } })
        if (!user) {
            return next(createNotfounderror([messages.ERROR.USER_NOT_FOUND], req.language))
        }
        if (!user.Isactive) {
            return next(createNotfounderror([messages.ERROR.USER_NOT_ACTIVE], req.language))
        }
        const t = await db.sequelize.transaction();

        await db.userModel.destroy({ where: { uuid: Uuid }, transaction: t });
        await db.usersaltModel.destroy({ where: { Userid: Uuid }, transaction: t });
        await t.commit();
        const users = await db.userModel.findAll({ where: { Isactive: true } })
        users.forEach(element => {
            element.PasswordHash && delete element.PasswordHash
        });
        res.status(200).json(users)
    } catch (error) {
        await t.rollback();
        next(sequelizeErrorCatcher(error))
    }
}

async function GetActiveUsername(req, res, next) {
    console.log('req: ', req);
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
    GetActiveUserMeta
}