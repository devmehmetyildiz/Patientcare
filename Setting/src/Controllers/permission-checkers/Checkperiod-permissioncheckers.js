const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetCheckperiods(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('checkperiodview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Checkperiods View', req.language, { en: 'View Checkperiods', tr: 'View Checkperiods' }))
    }
}

async function GetCheckperiod(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('checkperiodview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Checkperiods View', req.language, { en: 'View Cases', tr: 'View Cases' }))
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