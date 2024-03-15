const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetSupportplanlists(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('supportplanlistscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Supportplanlists screen', req.language, { en: 'screen Supportplanlists', tr: 'screen Supportplanlists' }))
    }
}

async function GetSupportplanlist(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('supportplanlistscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Supportplanlists screen', req.language, { en: 'screen Supportplanlists', tr: 'screen Supportplanlists' }))
    }
}

async function AddSupportplanlist(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('supportplanlistadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Supportplanlists Add', req.language, { en: 'Supportplanlists Add', tr: 'Supportplanlists Add' }))
    }
}

async function UpdateSupportplanlist(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('supportplanlistupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Supportplanlists Update', req.language, { en: 'Supportplanlists Update', tr: 'Supportplanlists Update' }))
    }
}

async function DeleteSupportplanlist(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('supportplanlistdelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Supportplanlists Delete', req.language, { en: 'Supportplanlists Delete', tr: 'Supportplanlists Delete' }))
    }
}

module.exports = {
    GetSupportplanlists,
    GetSupportplanlist,
    AddSupportplanlist,
    UpdateSupportplanlist,
    DeleteSupportplanlist,
}