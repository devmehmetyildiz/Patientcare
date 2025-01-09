const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetProfessionpresettings(req, res, next) {
    PermissionHandler(req, next, 'professionpresettingscreen')
}

async function GetProfessionpresetting(req, res, next) {
    PermissionHandler(req, next, 'professionpresettingscreen')
}

async function AddProfessionpresetting(req, res, next) {
    PermissionHandler(req, next, 'professionpresettingadd')
}

async function UpdateProfessionpresetting(req, res, next) {
    PermissionHandler(req, next, 'professionpresettingupdate')
}

async function SavepreviewProfessionpresetting(req, res, next) {
    PermissionHandler(req, next, 'professionpresettingupdate')
}

async function ApproveProfessionpresetting(req, res, next) {
    PermissionHandler(req, next, 'professionpresettingupdate')
}

async function CompleteProfessionpresetting(req, res, next) {
    PermissionHandler(req, next, 'professionpresettingupdate')
}

async function ActivateProfessionpresetting(req, res, next) {
    PermissionHandler(req, next, 'professionpresettingupdate')
}

async function DeactivateProfessionpresetting(req, res, next) {
    PermissionHandler(req, next, 'professionpresettingupdate')
}

async function DeleteProfessionpresetting(req, res, next) {
    PermissionHandler(req, next, 'professionpresettingdelete')
}

module.exports = {
    GetProfessionpresettings,
    GetProfessionpresetting,
    AddProfessionpresetting,
    UpdateProfessionpresetting,
    SavepreviewProfessionpresetting,
    ApproveProfessionpresetting,
    CompleteProfessionpresetting,
    ActivateProfessionpresetting,
    DeactivateProfessionpresetting,
    DeleteProfessionpresetting,
}