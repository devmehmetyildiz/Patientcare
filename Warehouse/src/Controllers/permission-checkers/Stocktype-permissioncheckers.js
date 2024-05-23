const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetStocktypes(req, res, next) {
    PermissionHandler(req, next, 'stocktypescreen')
}

async function GetStocktype(req, res, next) {
    PermissionHandler(req, next, 'stocktypescreen')
}

async function AddStocktype(req, res, next) {
    PermissionHandler(req, next, 'stocktypeadd')
}

async function UpdateStocktype(req, res, next) {
    PermissionHandler(req, next, 'stocktypeupdate')
}


async function DeleteStocktype(req, res, next) {
    PermissionHandler(req, next, 'stocktypedelete')
}


module.exports = {
    GetStocktypes,
    GetStocktype,
    AddStocktype,
    UpdateStocktype,
    DeleteStocktype,
}