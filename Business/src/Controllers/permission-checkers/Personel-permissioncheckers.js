const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetPersonels(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('personelscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Personels screen', req.language, { en: 'Personels screen', tr: 'Personels screen' }))
    }
}

async function GetPersonel(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('personelscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Personels screen', req.language, { en: 'Personels screen', tr: 'Personels screen' }))
    }
}

async function AddPersonel(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('personelscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Personels Add', req.language, { en: 'Personels Add', tr: 'Personels Add' }))
    }
}

async function AddRecordPersonel(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('personeladd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Personels Add', req.language, { en: 'Personels Add', tr: 'Personels Add' }))
    }
}

async function UpdatePersonel(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('personelupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Personels Update', req.language, { en: 'Personels Update', tr: 'Personels Update' }))
    }
}

async function DeletePersonel(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('personeldelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Personels Delete', req.language, { en: 'Personels Delete', tr: 'Personels Delete' }))
    }
}

module.exports = {
    GetPersonels,
    GetPersonel,
    AddPersonel,
    UpdatePersonel,
    DeletePersonel,
    AddRecordPersonel
}