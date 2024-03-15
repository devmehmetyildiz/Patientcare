const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetMakingtypes(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('makingtypescreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Makingtypes screen', req.language, { en: 'screen Makingtypes', tr: 'screen Makingtypes' }))
    }
}

async function GetMakingtype(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('makingtypescreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Makingtypes screen', req.language, { en: 'screen Makingtypes', tr: 'screen Makingtypes' }))
    }
}

async function AddMakingtype(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('makingtypeadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Makingtypes Add', req.language, { en: 'Makingtypes Add', tr: 'Makingtypes Add' }))
    }
}

async function UpdateMakingtype(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('makingtypeupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Makingtypes Update', req.language, { en: 'Makingtypes Update', tr: 'Makingtypes Update' }))
    }
}

async function DeleteMakingtype(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('makingtypedelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Makingtypes Delete', req.language, { en: 'Makingtypes Delete', tr: 'Makingtypes Delete' }))
    }
}

module.exports = {
    GetMakingtypes,
    GetMakingtype,
    AddMakingtype,
    UpdateMakingtype,
    DeleteMakingtype,
}