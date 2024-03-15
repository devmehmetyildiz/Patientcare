const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetSupportplans(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('supportplanscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Supportplans screen', req.language, { en: 'screen Supportplans', tr: 'screen Supportplans' }))
    }
}

async function GetSupportplan(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('supportplanscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Supportplans screen', req.language, { en: 'screen Supportplans', tr: 'screen Supportplans' }))
    }
}

async function AddSupportplan(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('supportplanadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Supportplans Add', req.language, { en: 'Supportplans Add', tr: 'Supportplans Add' }))
    }
}

async function UpdateSupportplan(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('supportplanupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Supportplans Update', req.language, { en: 'Supportplans Update', tr: 'Supportplans Update' }))
    }
}

async function DeleteSupportplan(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('supportplandelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Supportplans Delete', req.language, { en: 'Supportplans Delete', tr: 'Supportplans Delete' }))
    }
}

module.exports = {
    GetSupportplans,
    GetSupportplan,
    AddSupportplan,
    UpdateSupportplan,
    DeleteSupportplan,
}