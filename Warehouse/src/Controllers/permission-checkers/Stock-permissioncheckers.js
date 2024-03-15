const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetStocks(req, res, next) {
    if ((req.identity.privileges && (req.identity.privileges.includes('stockscreen') || req.identity.privileges.includes('medicinescreen') || req.identity.privileges.includes('supplyscreen'))) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Stocks screen', req.language, { en: 'Stocks screen', tr: 'Stocks screen' }))
    }
}

async function GetStock(req, res, next) {
    if ((req.identity.privileges && (req.identity.privileges.includes('stockscreen') || req.identity.privileges.includes('medicinescreen') || req.identity.privileges.includes('supplyscreen'))) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Stocks screen', req.language, { en: 'Stocks screen', tr: 'Stocks screen' }))
    }
}

async function AddStock(req, res, next) {
    if ((req.identity.privileges && (req.identity.privileges.includes('stockadd') || req.identity.privileges.includes('medicineadd') || req.identity.privileges.includes('supplyadd'))) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Stocks Add', req.language, { en: 'Stocks Add', tr: 'Stocks Add' }))
    }
}

async function UpdateStock(req, res, next) {
    if ((req.identity.privileges && (req.identity.privileges.includes('stockupdate') || req.identity.privileges.includes('medicineupdate') || req.identity.privileges.includes('supplyupdate'))) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Stocks Update', req.language, { en: 'Stocks Update', tr: 'Stocks Update' }))
    }
}

async function ApproveStock(req, res, next) {
    if ((req.identity.privileges && (req.identity.privileges.includes('stockupdate') || req.identity.privileges.includes('medicineupdate') || req.identity.privileges.includes('supplyupdate'))) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Stocks Update', req.language, { en: 'Stocks Update', tr: 'Stocks Update' }))
    }
}

async function ApproveStocks(req, res, next) {
    if ((req.identity.privileges && (req.identity.privileges.includes('stockupdate') || req.identity.privileges.includes('medicineupdate') || req.identity.privileges.includes('supplyupdate'))) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Stocks Update', req.language, { en: 'Stocks Update', tr: 'Stocks Update' }))
    }
}

async function DeleteStock(req, res, next) {
    if ((req.identity.privileges && (req.identity.privileges.includes('stockdelete') || req.identity.privileges.includes('medicinedelete') || req.identity.privileges.includes('supplydelete'))) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Stocks Delete', req.language, { en: 'Stocks Delete', tr: 'Stocks Delete' }))
    }
}

async function TransfertoPatient(req, res, next) {
    if ((req.identity.privileges && (req.identity.privileges.includes('stockupdate') || req.identity.privileges.includes('medicineupdate') || req.identity.privileges.includes('supplyupdate'))) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Stocks Update', req.language, { en: 'Stocks Update', tr: 'Stocks Update' }))
    }
}

async function TransferfromPatient(req, res, next) {
    if ((req.identity.privileges && (req.identity.privileges.includes('stockupdate') || req.identity.privileges.includes('medicineupdate') || req.identity.privileges.includes('supplyupdate'))) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Stocks Update', req.language, { en: 'Stocks Update', tr: 'Stocks Update' }))
    }
}

module.exports = {
    GetStocks,
    GetStock,
    AddStock,
    UpdateStock,
    DeleteStock,
    ApproveStock,
    ApproveStocks,
    TransferfromPatient,
    TransfertoPatient
}