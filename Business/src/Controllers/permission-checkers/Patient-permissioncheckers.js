const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetPatients(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patients View', req.language, { en: 'Patients View', tr: 'Patients View' }))
    }
}

async function GetPreregistrations(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patients View', req.language, { en: 'Patients View', tr: 'Patients View' }))
    }
}

async function GetFullpatients(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patients View', req.language, { en: 'Patients View', tr: 'Patients View' }))
    }
}

async function GetPatient(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patients View', req.language, { en: 'Patients View', tr: 'Patients View' }))
    }
}

async function AddPatient(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patients Add', req.language, { en: 'Patients Add', tr: 'Patients Add' }))
    }
}
async function AddPatientReturnPatient(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patients Add', req.language, { en: 'Patients Add', tr: 'Patients Add' }))
    }
}

async function Createfromtemplate(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patients Add', req.language, { en: 'Patients Add', tr: 'Patients Add' }))
    }
}

async function Completeprepatient(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patients Update', req.language, { en: 'Patients Update', tr: 'Patients Update' }))
    }
}

async function Editpatientstocks(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patients Update', req.language, { en: 'Patients Update', tr: 'Patients Update' }))
    }
}

async function UpdatePatient(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patients Update', req.language, { en: 'Patients Update', tr: 'Patients Update' }))
    }
}

async function UpdatePatientcase(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patients Update', req.language, { en: 'Patients Update', tr: 'Patients Update' }))
    }
}

async function UpdatePatientplace(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patients Update', req.language, { en: 'Patients Update', tr: 'Patients Update' }))
    }
}

async function UpdatePatienttododefines(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patients Update', req.language, { en: 'Patients Update', tr: 'Patients Update' }))
    }
}

async function DeletePatient(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientdelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patients Delete', req.language, { en: 'Patients Delete', tr: 'Patients Delete' }))
    }
}

async function OutPatient(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patients Update', req.language, { en: 'Patients Update', tr: 'Patients Update' }))
    }
}

async function InPatient(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patients Update', req.language, { en: 'Patients Update', tr: 'Patients Update' }))
    }
}


module.exports = {
    GetPatients,
    Completeprepatient,
    GetFullpatients,
    GetPreregistrations,
    GetPatient,
    AddPatient,
    UpdatePatient,
    UpdatePatientcase,
    UpdatePatienttododefines,
    DeletePatient,
    Editpatientstocks,
    OutPatient,
    InPatient,
    UpdatePatientplace,
    AddPatientReturnPatient,
    Createfromtemplate
}