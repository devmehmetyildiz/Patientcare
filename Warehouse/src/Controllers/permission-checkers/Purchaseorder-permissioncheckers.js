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

async function CheckPurchaseorder(req, res, next) {
    PermissionHandler(req, next, 'purchaseorderupdate')
}

async function ApprovePurchaseorder(req, res, next) {
    PermissionHandler(req, next, 'purchaseorderupdate')
}

async function CancelCheckPurchaseorder(req, res, next) {
    PermissionHandler(req, next, 'purchaseorderupdate')
}

async function CancelApprovePurchaseorder(req, res, next) {
    PermissionHandler(req, next, 'purchaseorderupdate')
}

async function CompletePurchaseorder(req, res, next) {
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
    CheckPurchaseorder,
    ApprovePurchaseorder,
    CompletePurchaseorder,
    CancelCheckPurchaseorder,
    CancelApprovePurchaseorder
}