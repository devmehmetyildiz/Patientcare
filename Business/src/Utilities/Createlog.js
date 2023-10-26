const axios = require('axios')
const config = require('../Config')
const validator = require('./Validator')
const { sequelizeErrorCatcher, requestErrorCatcher } = require('./Error')

module.exports = async (req) => {
    try {
        const servername = config.session.name
        const requestuserID = req.identity.user.Uuid
        const requestType = req.method;
        const requesturl = Getdomain(req)
        const requestip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const targeturl = req.originalUrl
        const status = 'success'
        const data = validator.isObject(req.body) ? JSON.stringify(req.body) : ''
        await axios({
            method: 'POST',
            url: `${config.services.Log}Logs`,
            headers: {
                session_key: config.session.secret
            },
            data: {
                Servername: servername,
                RequestuserID: requestuserID,
                Requesttype: requestType,
                Requesturl: requesturl,
                Requestip: requestip,
                Targeturl: targeturl,
                Status: status,
                Data: data
            }
        })
    } catch (error) {
        console.log(requestErrorCatcher(error, 'Log'))
    }
}

function Getdomain(req) {
    const referringDomain = req.headers.referer || req.headers.referrer;
    if (referringDomain) {
        const domain = new URL(referringDomain).hostname;
        return domain
    } else {
        return null
    }
}