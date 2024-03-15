const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetCostumertypes(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('costumertypescreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Costumertypes screen', req.language, { en: 'screen Costumertypes', tr: 'screen Costumertypes' }))
    }
}

async function GetCostumertype(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('costumertypescreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Costumertypes screen', req.language, { en: 'screen Costumertypes', tr: 'screen Costumertypes' }))
    }
}

async function AddCostumertype(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('costumertypeadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Costumertypes Add', req.language, { en: 'Costumertypes Add', tr: 'Costumertypes Add' }))
    }
}

async function UpdateCostumertype(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('costumertypeupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Costumertypes Update', req.language, { en: 'Costumertypes Update', tr: 'Costumertypes Update' }))
    }
}

async function DeleteCostumertype(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('costumertypedelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Costumertypes Delete', req.language, { en: 'Costumertypes Delete', tr: 'Costumertypes Delete' }))
    }
}

module.exports = {
    GetCostumertypes,
    GetCostumertype,
    AddCostumertype,
    UpdateCostumertype,
    DeleteCostumertype,
}