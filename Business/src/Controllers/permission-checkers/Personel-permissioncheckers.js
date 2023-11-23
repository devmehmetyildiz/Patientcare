const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetPersonels(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientmovementview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Personels View', req.language, { en: 'Personels View', tr: 'Personels View' }))
    }
}

async function GetPersonel(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientmovementview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Personels View', req.language, { en: 'Personels View', tr: 'Personels View' }))
    }
}

async function AddPersonel(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientmovementadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Personels Add', req.language, { en: 'Personels Add', tr: 'Personels Add' }))
    }
}

async function UpdatePersonel(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientmovementupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Personels Update', req.language, { en: 'Personels Update', tr: 'Personels Update' }))
    }
}

async function DeletePersonel(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientmovementdelete')) || permissionchecker(req)) {
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
}