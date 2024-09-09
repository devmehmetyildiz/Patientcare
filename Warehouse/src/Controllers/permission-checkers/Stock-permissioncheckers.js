const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetStocks(req, res, next) {
    PermissionHandler(req, next, 'stockscreen', 'medicinescreen', 'supplyscreen')
}

async function GetStocksByWarehouseID(req, res, next) {
    PermissionHandler(req, next, 'stockscreen', 'medicinescreen', 'supplyscreen')
}

async function GetStock(req, res, next) {
    PermissionHandler(req, next, 'stockscreen', 'medicinescreen', 'supplyscreen')
}

async function AddStock(req, res, next) {
    PermissionHandler(req, next, 'stockadd', 'medicineadd', 'supplyadd')
}

async function CreateStockFromStock(req, res, next) {
    PermissionHandler(req, next, 'stockadd', 'medicineadd', 'supplyadd')
}

async function AddStockWithoutMovement(req, res, next) {
    PermissionHandler(req, next, 'stockadd', 'medicineadd', 'supplyadd')
}

async function UpdateStock(req, res, next) {
    PermissionHandler(req, next, 'stockupdate', 'medicineupdate', 'supplyupdate')
}

async function ApproveStock(req, res, next) {
    PermissionHandler(req, next, 'stockupdate', 'medicineupdate', 'supplyupdate')
}

async function ApproveStocks(req, res, next) {
    PermissionHandler(req, next, 'stockupdate', 'medicineupdate', 'supplyupdate')
}

async function DeleteStock(req, res, next) {
    PermissionHandler(req, next, 'stockdelete', 'medicinedelete', 'supplydelete')
}

async function DeleteStockByWarehouseID(req, res, next) {
    PermissionHandler(req, next, 'stockdelete', 'medicinedelete', 'supplydelete')
}

module.exports = {
    GetStocks,
    GetStocksByWarehouseID,
    GetStock,
    AddStock,
    UpdateStock,
    DeleteStock,
    ApproveStock,
    ApproveStocks,
    DeleteStockByWarehouseID,
    AddStockWithoutMovement,
    CreateStockFromStock
}