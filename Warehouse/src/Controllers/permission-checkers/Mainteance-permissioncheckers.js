const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetMainteancies(req, res, next) {
    PermissionHandler(req, next, 'mainteancescreen')
}

async function GetMainteance(req, res, next) {
    PermissionHandler(req, next, 'mainteancescreen')
}

async function AddMainteance(req, res, next) {
    PermissionHandler(req, next, 'mainteanceadd')
}

async function UpdateMainteance(req, res, next) {
    PermissionHandler(req, next, 'mainteanceupdate')
}

async function CompleteMainteance(req, res, next) {
    PermissionHandler(req, next, 'mainteanceupdate')
}

async function DeleteMainteance(req, res, next) {
    PermissionHandler(req, next, 'mainteancedelete')
}

module.exports = {
    GetMainteancies,
    GetMainteance,
    AddMainteance,
    UpdateMainteance,
    DeleteMainteance,
    CompleteMainteance
}