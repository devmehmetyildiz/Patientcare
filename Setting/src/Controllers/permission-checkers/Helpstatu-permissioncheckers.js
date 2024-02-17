const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetHelpstatus(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('helpstatuview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Helpstatus View', req.language, { en: 'View Helpstatus', tr: 'View Helpstatus' }))
    }
}

async function GetHelpstatu(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('helpstatuview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Helpstatus View', req.language, { en: 'View Helpstatus', tr: 'View Helpstatus' }))
    }
}

async function AddHelpstatu(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('helpstatuadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Helpstatus Add', req.language, { en: 'Helpstatus Add', tr: 'Helpstatus Add' }))
    }
}

async function UpdateHelpstatu(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('helpstatuupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Helpstatus Update', req.language, { en: 'Helpstatus Update', tr: 'Helpstatus Update' }))
    }
}

async function DeleteHelpstatu(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('helpstatudelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Helpstatus Delete', req.language, { en: 'Helpstatus Delete', tr: 'Helpstatus Delete' }))
    }
}

module.exports = {
    GetHelpstatus,
    GetHelpstatu,
    AddHelpstatu,
    UpdateHelpstatu,
    DeleteHelpstatu,
}