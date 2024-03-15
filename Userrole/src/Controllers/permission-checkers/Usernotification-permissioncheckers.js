const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetUsernotifications(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('usernotificationscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Usernotifications screen', req.language, { en: 'Usernotifications screen', tr: 'Usernotifications screen' }))
    }
}

async function GetUsernotification(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('usernotificationscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Usernotifications screen', req.language, { en: 'Usernotifications screen', tr: 'Usernotifications screen' }))
    }
}

async function GetUsernotificationsbyUserid(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('usernotificationscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Usernotifications screen', req.language, { en: 'Usernotifications screen', tr: 'Usernotifications screen' }))
    }
}
async function AddUsernotification(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('usernotificationadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Usernotifications Add', req.language, { en: 'Usernotifications Add', tr: 'Usernotifications Add' }))
    }
}
async function AddUsernotificationbyrole(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('usernotificationadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Usernotifications Add', req.language, { en: 'Usernotifications Add', tr: 'Usernotifications Add' }))
    }
}

async function UpdateUsernotification(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('usernotificationupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Usernotifications Update', req.language, { en: 'Usernotifications Update', tr: 'Usernotifications Update' }))
    }
}
async function UpdateUsernotifications(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('usernotificationupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Usernotifications Update', req.language, { en: 'Usernotifications Update', tr: 'Usernotifications Update' }))
    }
}

async function DeleteUsernotification(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('usernotificationdelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Usernotifications Delete', req.language, { en: 'Usernotifications Delete', tr: 'Usernotifications Delete' }))
    }
}

async function DeleteUsernotificationbyid(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('usernotificationdelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Usernotifications Delete', req.language, { en: 'Usernotifications Delete', tr: 'Usernotifications Delete' }))
    }
}

async function DeleteUsernotificationbyidreaded(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('usernotificationdelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Usernotifications Delete', req.language, { en: 'Usernotifications Delete', tr: 'Usernotifications Delete' }))
    }
}


module.exports = {
    GetUsernotifications,
    GetUsernotification,
    AddUsernotification,
    UpdateUsernotification,
    DeleteUsernotification,
    GetUsernotificationsbyUserid,
    UpdateUsernotifications,
    DeleteUsernotificationbyid,
    DeleteUsernotificationbyidreaded,
    AddUsernotificationbyrole
}