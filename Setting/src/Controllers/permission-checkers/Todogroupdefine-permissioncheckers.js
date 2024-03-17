const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetTodogroupdefines(req, res, next) {
    PermissionHandler(req, next, 'todogroupdefinescreen')
}

async function GetTodogroupdefine(req, res, next) {
    PermissionHandler(req, next, 'todogroupdefinescreen')
}

async function AddTodogroupdefine(req, res, next) {
    PermissionHandler(req, next, 'todogroupdefineadd')
}

async function UpdateTodogroupdefine(req, res, next) {
    PermissionHandler(req, next, 'todogroupdefineupdate')
}

async function DeleteTodogroupdefine(req, res, next) {
    PermissionHandler(req, next, 'todogroupdefinedelete')
}

module.exports = {
    GetTodogroupdefines,
    GetTodogroupdefine,
    AddTodogroupdefine,
    UpdateTodogroupdefine,
    DeleteTodogroupdefine,
}