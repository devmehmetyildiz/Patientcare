const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetShifts(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('shiftscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Shift screen', req.language, { en: 'screen Shift', tr: 'screen Shift' }))
    }
}
async function GetShiftrequests(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('shiftscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Shift screen', req.language, { en: 'screen Shift', tr: 'screen Shift' }))
    }
}

async function GetShiftrequest(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('shiftscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Shift screen', req.language, { en: 'screen Shift', tr: 'screen Shift' }))
    }
}

async function GetPersonelshifts(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('shiftscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Shift screen', req.language, { en: 'screen Shift', tr: 'screen Shift' }))
    }
}

async function GetShift(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('shiftscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Shift screen', req.language, { en: 'screen Shift', tr: 'screen Shift' }))
    }
}

async function AddShift(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('shiftadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Shift Add', req.language, { en: 'Shift Add', tr: 'Shift Add' }))
    }
}

async function Addshiftperiod(req, res, next) {
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

async function DeleteShiftrequest(req, res, next) {
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
    Addshiftperiod,
    GetShiftrequests,
    GetPersonelshifts,
    GetShiftrequest,
    DeleteShiftrequest
}