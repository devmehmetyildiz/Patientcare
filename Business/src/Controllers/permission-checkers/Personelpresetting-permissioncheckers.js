const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetPersonelpresettings(req, res, next) {
    PermissionHandler(req, next, 'personelpresettingscreen')
}

async function GetPersonelpresetting(req, res, next) {
    PermissionHandler(req, next, 'personelpresettingscreen')
}

async function AddPersonelpresetting(req, res, next) {
    PermissionHandler(req, next, 'personelpresettingadd')
}

async function UpdatePersonelpresetting(req, res, next) {
    PermissionHandler(req, next, 'personelpresettingupdate')
}

async function DeletePersonelpresetting(req, res, next) {
    PermissionHandler(req, next, 'personelpresettingdelete')
}

module.exports = {
    GetPersonelpresettings,
    GetPersonelpresetting,
    AddPersonelpresetting,
    UpdatePersonelpresetting,
    DeletePersonelpresetting,
}