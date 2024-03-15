const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetPurchaseorders(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('purchaseorderscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Purchaseorders screen', req.language, { en: 'Purchaseorders screen', tr: 'Purchaseorders screen' }))
    }
}

async function GetPurchaseorder(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('purchaseorderscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Purchaseorders screen', req.language, { en: 'Purchaseorders screen', tr: 'Purchaseorders screen' }))
    }
}

async function AddPurchaseorder(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('purchaseorderadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Purchaseorders Add', req.language, { en: 'Purchaseorders Add', tr: 'Purchaseorders Add' }))
    }
}

async function UpdatePurchaseorder(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('purchaseorderupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Purchaseorders Update', req.language, { en: 'Purchaseorders Update', tr: 'Purchaseorders Update' }))
    }
}

async function CompletePurchaseorder(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('purchaseorderupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Purchaseorders Update', req.language, { en: 'Purchaseorders Update', tr: 'Purchaseorders Update' }))
    }
}

async function DeactivePurchaseorder(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('purchaseorderupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Purchaseorders Update', req.language, { en: 'Purchaseorders Update', tr: 'Purchaseorders Update' }))
    }
}

async function DeletePurchaseorder(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('purchaseorderdelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Purchaseorders Delete', req.language, { en: 'Purchaseorders Delete', tr: 'Purchaseorders Delete' }))
    }
}

module.exports = {
    GetPurchaseorders,
    GetPurchaseorder,
    AddPurchaseorder,
    UpdatePurchaseorder,
    DeletePurchaseorder,
    CompletePurchaseorder,
    DeactivePurchaseorder
}