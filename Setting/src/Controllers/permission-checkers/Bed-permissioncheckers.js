const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetBeds(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('bedview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Beds View', req.language, { en: 'View Beds', tr: 'View Beds' }))
    }
}

async function GetBed(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('bedview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Beds View', req.language, { en: 'View Beds', tr: 'View Beds' }))
    }
}

async function AddBed(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('bedadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Beds Add', req.language, { en: 'Beds Add', tr: 'Beds Add' }))
    }
}

async function UpdateBed(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('bedupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Beds Update', req.language, { en: 'Beds Update', tr: 'Beds Update' }))
    }
}

async function ChangeBedstatus(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('bedupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Beds Update', req.language, { en: 'Beds Update', tr: 'Beds Update' }))
    }
}

async function DeleteBed(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('beddelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Beds Delete', req.language, { en: 'Beds Delete', tr: 'Beds Delete' }))
    }
}

module.exports = {
    GetBeds,
    GetBed,
    AddBed,
    UpdateBed,
    DeleteBed,
    ChangeBedstatus
}