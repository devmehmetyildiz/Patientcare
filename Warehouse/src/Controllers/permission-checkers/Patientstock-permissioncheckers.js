const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function Transferpatientstock(req, res, next) {
    if ((req.identity.privileges && (req.identity.privileges.includes('patientstockupdate') || req.identity.privileges.includes('patientmedicineupdate') || req.identity.privileges.includes('patientsupplyupdate'))) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientstocks Update', req.language, { en: 'Patientstocks Update', tr: 'Patientstocks Update' }))
    }
}

async function GetPatientstocks(req, res, next) {
    if ((req.identity.privileges && (req.identity.privileges.includes('patientstockscreen') || req.identity.privileges.includes('patientmedicinescreen') || req.identity.privileges.includes('patientsupplyscreen'))) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientstocks screen', req.language, { en: 'Patientstocks screen', tr: 'Patientstocks screen' }))
    }
}

async function GetPatientstock(req, res, next) {
    if ((req.identity.privileges && (req.identity.privileges.includes('patientstockscreen') || req.identity.privileges.includes('patientmedicinescreen') || req.identity.privileges.includes('patientsupplyscreen'))) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientstocks screen', req.language, { en: 'Patientstocks screen', tr: 'Patientstocks screen' }))
    }
}

async function AddPatientstock(req, res, next) {
    if ((req.identity.privileges && (req.identity.privileges.includes('patientstockadd') || req.identity.privileges.includes('patientmedicineadd') || req.identity.privileges.includes('patientsupplyadd'))) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientstocks Add', req.language, { en: 'Patientstocks Add', tr: 'Patientstocks Add' }))
    }
}

async function UpdatePatientstock(req, res, next) {
    if ((req.identity.privileges && (req.identity.privileges.includes('patientstockupdate') || req.identity.privileges.includes('patientmedicineupdate') || req.identity.privileges.includes('patientsupplyupdate'))) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientstocks Update', req.language, { en: 'Patientstocks Update', tr: 'Patientstocks Update' }))
    }
}

async function UpdatePatientstocklist(req, res, next) {
    if ((req.identity.privileges && (req.identity.privileges.includes('patientstockupdate') || req.identity.privileges.includes('patientmedicineupdate') || req.identity.privileges.includes('patientsupplyupdate'))) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientstocks Update', req.language, { en: 'Patientstocks Update', tr: 'Patientstocks Update' }))
    }
}

async function ApprovePatientstock(req, res, next) {
    if ((req.identity.privileges && (req.identity.privileges.includes('patientstockupdate') || req.identity.privileges.includes('patientmedicineupdate') || req.identity.privileges.includes('patientsupplyupdate'))) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientstocks Update', req.language, { en: 'Patientstocks Update', tr: 'Patientstocks Update' }))
    }
}

async function ApprovePatientstocks(req, res, next) {
    if ((req.identity.privileges && (req.identity.privileges.includes('patientstockupdate') || req.identity.privileges.includes('patientmedicineupdate') || req.identity.privileges.includes('patientsupplyupdate'))) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientstocks Update', req.language, { en: 'Patientstocks Update', tr: 'Patientstocks Update' }))
    }
}

async function DeletePatientstock(req, res, next) {
    if ((req.identity.privileges && (req.identity.privileges.includes('patientstockdelete') || req.identity.privileges.includes('patientmedicinedelete') || req.identity.privileges.includes('patientsupplydelete'))) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientstocks Delete', req.language, { en: 'Patientstocks Delete', tr: 'Patientstocks Delete' }))
    }
}


module.exports = {
    GetPatientstocks,
    GetPatientstock,
    AddPatientstock,
    UpdatePatientstock,
    DeletePatientstock,
    Transferpatientstock,
    UpdatePatientstocklist,
    ApprovePatientstock,
    ApprovePatientstocks,
}