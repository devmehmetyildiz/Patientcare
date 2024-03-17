const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetMakingtypes(req, res, next) {
    PermissionHandler(req, next, 'makingtypescreen')
}

async function GetMakingtype(req, res, next) {
    PermissionHandler(req, next, 'makingtypescreen')
}

async function AddMakingtype(req, res, next) {
    PermissionHandler(req, next, 'makingtypeadd')
}

async function UpdateMakingtype(req, res, next) {
    PermissionHandler(req, next, 'makingtypeupdate')
}

async function DeleteMakingtype(req, res, next) {
    PermissionHandler(req, next, 'makingtypedelete')
}

module.exports = {
    GetMakingtypes,
    GetMakingtype,
    AddMakingtype,
    UpdateMakingtype,
    DeleteMakingtype,
}