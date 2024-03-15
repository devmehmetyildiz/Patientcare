const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetRequiredperiods(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('requiredperiodscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Requiredperiods screen', req.language, { en: 'screen Requiredperiods', tr: 'screen Requiredperiods' }))
    }
}

async function GetRequiredperiod(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('requiredperiodscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Requiredperiods screen', req.language, { en: 'screen Requiredperiods', tr: 'screen Requiredperiods' }))
    }
}

async function AddRequiredperiod(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('requiredperiodadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Requiredperiods Add', req.language, { en: 'Requiredperiods Add', tr: 'Requiredperiods Add' }))
    }
}

async function UpdateRequiredperiod(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('requiredperiodupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Requiredperiods Update', req.language, { en: 'Requiredperiods Update', tr: 'Requiredperiods Update' }))
    }
}

async function DeleteRequiredperiod(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('requiredperioddelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Requiredperiods Delete', req.language, { en: 'Requiredperiods Delete', tr: 'Requiredperiods Delete' }))
    }
}

module.exports = {
    GetRequiredperiods,
    GetRequiredperiod,
    AddRequiredperiod,
    UpdateRequiredperiod,
    DeleteRequiredperiod,
}