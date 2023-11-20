const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetPurchaseorderstockmovements(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('purchaseorderstockmovementview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Purchaseorderstockmovements View', req.language, { en: 'Purchaseorderstockmovements View', tr: 'Purchaseorderstockmovements View' }))
    }
}

async function GetPurchaseorderstockmovement(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('purchaseorderstockmovementview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Purchaseorderstockmovements View', req.language, { en: 'Purchaseorderstockmovements View', tr: 'Purchaseorderstockmovements View' }))
    }
}

async function AddPurchaseorderstockmovement(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('purchaseorderstockmovementadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Purchaseorderstockmovements Add', req.language, { en: 'Purchaseorderstockmovements Add', tr: 'Purchaseorderstockmovements Add' }))
    }
}

async function UpdatePurchaseorderstockmovement(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('purchaseorderstockmovementupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Purchaseorderstockmovements Update', req.language, { en: 'Purchaseorderstockmovements Update', tr: 'Purchaseorderstockmovements Update' }))
    }
}

async function ApprovePurchaseorderstockmovement(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('purchaseorderstockmovementupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Purchaseorderstockmovements Update', req.language, { en: 'Purchaseorderstockmovements Update', tr: 'Purchaseorderstockmovements Update' }))
    }
}

async function ApprovePurchaseorderstockmovements(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('purchaseorderstockmovementupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Purchaseorderstockmovements Update', req.language, { en: 'Purchaseorderstockmovements Update', tr: 'Purchaseorderstockmovements Update' }))
    }
}

async function DeletePurchaseorderstockmovement(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('purchaseorderstockmovementdelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Purchaseorderstockmovements Delete', req.language, { en: 'Purchaseorderstockmovements Delete', tr: 'Purchaseorderstockmovements Delete' }))
    }
}

module.exports = {
    GetPurchaseorderstockmovements,
    GetPurchaseorderstockmovement,
    AddPurchaseorderstockmovement,
    UpdatePurchaseorderstockmovement,
    DeletePurchaseorderstockmovement,
    ApprovePurchaseorderstockmovement,
    ApprovePurchaseorderstockmovements
}