const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetStations(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('stationview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Stations View', req.language, { en: 'View Stations', tr: 'View Stations' }))
    }
}

async function GetStation(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('stationview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Stations View', req.language, { en: 'View Stations', tr: 'View Stations' }))
    }
}


async function AddStation(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('stationadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Stations Add', req.language, { en: 'Stations Add', tr: 'Stations Add' }))
    }
}

async function UpdateStation(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('stationupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Stations Update', req.language, { en: 'Stations Update', tr: 'Stations Update' }))
    }
}

async function DeleteStation(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('stationdelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Stations Delete', req.language, { en: 'Stations Delete', tr: 'Stations Delete' }))
    }
}

module.exports = {
    GetStations,
    GetStation,
    AddStation,
    UpdateStation,
    DeleteStation,
}