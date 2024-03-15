const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetUsagetypes(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('usagetypescreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Usagetypes screen', req.language, { en: 'screen Usagetypes', tr: 'screen Usagetypes' }))
    }
}

async function GetUsagetype(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('usagetypescreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Usagetypes screen', req.language, { en: 'screen Usagetypes', tr: 'screen Usagetypes' }))
    }
}

async function AddUsagetype(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('usagetypeadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Usagetypes Add', req.language, { en: 'Usagetypes Add', tr: 'Usagetypes Add' }))
    }
}

async function UpdateUsagetype(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('usagetypeupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Usagetypes Update', req.language, { en: 'Usagetypes Update', tr: 'Usagetypes Update' }))
    }
}

async function DeleteUsagetype(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('usagetypedelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Usagetypes Delete', req.language, { en: 'Usagetypes Delete', tr: 'Usagetypes Delete' }))
    }
}

module.exports = {
    GetUsagetypes,
    GetUsagetype,
    AddUsagetype,
    UpdateUsagetype,
    DeleteUsagetype,
}