const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetStocks(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('stockview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Stocks View', req.language, { en: 'Stocks View', tr: 'Stocks View' }))
    }
}

async function GetStock(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('stockview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Stocks View', req.language, { en: 'Stocks View', tr: 'Stocks View' }))
    }
}

async function AddStock(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('stockadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Stocks Add', req.language, { en: 'Stocks Add', tr: 'Stocks Add' }))
    }
}

async function UpdateStock(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('stockupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Stocks Update', req.language, { en: 'Stocks Update', tr: 'Stocks Update' }))
    }
}

async function ApproveStock(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('stockupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Stocks Update', req.language, { en: 'Stocks Update', tr: 'Stocks Update' }))
    }
}

async function ApproveStocks(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('stockupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Stocks Update', req.language, { en: 'Stocks Update', tr: 'Stocks Update' }))
    }
}

async function DeleteStock(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('stockdelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Stocks Delete', req.language, { en: 'Stocks Delete', tr: 'Stocks Delete' }))
    }
}

async function TransfertoPatient(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('stockupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Stocks Update', req.language, { en: 'Stocks Update', tr: 'Stocks Update' }))
    }
}

async function TransferfromPatient(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('stockupdate')) || permissionchecker(req)) {
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