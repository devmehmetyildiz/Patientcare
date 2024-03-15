const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetPatienttypes(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patienttypescreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patienttypes screen', req.language, { en: 'screen Patienttypes', tr: 'screen Patienttypes' }))
    }
}

async function GetPatienttype(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patienttypescreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patienttypes screen', req.language, { en: 'screen Patienttypes', tr: 'screen Patienttypes' }))
    }
}


async function AddPatienttype(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patienttypeadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patienttypes Add', req.language, { en: 'Patienttypes Add', tr: 'Patienttypes Add' }))
    }
}

async function UpdatePatienttype(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patienttypeupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patienttypes Update', req.language, { en: 'Patienttypes Update', tr: 'Patienttypes Update' }))
    }
}

async function DeletePatienttype(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patienttypedelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patienttypes Delete', req.language, { en: 'Patienttypes Delete', tr: 'Patienttypes Delete' }))
    }
}

module.exports = {
    GetPatienttypes,
    GetPatienttype,
    AddPatienttype,
    UpdatePatienttype,
    DeletePatienttype,
}