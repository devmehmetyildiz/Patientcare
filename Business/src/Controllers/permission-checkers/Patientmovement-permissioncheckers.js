const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetPatientmovements(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientmovementview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientmovements View', req.language, { en: 'Patientmovements View', tr: 'Patientmovements View' }))
    }
}

async function GetPatientmovement(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientmovementview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientmovements View', req.language, { en: 'Patientmovements View', tr: 'Patientmovements View' }))
    }
}

async function AddPatientmovement(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientmovementadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientmovements Add', req.language, { en: 'Patientmovements Add', tr: 'Patientmovements Add' }))
    }
}

async function UpdatePatientmovement(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientmovementupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientmovements Update', req.language, { en: 'Patientmovements Update', tr: 'Patientmovements Update' }))
    }
}

async function DeletePatientmovement(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientmovementdelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientmovements Delete', req.language, { en: 'Patientmovements Delete', tr: 'Patientmovements Delete' }))
    }
}

module.exports = {
    GetPatientmovements,
    GetPatientmovement,
    AddPatientmovement,
    UpdatePatientmovement,
    DeletePatientmovement,
}