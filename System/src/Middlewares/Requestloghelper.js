const Createlog = require('../Utilities/Createlog')

module.exports = (req, res, next) => {
    if (req && req.identity && req.identity.user) {
        Createlog(req)
    }
    next()
}