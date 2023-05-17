const messages = require('../Constants/Messages')
const createValidationError = require('../Utilities/Error').createValidation
const crypto = require('crypto')
const uuid = require('uuid').v4
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const priveleges = require('../Constants/Privileges')
const createNotfounderror = require("../Utilities/Error").createNotfounderror

function Login(req, res, next) {
    let validationErrors = []
    let grantType = req.body.grant_type || req.body.grantType || req.query.grant_type || req.query.grantType

    if (!grantType) {
        validationErrors.push(messages.VALIDATION_ERROR.GRANT_TYPE_REQUIRED)
    }

    switch (grantType) {
        case 'password': return responseToGetTokenByGrantPassword(req, res, next)
        case 'refresh_token': return responseToGetTokenByRefreshToken(req, res, next)
        default: validationErrors.push(messages.VALIDATION_ERROR.INVALID_GRANT_TYPE)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
}

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
        if (Username === undefined) {
            validationErrors.push(messages.VALIDATION_ERROR.USERNAME_REQUIRED, req.language)
        }
        if (Password === undefined) {
            validationErrors.push(messages.VALIDATION_ERROR.PASSWORD_REQUIRED, req.language)
        }
        if (Email === undefined) {
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
            next(err)
        }

    } catch (error) {

    }

}

async function responseToGetTokenByGrantPassword(req, res, next) {
    let validationErrors = []

    if (!req.body.Username) {
        validationErrors.push(messages.VALIDATION_ERROR.USERNAME_IS_REQUIRED)
    }

    if (!req.body.Password) {
        validationErrors.push(messages.VALIDATION_ERROR.PASSWORD_IS_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const user = await db.userModel.findOne({ where: { Username: req.body.Username } });
    if (!user) {
        return next(createNotfounderror([messages.ERROR.USER_NOT_FOUND], req.language))
    }
    const userSalt = await db.usersaltModel.findOne({ where: { UserID: user.Uuid } })
    if (!userSalt) {
        return next(createNotfounderror([messages.ERROR.USERSALT_NOT_FOUND], req.language))
    }

    if (!await ValidatePassword(req.body.Password, user.PasswordHash, userSalt.Salt)) {
        return next(createNotfounderror([messages.ERROR.PASSWORD_DIDNT_MATCH], req.language))
    }

    let accessToken = {
        token_type: 'bearer',
        accessToken: uuid(),
        refreshToken: uuid(),
        ExpiresAt: new Date(new Date().getTime() + 5 * 60000),
    }


    try {
        await db.accesstokenModel.destroy({ where: { Userid: user.Uuid } })

        await db.accesstokenModel.create({
            Userid: user.Uuid,
            Accesstoken: accessToken.accessToken,
            Refreshtoken: accessToken.refreshToken,
            ExpiresAt: accessToken.ExpiresAt,
            Createduser: "System",
            Createtime: new Date(),
            Updateduser: null,
            Updatetime: null,
            Deleteduser: null,
            Deletetime: null,
            Isactive: true
        })
    } catch (err) {
        sequelizeErrorCatcher(err)
        next()
    }

    res.status(200).json(accessToken)
}

async function responseToGetTokenByRefreshToken(req, res, next) {
    let validationErrors = []

    if (!req.body.refreshToken) {
        validationErrors.push(messages.VALIDATION_ERROR.REFRESH_TOKEN_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const token = await db.accesstokenModel.findOne({ where: { Refreshtoken: req.body.refreshToken } });
    if (!token) {
        return next(createNotfounderror([messages.ERROR.REFRESH_TOKEN_NOT_FOUND], req.language))
    }

    if (token.ExpiresAt <= new Date()) {
        return next(createValidationError([messages.ERROR.REFRESH_TOKEN_EXPIRED], req.language))
    }

    const user = await db.userModel.findOne({ where: { Uuid: token.Userid } });
    if (!user) {
        return next(createNotfounderror([messages.ERROR.USER_NOT_FOUND], req.language))
    }

    let accessToken = {
        token_type: 'bearer',
        accessToken: uuid(),
        refreshToken: uuid(),
        ExpiresAt: new Date(new Date().getTime() + 0 * 60000),
    }

    try {
        await db.accesstokenModel.destroy({ where: { Userid: user.Uuid } })

        await db.accesstokenModel.create({
            Userid: user.Uuid,
            Accesstoken: accessToken.accessToken,
            Refreshtoken: accessToken.refreshToken,
            ExpiresAt: accessToken.ExpiresAt,
            Createduser: "System",
            Createtime: new Date(),
            Updateduser: null,
            Updatetime: null,
            Deleteduser: null,
            Deletetime: null,
            Isactive: true
        })
    } catch (err) {
        sequelizeErrorCatcher(err)
        next()
    }

    res.status(200).json(accessToken)
}

async function ValidatePassword(UserPassword, DbPassword, salt) {
    try {
        let hash = crypto.pbkdf2Sync(UserPassword, salt, 1000, 64, 'sha512').toString('hex');
        if (hash === DbPassword) {
            return true
        } else {
            return false
        }
    } catch (error) {
        sequelizeErrorCatcher(error)
        return false
    }
}



module.exports = {
    Login,
    Register
}