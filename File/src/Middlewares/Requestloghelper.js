const config = require('../Config')
const Createlog = require('../Utilities/Createlog')

module.exports = (req, res, next) => {

    if (config.session.logger === '1') {
        if (req && req.identity && req.identity.user) {
            Createlog(req, res)
        }
    }
    if (config.session.logger === '2') {
        Createlog(req, res)
    }
    next()
}