const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetCases(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('casescreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Cases screen', req.language, { en: 'screen Cases', tr: 'screen Cases' }))
    }
}

async function GetCompleteCase(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('casescreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Cases screen', req.language, { en: 'screen Cases', tr: 'screen Cases' }))
    }
}

async function GetDeactivateCase(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('casescreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Cases screen', req.language, { en: 'screen Cases', tr: 'screen Cases' }))
    }
}

async function GetCase(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('casescreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Cases screen', req.language, { en: 'screen Cases', tr: 'screen Cases' }))
    }
}


async function AddCase(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('caseadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Cases Add', req.language, { en: 'Cases Add', tr: 'Cases Add' }))
    }
}

async function UpdateCase(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('caseupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Cases Update', req.language, { en: 'Cases Update', tr: 'Cases Update' }))
    }
}

async function DeleteCase(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('casedelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Cases Delete', req.language, { en: 'Cases Delete', tr: 'Cases Delete' }))
    }
}

module.exports = {
    GetCases,
    GetCase,
    AddCase,
    UpdateCase,
    DeleteCase,
    GetCompleteCase,
    GetDeactivateCase
}