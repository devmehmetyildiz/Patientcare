const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetPurchaseorderstocks(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('purchaseorderstockview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Purchaseorderstocks View', req.language, { en: 'Purchaseorderstocks View', tr: 'Purchaseorderstocks View' }))
    }
}

async function GetPurchaseorderstock(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('purchaseorderstockview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Purchaseorderstocks View', req.language, { en: 'Purchaseorderstocks View', tr: 'Purchaseorderstocks View' }))
    }
}

async function AddPurchaseorderstock(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('purchaseorderstockadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Purchaseorderstocks Add', req.language, { en: 'Purchaseorderstocks Add', tr: 'Purchaseorderstocks Add' }))
    }
}

async function UpdatePurchaseorderstock(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('purchaseorderstockupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Purchaseorderstocks Update', req.language, { en: 'Purchaseorderstocks Update', tr: 'Purchaseorderstocks Update' }))
    }
}

async function ApprovePurchaseorderstock(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('purchaseorderstockupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Purchaseorderstocks Update', req.language, { en: 'Purchaseorderstocks Update', tr: 'Purchaseorderstocks Update' }))
    }
}

async function UpdatePurchaseorderstock(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('purchaseorderstockupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Purchaseorderstocks Update', req.language, { en: 'Purchaseorderstocks Update', tr: 'Purchaseorderstocks Update' }))
    }
}

async function DeletePurchaseorderstock(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('purchaseorderstockdelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Purchaseorderstocks Delete', req.language, { en: 'Purchaseorderstocks Delete', tr: 'Purchaseorderstocks Delete' }))
    }
}

module.exports = {
    GetPurchaseorderstocks,
    GetPurchaseorderstock,
    AddPurchaseorderstock,
    UpdatePurchaseorderstock,
    DeletePurchaseorderstock,
    ApprovePurchaseorderstock,
}