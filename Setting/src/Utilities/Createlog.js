const axios = require('axios')
const config = require('../Config')
const validator = require('./Validator')

module.exports = async (req, res, next) => {
    try {
        const originalSend = res.send;
        const username = req?.identity?.user?.Username || 'System'
        res.send = function (body) {
            const servername = config.session.name
            const requestuserID = username
            const requestType = req.method;
            const requesturl = Getdomain(req)
            const requestip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const targeturl = req.originalUrl
            axios({
                method: 'POST',
                url: `${config.services.Log}Logs`,
                headers: {
                    session_key: config.session.secret
                },
                data: {
                    Service: servername,
                    UserID: requestuserID,
                    Requesttype: requestType,
                    Requesturl: requesturl,
                    Requestip: requestip,
                    Targeturl: targeturl,
                    Status: res.statusCode,
                    Requestdata: isJsonString(req.body) ? JSON.stringify(req.body).replace(/\\/g, "") : String(req.body),
                    Responsedata: isJsonString(body) ? JSON.stringify(body).replace(/\\/g, "") : String(body),
                }
            }).catch(() => {
            })
            originalSend.call(this, body);
        };
        next()
    } catch (error) {
        console.log("error on create log", error)
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

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch {
        if (validator.isObject(str) || validator.isArray(str)) {
            return true
        }
        return false;
    }
    return true;
}