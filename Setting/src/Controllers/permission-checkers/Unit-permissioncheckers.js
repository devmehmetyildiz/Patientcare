const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetUnits(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('unitview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Units View', req.language, { en: 'View Units', tr: 'View Units' }))
    }
}

async function GetUnit(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('unitview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Units View', req.language, { en: 'View Units', tr: 'View Units' }))
    }
}

async function AddUnit(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('unitadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Units Add', req.language, { en: 'Units Add', tr: 'Units Add' }))
    }
}

async function UpdateUnit(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('unitupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Units Update', req.language, { en: 'Units Update', tr: 'Units Update' }))
    }
}

async function DeleteUnit(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('unitdelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Units Delete', req.language, { en: 'Units Delete', tr: 'Units Delete' }))
    }
}

module.exports = {
    GetUnits,
    GetUnit,
    AddUnit,
    UpdateUnit,
    DeleteUnit,
}