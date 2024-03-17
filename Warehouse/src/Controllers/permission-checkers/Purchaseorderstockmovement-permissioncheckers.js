const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetPurchaseorderstockmovements(req, res, next) {
    PermissionHandler(req, next, 'purchaseorderstockmovementscreen')
}

async function GetPurchaseorderstockmovement(req, res, next) {
    PermissionHandler(req, next, 'purchaseorderstockmovementscreen')
}

async function AddPurchaseorderstockmovement(req, res, next) {
    PermissionHandler(req, next, 'purchaseorderstockmovementadd')
}

async function UpdatePurchaseorderstockmovement(req, res, next) {
    PermissionHandler(req, next, 'purchaseorderstockmovementupdate')
}

async function ApprovePurchaseorderstockmovement(req, res, next) {
    PermissionHandler(req, next, 'purchaseorderstockmovementupdate')
}

async function ApprovePurchaseorderstockmovements(req, res, next) {
    PermissionHandler(req, next, 'purchaseorderstockmovementupdate')
}

async function DeletePurchaseorderstockmovement(req, res, next) {
    PermissionHandler(req, next, 'purchaseorderstockmovementdelete')
}

module.exports = {
    GetPurchaseorderstockmovements,
    GetPurchaseorderstockmovement,
    AddPurchaseorderstockmovement,
    UpdatePurchaseorderstockmovement,
    DeletePurchaseorderstockmovement,
    ApprovePurchaseorderstockmovement,
    ApprovePurchaseorderstockmovements
}