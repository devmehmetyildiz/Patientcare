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

async function DeleteProfessionpresetting(req, res, next) {
    PermissionHandler(req, next, 'professionpresettingdelete')
}

module.exports = {
    GetProfessionpresettings,
    GetProfessionpresetting,
    AddProfessionpresetting,
    UpdateProfessionpresetting,
    DeleteProfessionpresetting,
}