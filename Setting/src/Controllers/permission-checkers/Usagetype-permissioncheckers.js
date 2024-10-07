const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetUsagetypes(req, res, next) {
    PermissionHandler(req, next, 'usagetypescreen')
}

async function GetUsagetype(req, res, next) {
    PermissionHandler(req, next, 'usagetypescreen')
}

async function AddUsagetype(req, res, next) {
    PermissionHandler(req, next, 'usagetypeadd')
}

async function UpdateUsagetype(req, res, next) {
    PermissionHandler(req, next, 'usagetypeupdate')
}

async function DeleteUsagetype(req, res, next) {
    PermissionHandler(req, next, 'usagetypedelete')
}

module.exports = {
    GetUsagetypes,
    GetUsagetype,
    AddUsagetype,
    UpdateUsagetype,
    DeleteUsagetype,
}