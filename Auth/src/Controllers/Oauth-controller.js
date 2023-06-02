const messages = require('../Constants/Messages')
const createValidationError = require('../Utilities/Error').createValidation
const crypto = require('crypto')
const uuid = require('uuid').v4
const { sequelizeErrorCatcher, createAccessDenied, createAutherror, requestErrorCatcher,createNotfounderror } = require("../Utilities/Error")
const priveleges = require('../Constants/Privileges')
const axios = require('axios')
const config = require('../Config')

function Testserver(req, res, next) {
    res.status(200).json({ message: "success" })
}

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

async function ValidateToken(req, res, next) {
    let validationErrors = []
    let accessToken = {}
    let bearerToken = req.body.accessToken || req.body.accessToken || req.query.accessToken || req.query.accessToken

    if (!bearerToken) {
        validationErrors.push(messages.ERROR.ACCESS_TOKEN_NOT_FOUND)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    accessToken = await db.accesstokenModel.findOne({ where: { Accesstoken: bearerToken, Isactive: true } })
    if (!accessToken) {
        return next(createAutherror(messages.ERROR.ACCESS_TOKEN_NOT_FOUND, req.language))
    }
    if (accessToken.ExpiresAt <= new Date()) {
        return next(createAutherror(messages.ERROR.ACCESS_TOKEN_INVALID, req.language))
    }
    return res.status(200).json(accessToken)
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
    let user = null
    let usersalt = null
    try {
        const userresponse = await axios({
            method: 'GET',
            url: config.services.Userrole + `Users/Getbyusername/${req.body.Username}`,
            headers: {
                session_key: config.session.secret
            }
        })
        user = userresponse.data
    } catch (error) {
        return next(requestErrorCatcher(error, "USERROLE"))
    }
    try {
        const usersaltreponse = await axios({
            method: 'GET',
            url: config.services.Userrole + `Users/Getusersalt/${user.Uuid}`,
            headers: {
                session_key: config.session.secret
            }
        })
        usersalt = usersaltreponse.data
    } catch (error) {
        return next(requestErrorCatcher(error, "USERROLE"))
    }

    if (!await ValidatePassword(req.body.Password, user.PasswordHash, usersalt.Salt)) {
        return next(createAutherror([messages.ERROR.PASSWORD_DIDNT_MATCH], req.language))
    }

    let accessToken = {
        token_type: 'bearer',
        accessToken: uuid(),
        refreshToken: uuid(),
        ExpiresAt: new Date(new Date().getTime() + 15 * 60000),
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

    res.cookie("patientcare", accessToken.accessToken, {
        httpOnly: false,
        secure: false,
    }).status(200).json(accessToken)
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
    const user = null
    try {
        user = await axios({
            method: 'GET',
            url: config.services.Userrole + `Users/${token.Userid}`,
            headers: {
                session_key: config.session.secret
            }
        })
    } catch (error) {
        return requestErrorCatcher(error, "USERROLE")
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
    ValidateToken,
    Testserver,
}