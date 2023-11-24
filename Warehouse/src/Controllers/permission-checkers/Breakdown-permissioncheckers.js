const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetBreakdowns(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('breakdownview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Breakdowns View', req.language, { en: 'Breakdowns View', tr: 'Breakdowns View' }))
    }
}

async function GetBreakdown(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('breakdownview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Breakdowns View', req.language, { en: 'Breakdowns View', tr: 'Breakdowns View' }))
    }
}

async function AddBreakdown(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('breakdownadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Breakdowns Add', req.language, { en: 'Breakdowns Add', tr: 'Breakdowns Add' }))
    }
}

async function UpdateBreakdown(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('breakdownupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Breakdowns Update', req.language, { en: 'Breakdowns Update', tr: 'Breakdowns Update' }))
    }
}

async function DeleteBreakdown(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('breakdowndelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Breakdowns Delete', req.language, { en: 'Breakdowns Delete', tr: 'Breakdowns Delete' }))
    }
}

module.exports = {
    GetBreakdowns,
    GetBreakdown,
    AddBreakdown,
    UpdateBreakdown,
    DeleteBreakdown,
}