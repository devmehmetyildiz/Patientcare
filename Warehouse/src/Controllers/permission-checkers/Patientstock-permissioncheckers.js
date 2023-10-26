const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function Transferpatientstock(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientstockupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientstocks Update', req.language, { en: 'Patientstocks Update', tr: 'Patientstocks Update' }))
    }
}

async function GetPatientstocks(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientstockview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientstocks View', req.language, { en: 'Patientstocks View', tr: 'Patientstocks View' }))
    }
}

async function GetPatientstock(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientstockview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientstocks View', req.language, { en: 'Patientstocks View', tr: 'Patientstocks View' }))
    }
}

async function AddPatientstock(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientstockadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientstocks Add', req.language, { en: 'Patientstocks Add', tr: 'Patientstocks Add' }))
    }
}

async function UpdatePatientstock(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientstockupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientstocks Update', req.language, { en: 'Patientstocks Update', tr: 'Patientstocks Update' }))
    }
}

async function UpdatePatientstocklist(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientstockupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientstocks Update', req.language, { en: 'Patientstocks Update', tr: 'Patientstocks Update' }))
    }
}

async function ApprovePatientstock(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientstockupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientstocks Update', req.language, { en: 'Patientstocks Update', tr: 'Patientstocks Update' }))
    }
}

async function DeletePatientstock(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientstockdelete')) || permissionchecker(req)) {
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
    ApprovePatientstock
}