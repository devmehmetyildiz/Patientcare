const config = require("../Config")

module.exports = (req) => {
    let status = false
    let isMicroservicesreq = req.headers && req.headers.session_key && req.headers.session_key === config.session.secret
    if (isMicroservicesreq) {
        status = true
    }
    if (req.identity.privileges && req.identity.privileges.includes('admin')) {
        status = true
    }
    return status
}