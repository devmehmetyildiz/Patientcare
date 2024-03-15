const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetProfessions(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('professionscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Professions screen', req.language, { en: 'Professions screen', tr: 'Professions screen' }))
    }
}

async function GetProfession(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('professionscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Professions screen', req.language, { en: 'Professions screen', tr: 'Professions screen' }))
    }
}

async function AddProfession(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('professionadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Professions Add', req.language, { en: 'Professions Add', tr: 'Professions Add' }))
    }
}

async function UpdateProfession(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('professionupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Professions Update', req.language, { en: 'Professions Update', tr: 'Professions Update' }))
    }
}

async function ApproveProfession(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('professionupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Professions Update', req.language, { en: 'Professions Update', tr: 'Professions Update' }))
    }
}

async function DeleteProfession(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('professiondelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Professions Delete', req.language, { en: 'Professions Delete', tr: 'Professions Delete' }))
    }
}

module.exports = {
    GetProfessions,
    GetProfession,
    AddProfession,
    ApproveProfession,
    UpdateProfession,
    DeleteProfession,
}