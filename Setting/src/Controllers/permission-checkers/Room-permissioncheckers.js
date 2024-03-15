const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetRooms(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('roomscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Rooms screen', req.language, { en: 'screen Rooms', tr: 'screen Rooms' }))
    }
}

async function GetRoom(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('roomscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Rooms screen', req.language, { en: 'screen Rooms', tr: 'screen Rooms' }))
    }
}

async function AddRoom(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('roomadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Rooms Add', req.language, { en: 'Rooms Add', tr: 'Rooms Add' }))
    }
}

async function UpdateRoom(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('roomupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Rooms Update', req.language, { en: 'Rooms Update', tr: 'Rooms Update' }))
    }
}

async function DeleteRoom(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('roomdelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Rooms Delete', req.language, { en: 'Rooms Delete', tr: 'Rooms Delete' }))
    }
}

module.exports = {
    GetRooms,
    GetRoom,
    AddRoom,
    UpdateRoom,
    DeleteRoom,
}