const config = require('../Config')
const { requestErrorCatcher } = require('../Utilities/Error')
const createValidationError = require('../Utilities/Error').createValidation
const createErrorList = require('../Utilities/Error').createList
const axios = require('axios')

const INVALID_AUTHORIZATION_HEADER = createErrorList('FORBIDDEN', 'INVALID_AUTHORIZATION_HEADER', {
    en: 'Access denied. Invalid authorization header',
    tr: 'Erişim reddedildi. Geçersiz yekilendirme başlığı',
})

const PUBLIC_URLS = [

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
                                    headers: {
                                        session_key: config.session.secret
                                    },
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
                        req.identity.privileges = null

                        try {
                            let user = null
                            let userprivileges = null
                            const userresponse = await axios({
                                method: 'GET',
                                url: config.services.Userrole + `Users/${accessToken.Userid}`,
                                headers: {
                                    session_key: config.session.secret
                                }
                            })
                            user = userresponse.data
                            req.identity.user = user
                            const userprivilegesreponse = await axios({
                                method: 'GET',
                                url: config.services.Userrole + `Roles/Getprivilegesbyuserid/${user.Uuid}`,
                                headers: {
                                    session_key: config.session.secret
                                }
                            })
                            userprivileges = userprivilegesreponse.data
                            req.identity.privileges = userprivileges
                        } catch (error) {
                            return next(requestErrorCatcher(error, 'USERROLE'))
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