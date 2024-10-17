const createValidationError = require('../Utilities/Error').createValidationError
const createAuthError = require('../Utilities/Error').createAuthError
const createNotFoundError = require('../Utilities/Error').createNotFoundError
const bcrypt = require('bcrypt')
const uuid = require('uuid').v4
const { sequelizeErrorCatcher, requestErrorCatcher } = require("../Utilities/Error")
const axios = require('axios')
const config = require('../Config')
const Createlog = require('../Utilities/Createlog')

function Testserver(req, res) {
    res.status(200).json({ message: "success" })
}

function Login(req, res, next) {
    let validationErrors = []
    let grantType = req.body.grant_type || req.body.grantType || req.query.grant_type || req.query.grantType

    if (!grantType) {
        validationErrors.push(req.t('Oauth.Error.GranttypeRequired'))
    }

    switch (grantType) {
        case 'password': return responseToGetTokenByGrantPassword(req, res, next)
        case 'refresh_token': return responseToGetTokenByRefreshToken(req, res, next)
        default: validationErrors.push(req.t('Oauth.Error.InvalidGranttype'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Oauth'), req.language))
    }
}

async function Register(req, res, next) {
    let userroleresponse = null
    try {
        const response = await axios({
            method: 'POST',
            url: config.services.Userrole + `Users/Register`,
            headers: {
                session_key: config.session.secret
            },
            data: req.body
        })
        userroleresponse = response.data
    } catch (error) {
        return next(requestErrorCatcher(error, 'Userrole'))
    }
    res.status(200).json(userroleresponse?.data)
}

async function ValidateToken(req, res, next) {
    let validationErrors = []
    let accessToken = {}
    let bearerToken = req.body.accessToken || req.body.accessToken || req.query.accessToken || req.query.accessToken

    if (!bearerToken) {
        validationErrors.push(req.t('Oauth.Error.AccessTokenNotFound'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Oauth'), req.language))
    }

    accessToken = await db.accesstokenModel.findOne({ where: { Accesstoken: bearerToken, Isactive: true } })
    if (!accessToken) {
        return next(createAuthError(req.t('Oauth.Error.AccessTokenNotFound'), req.t('Oauth'), req.language))
    }
    const g1 = new Date(accessToken.ExpiresAt)
    const g2 = new Date()
    if (g1.getTime() <= g2.getTime()) {
        return next(createAuthError(req.t('Oauth.Error.AccessTokenInvalid'), req.t('Oauth'), req.language))
    }
    return res.status(200).json(accessToken)
}

async function responseToGetTokenByGrantPassword(req, res, next) {
    let validationErrors = []

    if (!req.body.Username) {
        validationErrors.push(req.t('Oauth.Error.UsernameRequired'))
    }

    if (!req.body.Password) {
        validationErrors.push(req.t('Oauth.Error.PasswordRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Oauth'), req.language))
    }
    let user = null
    let usersalt = null
    try {
        const userresponse = await axios({
            method: 'GET',
            url: config.services.Userrole + `Profile/Getuserbyusername/${req.body.Username}`,
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
            url: config.services.Userrole + `Profile/Getusersalt/${user.Uuid}`,
            headers: {
                session_key: config.session.secret
            }
        })
        usersalt = usersaltreponse.data
    } catch (error) {
        return next(requestErrorCatcher(error, "USERROLE"))
    }

    if (!await ValidatePassword(req.body.Password, user.PasswordHash, usersalt.Salt)) {
        return next(createAuthError(req.t('Oauth.Error.PasswordDindtMatch'), req.t('Oauth'), req.language))
    }

    const expireTime = new Date()
    expireTime.setHours(expireTime.getHours() + 1)

    let accessToken = {
        token_type: 'bearer',
        accessToken: uuid(),
        refreshToken: uuid(),
        ExpiresAt: expireTime,
        RefreshtokenexpiresAt: expireTime,
        redirect: user.Defaultpage
    }

    try {
        await db.accesstokenModel.update({
            Deleteduser: "System",
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Userid: user.Uuid } })

        req.identity = {}
        req.identity.user = user

        await db.accesstokenModel.create({
            Userid: user.Uuid,
            Accesstoken: accessToken.accessToken,
            Refreshtoken: accessToken.refreshToken,
            ExpiresAt: accessToken.ExpiresAt,
            RefreshtokenexpiresAt: accessToken.RefreshtokenexpiresAt,
            Createduser: "System",
            Createtime: new Date(),
            Updateduser: null,
            Updatetime: null,
            Deleteduser: null,
            Deletetime: null,
            Isactive: true
        })
        req.body.Password = ''
        Createlog(req)
    } catch (err) {
        return next(sequelizeErrorCatcher(err))
    }

    res.cookie("patientcare", accessToken.accessToken, {
        httpOnly: false,
        secure: false,
    }).status(200).json(accessToken)

}

async function responseToGetTokenByRefreshToken(req, res, next) {
    let validationErrors = []

    if (!req.body.refreshToken) {
        validationErrors.push(req.t('Oauth.Error.RefreshTokenRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Oauth'), req.language))
    }

    const token = await db.accesstokenModel.findOne({ where: { Refreshtoken: req.body.refreshToken } });
    if (!token) {
        return next(createNotFoundError(req.t('Oauth.Error.RefreshTokenNotFound'), req.t('Oauth'), req.language))
    }

    const g1 = new Date(token.RefreshtokenexpiresAt)
    const g2 = new Date()
    if (g1.getTime() <= g2.getTime()) {
        return next(createAuthError(req.t('Oauth.Error.RefreshTokenExpired'), req.t('Oauth'), req.language))
    }
    let user = null
    try {
        const userresponce = await axios({
            method: 'GET',
            url: config.services.Userrole + `Users/${token.Userid}`,
            headers: {
                session_key: config.session.secret
            }
        })
        user = userresponce.data
    } catch (error) {
        return next(requestErrorCatcher(error, "USERROLE"))
    }

    const expireTime = new Date()
    expireTime.setHours(expireTime.getHours() + 1)

    let accessToken = {
        token_type: 'bearer',
        accessToken: uuid(),
        refreshToken: uuid(),
        ExpiresAt: expireTime,
        RefreshtokenexpiresAt: expireTime,
    }

    try {
        await db.accesstokenModel.update({
            Deleteduser: "System",
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Userid: user.Uuid } })

        await db.accesstokenModel.create({
            Userid: user.Uuid,
            Accesstoken: accessToken.accessToken,
            Refreshtoken: accessToken.refreshToken,
            ExpiresAt: accessToken.ExpiresAt,
            RefreshtokenexpiresAt: accessToken.RefreshtokenexpiresAt,
            Createduser: "System",
            Createtime: new Date(),
            Updateduser: null,
            Updatetime: null,
            Deleteduser: null,
            Deletetime: null,
            Isactive: true
        })
    } catch (err) {
        return next(sequelizeErrorCatcher(err))
    }

    res.status(200).json(accessToken)
}

async function ValidatePassword(UserPassword, DbPassword, salt) {
    try {
        let hash = await bcrypt.hash(UserPassword, salt)
        if (hash === DbPassword) {
            return true
        } else {
            return false
        }
    } catch {
        return false
    }
}


module.exports = {
    Login,
    ValidateToken,
    Testserver,
    Register
}