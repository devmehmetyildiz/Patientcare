const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetRoles(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('rolescreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Roles screen', req.language, { en: 'Roles screen', tr: 'Roles screen' }))
    }
}

async function GetRolescount(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('rolescreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Roles screen', req.language, { en: 'Roles screen', tr: 'Roles screen' }))
    }
}

async function GetRole(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('rolescreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Roles screen', req.language, { en: 'Roles screen', tr: 'Roles screen' }))
    }
}

async function Getprivileges(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('rolescreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Roles screen', req.language, { en: 'Roles screen', tr: 'Roles screen' }))
    }
}

async function Getprivilegegroups(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('rolescreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Roles screen', req.language, { en: 'Roles screen', tr: 'Roles screen' }))
    }
}

async function Getprivilegesbyuserid(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('rolescreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Roles screen', req.language, { en: 'Roles screen', tr: 'Roles screen' }))
    }
}

async function GetActiveuserprivileges(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('rolescreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Roles screen', req.language, { en: 'Roles screen', tr: 'Roles screen' }))
    }
}

async function AddRole(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('roleadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Roles Add', req.language, { en: 'Roles Add', tr: 'Roles Add' }))
    }
}

async function UpdateRole(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('roleupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Roles Update', req.language, { en: 'Roles Update', tr: 'Roles Update' }))
    }
}

async function DeleteRole(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('roledelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Roles Delete', req.language, { en: 'Roles Delete', tr: 'Roles Delete' }))
    }
}


module.exports = {
    GetRoles,
    GetRole,
    AddRole,
    UpdateRole,
    DeleteRole,
    Getprivilegesbyuserid,
    GetActiveuserprivileges,
    Getprivileges,
    Getprivilegegroups,
    GetRolescount
}