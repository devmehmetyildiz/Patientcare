const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetTododefines(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('tododefinescreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Tododefines screen', req.language, { en: 'screen Tododefines', tr: 'screen Tododefines' }))
    }
}

async function GetTododefine(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('tododefinescreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Tododefines screen', req.language, { en: 'screen Tododefines', tr: 'screen Tododefines' }))
    }
}

async function AddTododefine(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('tododefineadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Tododefines Add', req.language, { en: 'Tododefines Add', tr: 'Tododefines Add' }))
    }
}

async function UpdateTododefine(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('tododefineupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Tododefines Update', req.language, { en: 'Tododefines Update', tr: 'Tododefines Update' }))
    }
}

async function DeleteTododefine(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('tododefinedelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Tododefines Delete', req.language, { en: 'Tododefines Delete', tr: 'Tododefines Delete' }))
    }
}

module.exports = {
    GetTododefines,
    GetTododefine,
    AddTododefine,
    UpdateTododefine,
    DeleteTododefine,
}