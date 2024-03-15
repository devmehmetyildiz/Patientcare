const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetCheckperiods(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('checkperiodscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Checkperiods screen', req.language, { en: 'screen Checkperiods', tr: 'screen Checkperiods' }))
    }
}

async function GetCheckperiod(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('checkperiodscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Checkperiods screen', req.language, { en: 'screen Cases', tr: 'screen Cases' }))
    }
}


async function AddCheckperiod(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('checkperiodadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Checkperiods Add', req.language, { en: 'Checkperiods Add', tr: 'Checkperiods Add' }))
    }
}

async function UpdateCheckperiod(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('checkperiodupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Checkperiods Update', req.language, { en: 'Checkperiods Update', tr: 'Checkperiods Update' }))
    }
}

async function DeleteCheckperiod(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('checkperioddelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Checkperiods Delete', req.language, { en: 'Checkperiods Delete', tr: 'Checkperiods Delete' }))
    }
}


module.exports = {
    GetCheckperiods,
    GetCheckperiod,
    AddCheckperiod,
    UpdateCheckperiod,
    DeleteCheckperiod,
}