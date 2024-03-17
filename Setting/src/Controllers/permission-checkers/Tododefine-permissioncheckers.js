const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetTododefines(req, res, next) {
    PermissionHandler(req, next, 'tododefinescreen')
}

async function GetTododefine(req, res, next) {
    PermissionHandler(req, next, 'tododefinescreen')
}

async function AddTododefine(req, res, next) {
    PermissionHandler(req, next, 'tododefineadd')
}

async function UpdateTododefine(req, res, next) {
    PermissionHandler(req, next, 'tododefineupdate')
}

async function DeleteTododefine(req, res, next) {
    PermissionHandler(req, next, 'tododefinedelete')
}

module.exports = {
    GetTododefines,
    GetTododefine,
    AddTododefine,
    UpdateTododefine,
    DeleteTododefine,
}