const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetStocks(req, res, next) {
    PermissionHandler(req, next, 'stockscreen', 'medicinescreen', 'supplyscreen')
}

async function GetStock(req, res, next) {
    PermissionHandler(req, next, 'stockscreen', 'medicinescreen', 'supplyscreen')
}

async function AddStock(req, res, next) {
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

async function TransfertoPatient(req, res, next) {
    PermissionHandler(req, next, 'stockupdate', 'medicineupdate', 'supplyupdate')

}

async function TransferfromPatient(req, res, next) {
    PermissionHandler(req, next, 'stockupdate', 'medicineupdate', 'supplyupdate')
}

module.exports = {
    GetStocks,
    GetStock,
    AddStock,
    UpdateStock,
    DeleteStock,
    ApproveStock,
    ApproveStocks,
    TransferfromPatient,
    TransfertoPatient
}