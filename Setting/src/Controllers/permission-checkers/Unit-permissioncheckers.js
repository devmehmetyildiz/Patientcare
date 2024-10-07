const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetUnits(req, res, next) {
    PermissionHandler(req, next, 'unitscreen')
}

async function GetUnit(req, res, next) {
    PermissionHandler(req, next, 'unitscreen')
}

async function AddUnit(req, res, next) {
    PermissionHandler(req, next, 'unitadd')
}

async function UpdateUnit(req, res, next) {
    PermissionHandler(req, next, 'unitupdate')
}

async function DeleteUnit(req, res, next) {
    PermissionHandler(req, next, 'unitdelete')
}

module.exports = {
    GetUnits,
    GetUnit,
    AddUnit,
    UpdateUnit,
    DeleteUnit,
}