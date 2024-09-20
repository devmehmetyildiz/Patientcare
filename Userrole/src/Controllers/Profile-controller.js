const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const bcrypt = require('bcrypt')

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

async function Getuserbyemail(req, res, next) {

    let validationErrors = []
    if (req.params.email === undefined) {
        validationErrors.push(messages.VALIDATION_ERROR.EMAIL_REQUIRED)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    try {
        const user = await db.userModel.findOne({ where: { Email: req.params.email } })
        user.Roleuuids = await db.userroleModel.findAll({
            where: {
                UserID: user.Uuid
            },
            attributes: ['RoleID']
        })
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

async function Getuserbyusername(req, res, next) {

    let validationErrors = []
    if (req.params.username === undefined) {
        validationErrors.push(messages.VALIDATION_ERROR.USERNAME_REQUIRED)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    try {
        const user = await db.userModel.findOne({ where: { Username: req.params.username } })
        user.Roleuuids = await db.userroleModel.findAll({
            where: {
                UserID: user.Uuid
            },
            attributes: ['RoleID']
        })
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

async function Changepasswordbyrequest(req, res, next) {

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
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await t.commit()
        res.status(200).send('success')
    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
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
    const username = req?.identity?.user?.Username || 'System'

    try {
        const hash = await bcrypt.hash(Newpassword, newSalt)
        await db.userModel.update({
            ...req.identity?.user,
            PasswordHash: hash,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: req.identity?.user?.Uuid }, transaction: t })
        await db.usersaltModel.update({
            ...usersalt,
            Salt: newSalt,
        }, { where: { UserID: req.identity?.user?.Uuid }, transaction: t })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    res.status(200).json({
        messages: "Password changed Successfully"
    })
}

async function Getusername(req, res, next) {
    if (!req.identity?.user) {
        return next(createNotfounderror([messages.ERROR.USER_NOT_FOUND], req.language))
    }
    res.status(200)
    return res.send(req?.identity?.user?.Username || '')
}

async function Getmeta(req, res, next) {
    if (!req.identity?.user) {
        return next(createNotfounderror([messages.ERROR.USER_NOT_FOUND], req.language))
    }
    res.status(200)
    return res.send(req.identity.user)
}

async function Gettablemeta(req, res, next) {

    if (!req.identity.user) {
        return next(createNotfounderror([messages.ERROR.USER_NOT_FOUND], req.language))
    }
    try {
        const tablemetaconfigs = await db.tablemetaconfigModel.findAll({ where: { UserID: req?.identity?.user?.Uuid || '' } })
        if (!tablemetaconfigs) {
            return next(createNotfounderror([messages.ERROR.TABLEMETA_NOT_FOUND], req.language))
        }
        res.status(200).json(tablemetaconfigs)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function Resettablemeta(req, res, next) {
    const key = req?.params?.metaKey
    if (!req.identity?.user) {
        return next(createNotfounderror([messages.ERROR.USER_NOT_FOUND], req.language))
    }
    try {
        await db.tablemetaconfigModel.destroy({ where: { Meta: key, UserID: req?.identity?.user?.Uuid || '' } })
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    Gettablemeta(req, res, next)
}

async function Savetablemeta(req, res, next) {

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
        const tablemetaconfig = await db.tablemetaconfigModel.findOne({ where: { UserID: req?.identity?.user?.Uuid || '', Meta: Meta || '' } })
        if (!tablemetaconfig) {
            await db.tablemetaconfigModel.create({
                ...req.body,
                UserID: req?.identity?.user?.Uuid
            })
        } else {
            await db.tablemetaconfigModel.update({
                ...req.body,
            }, { where: { Id: tablemetaconfig.Id } })
        }
        const tablemetaconfigs = await db.tablemetaconfigModel.findAll({ where: { UserID: req?.identity?.user?.Uuid } })
        if (!tablemetaconfigs) {
            return next(createNotfounderror([messages.ERROR.TABLEMETA_NOT_FOUND], req.language))
        }
        res.status(200).json(tablemetaconfigs)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
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
    Getusername,
    Getmeta,
    Changepassword,
    Resettablemeta,
    Gettablemeta,
    Savetablemeta,
    Getuserbyusername,
    Getuserbyemail,
    Getusersalt,
    Changepasswordbyrequest
}