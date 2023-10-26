const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetPrinttemplates(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('printtemplateview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Printtemplates View', req.language, { en: 'View Printtemplates', tr: 'View Printtemplates' }))
    }
}

async function GetPrinttemplate(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('printtemplateview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Printtemplates View', req.language, { en: 'View Printtemplates', tr: 'View Printtemplates' }))
    }
}

async function AddPrinttemplate(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('printtemplateadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Printtemplates Add', req.language, { en: 'Printtemplates Add', tr: 'Printtemplates Add' }))
    }
}

async function UpdatePrinttemplate(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('printtemplateupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Printtemplates Update', req.language, { en: 'Printtemplates Update', tr: 'Printtemplates Update' }))
    }
}

async function DeletePrinttemplate(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('printtemplatedelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Printtemplates Delete', req.language, { en: 'Printtemplates Delete', tr: 'Printtemplates Delete' }))
    }
}

module.exports = {
    GetPrinttemplates,
    GetPrinttemplate,
    AddPrinttemplate,
    UpdatePrinttemplate,
    DeletePrinttemplate,
}