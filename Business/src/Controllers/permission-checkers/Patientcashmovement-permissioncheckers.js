const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetPatientcashmovements(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientcashmovementscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientcashmovements screen', req.language, { en: 'Patientcashmovements screen', tr: 'Patientcashmovements screen' }))
    }
}

async function GetPatientcashmovement(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientcashmovementscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientcashmovements screen', req.language, { en: 'Patientcashmovements screen', tr: 'Patientcashmovements screen' }))
    }
}

async function AddPatientcashmovement(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientcashmovementadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientcashmovements Add', req.language, { en: 'Patientcashmovements Add', tr: 'Patientcashmovements Add' }))
    }
}

async function UpdatePatientcashmovement(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientcashmovementupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientcashmovements Update', req.language, { en: 'Patientcashmovements Update', tr: 'Patientcashmovements Update' }))
    }
}

async function DeletePatientcashmovement(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientcashmovementdelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientcashmovements Delete', req.language, { en: 'Patientcashmovements Delete', tr: 'Patientcashmovements Delete' }))
    }
}

module.exports = {
    GetPatientcashmovements,
    GetPatientcashmovement,
    AddPatientcashmovement,
    UpdatePatientcashmovement,
    DeletePatientcashmovement,
}