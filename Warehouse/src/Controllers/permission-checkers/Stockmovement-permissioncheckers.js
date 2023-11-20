const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetStockmovements(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('stockmovementview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Stockmovements View', req.language, { en: 'Stockmovements View', tr: 'Stockmovements View' }))
    }
}

async function GetStockmovement(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('stockmovementview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Stockmovements View', req.language, { en: 'Stockmovements View', tr: 'Stockmovements View' }))
    }
}

async function AddStockmovement(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('stockmovementadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Stockmovements Add', req.language, { en: 'Stockmovements Add', tr: 'Stockmovements Add' }))
    }
}

async function UpdateStockmovement(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('stockmovementupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Stockmovements Update', req.language, { en: 'Stockmovements Update', tr: 'Stockmovements Update' }))
    }
}

async function ApproveStockmovement(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('stockmovementupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Stockmovements Update', req.language, { en: 'Stockmovements Update', tr: 'Stockmovements Update' }))
    }
}

async function ApproveStockmovements(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('stockmovementupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Stockmovements Update', req.language, { en: 'Stockmovements Update', tr: 'Stockmovements Update' }))
    }
}

async function DeleteStockmovement(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('stockmovementdelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Stockmovements Delete', req.language, { en: 'Stockmovements Delete', tr: 'Stockmovements Delete' }))
    }
}


module.exports = {
    GetStockmovements,
    GetStockmovement,
    AddStockmovement,
    UpdateStockmovement,
    DeleteStockmovement,
    ApproveStockmovement,
    ApproveStockmovements
}