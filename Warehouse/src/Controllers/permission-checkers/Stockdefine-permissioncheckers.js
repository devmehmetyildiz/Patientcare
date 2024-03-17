const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetStockdefines(req, res, next) {
    PermissionHandler(req, next, 'stockdefinescreen')
}

async function GetStockdefine(req, res, next) {
    PermissionHandler(req, next, 'stockdefinescreen')
}

async function AddStockdefine(req, res, next) {
    PermissionHandler(req, next, 'stockdefineadd')
}

async function UpdateStockdefine(req, res, next) {
    PermissionHandler(req, next, 'stockdefineupdate')
}

async function DeleteStockdefine(req, res, next) {
    PermissionHandler(req, next, 'stockdefinedelete')
}

module.exports = {
    GetStockdefines,
    GetStockdefine,
    AddStockdefine,
    UpdateStockdefine,
    DeleteStockdefine,
}