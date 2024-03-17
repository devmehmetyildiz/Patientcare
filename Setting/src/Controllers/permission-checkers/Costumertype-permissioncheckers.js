const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetCostumertypes(req, res, next) {
    PermissionHandler(req, next, 'costumertypescreen')
}

async function GetCostumertype(req, res, next) {
    PermissionHandler(req, next, 'costumertypeadd')
}

async function AddCostumertype(req, res, next) {
    PermissionHandler(req, next, 'costumertypeadd')
}

async function UpdateCostumertype(req, res, next) {
    PermissionHandler(req, next, 'costumertypeupdate')
}

async function DeleteCostumertype(req, res, next) {
    PermissionHandler(req, next, 'costumertypedelete')
}

module.exports = {
    GetCostumertypes,
    GetCostumertype,
    AddCostumertype,
    UpdateCostumertype,
    DeleteCostumertype,
}