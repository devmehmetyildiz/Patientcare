const Createlog = require('../Utilities/Createlog')

module.exports = (req, res, next) => {
    Createlog(req, res)
    next()
}