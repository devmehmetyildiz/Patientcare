function pass(req, res, next) {
    next()
}

module.exports = {
    Login: pass,
    Register: pass
}