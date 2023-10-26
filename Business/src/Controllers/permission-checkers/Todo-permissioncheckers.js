const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetTodos(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('todoview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Todos View', req.language, { en: 'Todos View', tr: 'Todos View' }))
    }
}

async function GetTodosbyPatientID(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('todoview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Todos View', req.language, { en: 'Todos View', tr: 'Todos View' }))
    }
}

async function GetTodo(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('todoview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Todos View', req.language, { en: 'Todos View', tr: 'Todos View' }))
    }
}

async function AddTodo(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('todoadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Todos Add', req.language, { en: 'Todos Add', tr: 'Todos Add' }))
    }
}

async function AddPatienttodolist(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('todoadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Todos Add', req.language, { en: 'Todos Add', tr: 'Todos Add' }))
    }
}

async function UpdateTodo(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('todoupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Todos Update', req.language, { en: 'Todos Update', tr: 'Todos Update' }))
    }
}

async function ApproveTodo(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('todoupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Todos Update', req.language, { en: 'Todos Update', tr: 'Todos Update' }))
    }
}

async function DeleteTodo(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('tododelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Todos Delete', req.language, { en: 'Todos Delete', tr: 'Todos Delete' }))
    }
}

module.exports = {
    GetTodos,
    GetTodo,
    AddTodo,
    UpdateTodo,
    DeleteTodo,
    AddPatienttodolist,
    GetTodosbyPatientID,
    ApproveTodo
}