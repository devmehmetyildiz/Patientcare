const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetPurchaseorderstocks(req, res, next) {
    PermissionHandler(req, next, 'purchaseorderstockscreen', 'purchaseordermedicinescreen', 'purchaseordersupplyscreen')
}

async function GetPurchaseorderstock(req, res, next) {
    PermissionHandler(req, next, 'purchaseorderstockscreen', 'purchaseordermedicinescreen', 'purchaseordersupplyscreen')
}

async function AddPurchaseorderstock(req, res, next) {
    PermissionHandler(req, next, 'purchaseorderstockadd', 'purchaseordermedicineadd', 'purchaseordersupplyadd')
}

async function UpdatePurchaseorderstock(req, res, next) {
    PermissionHandler(req, next, 'purchaseorderstockupdate', 'purchaseordermedicineupdate', 'purchaseordersupplyupdate')
}

async function ApprovePurchaseorderstock(req, res, next) {
    PermissionHandler(req, next, 'purchaseorderstockupdate', 'purchaseordermedicineupdate', 'purchaseordersupplyupdate')
}

async function ApprovePurchaseorderstocks(req, res, next) {
    PermissionHandler(req, next, 'purchaseorderstockupdate', 'purchaseordermedicineupdate', 'purchaseordersupplyupdate')
}

async function UpdatePurchaseorderstock(req, res, next) {
    PermissionHandler(req, next, 'purchaseorderstockupdate', 'purchaseordermedicineupdate', 'purchaseordersupplyupdate')

}

async function DeletePurchaseorderstock(req, res, next) {
    PermissionHandler(req, next, 'purchaseorderstockdelete', 'purchaseordermedicinedelete', 'purchaseordersupplydelete')
}

module.exports = {
    GetPurchaseorderstocks,
    GetPurchaseorderstock,
    AddPurchaseorderstock,
    UpdatePurchaseorderstock,
    DeletePurchaseorderstock,
    ApprovePurchaseorderstock,
    ApprovePurchaseorderstocks,
}