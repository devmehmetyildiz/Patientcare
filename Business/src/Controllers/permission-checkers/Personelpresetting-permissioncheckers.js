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

async function SavepreviewPersonelpresetting(req, res, next) {
    PermissionHandler(req, next, 'personelpresettingsavepreview')
}

async function ApprovePersonelpresetting(req, res, next) {
    PermissionHandler(req, next, 'personelpresettingapprove')
}

async function CompletePersonelpresetting(req, res, next) {
    PermissionHandler(req, next, 'personelpresettingcomplate')
}

async function ActivatePersonelpresetting(req, res, next) {
    PermissionHandler(req, next, 'personelpresettingupdate')
}

async function DeactivatePersonelpresetting(req, res, next) {
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
    SavepreviewPersonelpresetting,
    ApprovePersonelpresetting,
    CompletePersonelpresetting,
    ActivatePersonelpresetting,
    DeactivatePersonelpresetting,
    DeletePersonelpresetting,
}