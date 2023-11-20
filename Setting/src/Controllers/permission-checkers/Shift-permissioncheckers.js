const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetShifts(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('shiftview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Shift View', req.language, { en: 'View Shift', tr: 'View Shift' }))
    }
}

async function GetShift(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('shiftview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Shift View', req.language, { en: 'View Shift', tr: 'View Shift' }))
    }
}

async function AddShift(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('shiftadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Shift Add', req.language, { en: 'Shift Add', tr: 'Shift Add' }))
    }
}

async function UpdateShift(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('shiftupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Shift Update', req.language, { en: 'Shift Update', tr: 'Shift Update' }))
    }
}

async function DeleteShift(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('shiftdelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Shift Delete', req.language, { en: 'Shift Delete', tr: 'Shift Delete' }))
    }
}

module.exports = {
    GetShifts,
    GetShift,
    AddShift,
    UpdateShift,
    DeleteShift,
}