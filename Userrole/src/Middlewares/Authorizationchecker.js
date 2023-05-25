const config = require('../Config')
const messages = require('../Constants/Messages')
const { sequelizeErrorCatcher, createAutherror, requestErrorCatcher } = require('../Utilities/Error')
const createValidationError = require('../Utilities/Error').createValidation
const createErrorList = require('../Utilities/Error').createList
const axios = require('axios');

const INVALID_AUTHORIZATION_HEADER = createErrorList('FORBIDDEN', 'INVALID_AUTHORIZATION_HEADER', {
    en: 'Access denied. Invalid authorization header',
    tr: 'Erişim reddedildi. Geçersiz yekilendirme başlığı',
})
const INVALID_ACCESS_TOKEN = createErrorList('FORBIDDEN', 'INVALID_ACCESS_TOKEN', {
    en: 'Access denied. Invalid access token',
    tr: 'Erişim reddedildi. Geçersiz erişim anahtarı',
})


const PUBLIC_URLS = [
    { method: 'post', url: '/Users/Register' }
]

async function authorizationChecker(req, res, next) {
    try {
        if (req.identity === undefined) req.identity = {}
        let accessToken = {}

        let isMicroservicesreq = req.headers && req.headers.session_key && req.headers.session_key === config.session.secret
        if (!isMicroservicesreq) {

            if (!isPublicUrlRequest(req.method, req.originalUrl)) {
                if (!doesAuthorizationHeaderExists(req.headers)) {
                    return next(createValidationError({
                        code: 'AUTHORIZATION_HEADER_REQUIRED', description: {
                            en: 'You need to provide authorization headers to access this resource',
                            tr: 'Bu kaynağa erişmek için yetkilendirme başlıkları gerekiyor',
                        }
                    }, req.language))
                }

                let isTokenValid = false
                let authorizationHeaderType = getAuthorizationHeaderType(req.headers)
                if (authorizationHeaderType === 'bearer') {
                    let bearerToken = getBearerToken(req.headers)
                    if (bearerToken) {
                        try {
                            
                            const accessTokenresponse = await axios(
                                {
                                    method: 'POST',
                                    url: config.services.Auth + 'Oauth/ValidateToken',
                                    data: {
                                        accessToken: bearerToken
                                    }
                                }
                            )
                            accessToken = accessTokenresponse.data
                            isTokenValid = true
                        } catch (err) {
                            return next(requestErrorCatcher(err, 'AUTH'))
                        }
                    }

                    if (isTokenValid) {
                        req.identity.accessToken = bearerToken
                        req.identity.user = null
                        req.identity.privileges = []

                        try {
                            const user = await db.userModel.findOne({ where: { Uuid: accessToken.Userid } })
                            if (!user) {
                                return next(createNotfounderror([messages.ERROR.USER_NOT_FOUND], req.language))
                            }
                            if (!user.Isactive) {
                                return next(USER_IS_DISABLED[req.language])
                            }
                            req.identity.user = user
                            const userroles = await db.userroleModel.findAll({ where: { UserID: user.Uuid } })
                            if (!userroles) {
                                return next(createNotfounderror([messages.ERROR.USERROLE_NOT_FOUND], req.language))
                            }
                            for (const userrole of userroles) {
                                let privileges = await db.roleprivilegeModel.findAll({ where: { RoleID: userrole.RoleID } })
                                req.identity.privileges = privileges.map(u => { return u.PrivilegeID }).concat(req.identity.privileges)
                            }
                        } catch (error) {
                            sequelizeErrorCatcher(error)
                            next()
                        }


                    }
                }

            } else {
                return next(INVALID_AUTHORIZATION_HEADER[req.language])
            }
        }
        next()
    } catch (err) {
        return next(err)
    }
}

function doesAuthorizationHeaderExists(headers) {
    return headers.authorization &&
        (headers.authorization.toLowerCase().indexOf('bearer') === 0)
}

function getAuthorizationHeaderType(headers) {
    if (!headers.authorization) {
        return null
    }

    if (headers.authorization.toLowerCase().indexOf('bearer') === 0) {
        return 'bearer'
    }

    return null
}

function getBearerToken(headers) {
    if (!headers.authorization) {
        return null
    }

    let headerParts = headers.authorization.split(' ')
    if (headerParts[0].toLowerCase() == 'bearer' && headerParts.length >= 2)
        return headerParts[1]
    else
        return null
}

function isPublicUrlRequest(method, url) {
    let res = false
    let route = PUBLIC_URLS.find(u => u.method === method.toLowerCase() && u.url === url)
    if (route) {
        res = true
    }
    return res
}

module.exports = authorizationChecker