const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetPeriods(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('periodview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Periods View', req.language, { en: 'View Periods', tr: 'View Periods' }))
    }
}

async function GetPeriod(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('periodview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Periods View', req.language, { en: 'View Periods', tr: 'View Periods' }))
    }
}

async function AddPeriod(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('periodadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Periods Add', req.language, { en: 'Periods Add', tr: 'Periods Add' }))
    }
}

async function UpdatePeriod(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('periodupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Periods Update', req.language, { en: 'Periods Update', tr: 'Periods Update' }))
    }
}

async function DeletePeriod(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('perioddelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Periods View', req.language, { en: 'Periods Delete', tr: 'Periods Delete' }))
    }
}

module.exports = {
    GetPeriods,
    GetPeriod,
    AddPeriod,
    UpdatePeriod,
    DeletePeriod,
}