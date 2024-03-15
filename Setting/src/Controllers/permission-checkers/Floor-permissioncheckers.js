const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetFloors(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('floorscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Floors screen', req.language, { en: 'screen Floors', tr: 'screen Floors' }))
    }
}

async function GetFloor(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('floorscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Floors screen', req.language, { en: 'screen Floors', tr: 'screen Floors' }))
    }
}


async function AddFloor(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('flooradd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Floors Add', req.language, { en: 'Floors Add', tr: 'Floors Add' }))
    }
}

async function FastcreateFloor(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('flooradd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Floors Add', req.language, { en: 'Floors Add', tr: 'Floors Add' }))
    }
}

async function UpdateFloor(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('floorupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Floors Update', req.language, { en: 'Floors Update', tr: 'Floors Update' }))
    }
}

async function DeleteFloor(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('floordelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Floors Delete', req.language, { en: 'Floors Delete', tr: 'Floors Delete' }))
    }
}

module.exports = {
    GetFloors,
    GetFloor,
    AddFloor,
    UpdateFloor,
    DeleteFloor,
    FastcreateFloor
}