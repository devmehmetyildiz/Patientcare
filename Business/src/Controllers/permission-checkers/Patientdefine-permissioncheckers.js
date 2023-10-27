const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetPatientdefines(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientdefineview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientdefines View', req.language, { en: 'Patientdefines View', tr: 'Patientdefines View' }))
    }
}

async function GetPatientdefine(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientdefineview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientdefines View', req.language, { en: 'Patientdefines View', tr: 'Patientdefines View' }))
    }
}

async function AddPatientdefine(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientdefineadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientdefines Add', req.language, { en: 'Patientdefines Add', tr: 'Patientdefines Add' }))
    }
}

async function UpdatePatientdefine(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientdefineupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientdefines Update', req.language, { en: 'Patientdefines Update', tr: 'Patientdefines Update' }))
    }
}

async function DeletePatientdefine(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientdefinedelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientdefines Delete', req.language, { en: 'Patientdefines Delete', tr: 'Patientdefines Delete' }))
    }
}

module.exports = {
    GetPatientdefines,
    GetPatientdefine,
    AddPatientdefine,
    UpdatePatientdefine,
    DeletePatientdefine,
}