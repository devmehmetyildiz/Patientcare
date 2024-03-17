const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetSupportplans(req, res, next) {
    PermissionHandler(req, next, 'supportplanscreen')
}

async function GetSupportplan(req, res, next) {
    PermissionHandler(req, next, 'supportplanscreen')
}

async function AddSupportplan(req, res, next) {
    PermissionHandler(req, next, 'supportplanadd')
}

async function UpdateSupportplan(req, res, next) {
    PermissionHandler(req, next, 'supportplanupdate')
}

async function DeleteSupportplan(req, res, next) {
    PermissionHandler(req, next, 'supportplandelete')
}

module.exports = {
    GetSupportplans,
    GetSupportplan,
    AddSupportplan,
    UpdateSupportplan,
    DeleteSupportplan,
}