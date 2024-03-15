const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function Register(req, res, next) {
    next()
}

async function GetUsers(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('userscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Users screen', req.language, { en: 'Users screen', tr: 'Users screen' }))
    }
}

async function GetUserscount(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('userscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Users screen', req.language, { en: 'Users screen', tr: 'Users screen' }))
    }
}

async function GetUser(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('userscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Users screen', req.language, { en: 'Users screen', tr: 'Users screen' }))
    }
}

async function Getbyusername(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('userscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Users screen', req.language, { en: 'Users screen', tr: 'Users screen' }))
    }
}

async function Getbyemail(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('userscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Users screen', req.language, { en: 'Users screen', tr: 'Users screen' }))
    }
}

async function Getusersalt(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('userscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Users screen', req.language, { en: 'Users screen', tr: 'Users screen' }))
    }
}

async function Getusertablemetaconfig(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('userscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Users screen', req.language, { en: 'Users screen', tr: 'Users screen' }))
    }
}

async function Saveusertablemetaconfig(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('userupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Users Update', req.language, { en: 'Users Update', tr: 'Users Update' }))
    }
}

async function AddUser(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('useradd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Users Add', req.language, { en: 'Users Add', tr: 'Users Add' }))
    }
}

async function UpdateUser(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('userupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Users Update', req.language, { en: 'Users Update', tr: 'Users Update' }))
    }
}

async function DeleteUser(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('userdelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Users Delete', req.language, { en: 'Users Delete', tr: 'Users Delete' }))
    }
}

async function GetActiveUsername(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('userscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Users screen', req.language, { en: 'Users screen', tr: 'Users screen' }))
    }
}

async function GetActiveUserMeta(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('userscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Users screen', req.language, { en: 'Users screen', tr: 'Users screen' }))
    }
}

async function Resettablemeta(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('userupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Users Update', req.language, { en: 'Users Update', tr: 'Users Update' }))
    }
}

async function Changepassword(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('userupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Users Update', req.language, { en: 'Users Update', tr: 'Users Update' }))
    }
}

async function UpdateUsermeta(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('userupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Users Update', req.language, { en: 'Users Update', tr: 'Users Update' }))
    }
}

module.exports = {
    GetUsers,
    GetUser,
    AddUser,
    UpdateUser,
    DeleteUser,
    Register,
    Getbyusername,
    Getusersalt,
    GetActiveUsername,
    GetActiveUserMeta,
    Getusertablemetaconfig,
    Saveusertablemetaconfig,
    Getbyemail,
    Resettablemeta,
    GetUserscount,
    Changepassword,
    UpdateUsermeta
}