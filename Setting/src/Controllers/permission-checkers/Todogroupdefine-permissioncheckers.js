const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetTodogroupdefines(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('todogroupdefineview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Todogroupdefines View', req.language, { en: 'View Todogroupdefines', tr: 'View Todogroupdefines' }))
    }
}

async function GetTodogroupdefine(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('todogroupdefineview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Todogroupdefines View', req.language, { en: 'View Todogroupdefines', tr: 'View Todogroupdefines' }))
    }
}

async function AddTodogroupdefine(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('todogroupdefineadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Todogroupdefines Add', req.language, { en: 'Todogroupdefines Add', tr: 'Todogroupdefines Add' }))
    }
}

async function UpdateTodogroupdefine(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('todogroupdefineupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Todogroupdefines Update', req.language, { en: 'Todogroupdefines Update', tr: 'Todogroupdefines Update' }))
    }
}

async function DeleteTodogroupdefine(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('todogroupdefinedelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Todogroupdefines Delete', req.language, { en: 'Todogroupdefines Delete', tr: 'Todogroupdefines Delete' }))
    }
}

module.exports = {
    GetTodogroupdefines,
    GetTodogroupdefine,
    AddTodogroupdefine,
    UpdateTodogroupdefine,
    DeleteTodogroupdefine,
}