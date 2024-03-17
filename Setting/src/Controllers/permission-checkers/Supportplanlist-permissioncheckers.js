const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetSupportplanlists(req, res, next) {
    PermissionHandler(req, next, 'supportplanlistscreen')
}

async function GetSupportplanlist(req, res, next) {
    PermissionHandler(req, next, 'supportplanlistscreen')
}

async function AddSupportplanlist(req, res, next) {
    PermissionHandler(req, next, 'supportplanlistadd')
}

async function UpdateSupportplanlist(req, res, next) {
    PermissionHandler(req, next, 'supportplanlistupdate')
}

async function DeleteSupportplanlist(req, res, next) {
    PermissionHandler(req, next, 'supportplanlistdelete')
}

module.exports = {
    GetSupportplanlists,
    GetSupportplanlist,
    AddSupportplanlist,
    UpdateSupportplanlist,
    DeleteSupportplanlist,
}