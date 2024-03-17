const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetWarehouses(req, res, next) {
    PermissionHandler(req, next, 'warehousescreen')
}

async function GetWarehouse(req, res, next) {
    PermissionHandler(req, next, 'warehousescreen')
}

async function AddWarehouse(req, res, next) {
    PermissionHandler(req, next, 'warehouseadd')
}

async function UpdateWarehouse(req, res, next) {
    PermissionHandler(req, next, 'warehouseupdate')
}

async function DeleteWarehouse(req, res, next) {
    PermissionHandler(req, next, 'warehousedelete')
}

module.exports = {
    GetWarehouses,
    GetWarehouse,
    AddWarehouse,
    UpdateWarehouse,
    DeleteWarehouse,
}