const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetPurchaseorders(req, res, next) {
    PermissionHandler(req, next, 'purchaseorderscreen')
}

async function GetPurchaseorder(req, res, next) {
    PermissionHandler(req, next, 'purchaseorderscreen')
}

async function AddPurchaseorder(req, res, next) {
    PermissionHandler(req, next, 'purchaseorderadd')
}

async function UpdatePurchaseorder(req, res, next) {
    PermissionHandler(req, next, 'purchaseorderupdate')
}

async function CompletePurchaseorder(req, res, next) {
    PermissionHandler(req, next, 'purchaseorderupdate')
}

async function DeactivePurchaseorder(req, res, next) {
    PermissionHandler(req, next, 'purchaseorderupdate')
}

async function DeletePurchaseorder(req, res, next) {
    PermissionHandler(req, next, 'purchaseorderdelete')
}

module.exports = {
    GetPurchaseorders,
    GetPurchaseorder,
    AddPurchaseorder,
    UpdatePurchaseorder,
    DeletePurchaseorder,
    CompletePurchaseorder,
    DeactivePurchaseorder
}