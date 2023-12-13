const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetCompanycashmovements(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('companycashmovementview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Companycashmovements View', req.language, { en: 'Companycashmovements View', tr: 'Companycashmovements View' }))
    }
}

async function GetCompanycashmovement(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('companycashmovementview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Companycashmovements View', req.language, { en: 'Companycashmovements View', tr: 'Companycashmovements View' }))
    }
}

async function AddCompanycashmovement(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('companycashmovementadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Companycashmovements Add', req.language, { en: 'Companycashmovements Add', tr: 'Companycashmovements Add' }))
    }
}

async function UpdateCompanycashmovement(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('companycashmovementupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Companycashmovements Update', req.language, { en: 'Companycashmovements Update', tr: 'Companycashmovements Update' }))
    }
}

async function DeleteCompanycashmovement(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('companycashmovementdelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Companycashmovements Delete', req.language, { en: 'Companycashmovements Delete', tr: 'Companycashmovements Delete' }))
    }
}

module.exports = {
    GetCompanycashmovements,
    GetCompanycashmovement,
    AddCompanycashmovement,
    UpdateCompanycashmovement,
    DeleteCompanycashmovement,
}