const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetPurchaseorderstocks(req, res, next) {
    if ((req.identity.privileges && (req.identity.privileges.includes('purchaseorderstockscreen') || req.identity.privileges.includes('purchaseordermedicinescreen') || req.identity.privileges.includes('purchaseordersupplyscreen'))) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Purchaseorderstocks screen', req.language, { en: 'Purchaseorderstocks screen', tr: 'Purchaseorderstocks screen' }))
    }
}

async function GetPurchaseorderstock(req, res, next) {
    if ((req.identity.privileges && (req.identity.privileges.includes('purchaseorderstockscreen') || req.identity.privileges.includes('purchaseordermedicinescreen') || req.identity.privileges.includes('purchaseordersupplyscreen'))) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Purchaseorderstocks screen', req.language, { en: 'Purchaseorderstocks screen', tr: 'Purchaseorderstocks screen' }))
    }
}

async function AddPurchaseorderstock(req, res, next) {
    if ((req.identity.privileges && (req.identity.privileges.includes('purchaseorderstockadd') || req.identity.privileges.includes('purchaseordermedicineadd') || req.identity.privileges.includes('purchaseordersupplyadd'))) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Purchaseorderstocks Add', req.language, { en: 'Purchaseorderstocks Add', tr: 'Purchaseorderstocks Add' }))
    }
}

async function UpdatePurchaseorderstock(req, res, next) {
    if ((req.identity.privileges && (req.identity.privileges.includes('purchaseorderstockupdate') || req.identity.privileges.includes('purchaseordermedicineupdate') || req.identity.privileges.includes('purchaseordersupplyupdate'))) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Purchaseorderstocks Update', req.language, { en: 'Purchaseorderstocks Update', tr: 'Purchaseorderstocks Update' }))
    }
}

async function ApprovePurchaseorderstock(req, res, next) {
    if ((req.identity.privileges && (req.identity.privileges.includes('purchaseorderstockupdate') || req.identity.privileges.includes('purchaseordermedicineupdate') || req.identity.privileges.includes('purchaseordersupplyupdate'))) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Purchaseorderstocks Update', req.language, { en: 'Purchaseorderstocks Update', tr: 'Purchaseorderstocks Update' }))
    }
}

async function ApprovePurchaseorderstocks(req, res, next) {
    if ((req.identity.privileges && (req.identity.privileges.includes('purchaseorderstockupdate') || req.identity.privileges.includes('purchaseordermedicineupdate') || req.identity.privileges.includes('purchaseordersupplyupdate'))) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Purchaseorderstocks Update', req.language, { en: 'Purchaseorderstocks Update', tr: 'Purchaseorderstocks Update' }))
    }
}

async function UpdatePurchaseorderstock(req, res, next) {
    if ((req.identity.privileges && (req.identity.privileges.includes('purchaseorderstockupdate') || req.identity.privileges.includes('purchaseordermedicineupdate') || req.identity.privileges.includes('purchaseordersupplyupdate'))) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Purchaseorderstocks Update', req.language, { en: 'Purchaseorderstocks Update', tr: 'Purchaseorderstocks Update' }))
    }
}

async function DeletePurchaseorderstock(req, res, next) {
    if ((req.identity.privileges && (req.identity.privileges.includes('purchaseorderstockdelete') || req.identity.privileges.includes('purchaseordermedicinedelete') || req.identity.privileges.includes('purchaseordersupplydelete'))) || permissionchecker(req)) {
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
    ApprovePurchaseorderstocks,
}