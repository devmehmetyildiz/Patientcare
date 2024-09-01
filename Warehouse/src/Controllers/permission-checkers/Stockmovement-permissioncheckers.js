const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetStockmovements(req, res, next) {
    PermissionHandler(req, next, 'stockmovementscreen')
}

async function GetStockmovement(req, res, next) {
    PermissionHandler(req, next, 'stockmovementscreen')
}

async function AddStockmovement(req, res, next) {
    PermissionHandler(req, next, 'stockmovementadd')
}

async function AddStockmovements(req, res, next) {
    PermissionHandler(req, next, 'stockmovementadd')
}

async function UpdateStockmovement(req, res, next) {
    PermissionHandler(req, next, 'stockmovementupdate')
}

async function ApproveStockmovement(req, res, next) {
    PermissionHandler(req, next, 'stockmovementupdate')
}

async function ApproveStockmovements(req, res, next) {
    PermissionHandler(req, next, 'stockmovementupdate')
}

async function DeleteStockmovement(req, res, next) {
    PermissionHandler(req, next, 'stockmovementdelete')
}


module.exports = {
    GetStockmovements,
    GetStockmovement,
    AddStockmovement,
    UpdateStockmovement,
    DeleteStockmovement,
    ApproveStockmovement,
    ApproveStockmovements,
    AddStockmovements
}