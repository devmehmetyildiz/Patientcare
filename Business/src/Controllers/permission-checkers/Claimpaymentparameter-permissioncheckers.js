const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetClaimpaymentparameters(req, res, next) {
    PermissionHandler(req, next, 'claimpaymentparameterscreen')
}

async function GetClaimpaymentparameter(req, res, next) {
    PermissionHandler(req, next, 'claimpaymentparameterscreen')
}

async function AddClaimpaymentparameter(req, res, next) {
    PermissionHandler(req, next, 'claimpaymentparameteradd')
}

async function UpdateClaimpaymentparameter(req, res, next) {
    PermissionHandler(req, next, 'claimpaymentparameterupdate')
}

async function ApproveClaimpaymentparameter(req, res, next) {
    PermissionHandler(req, next, 'claimpaymentparameterapprove')
}

async function DeactivateClaimpaymentparameter(req, res, next) {
    PermissionHandler(req, next, 'claimpaymentparameterupdate')
}

async function ActivateClaimpaymentparameter(req, res, next) {
    PermissionHandler(req, next, 'claimpaymentparameterupdate')
}

async function SavepreviewClaimpaymentparameter(req, res, next) {
    PermissionHandler(req, next, 'claimpaymentparametersavepreview')
}

async function DeleteClaimpaymentparameter(req, res, next) {
    PermissionHandler(req, next, 'claimpaymentparameterdelete')
}

module.exports = {
    GetClaimpaymentparameters,
    GetClaimpaymentparameter,
    AddClaimpaymentparameter,
    ApproveClaimpaymentparameter,
    UpdateClaimpaymentparameter,
    DeleteClaimpaymentparameter,
    ActivateClaimpaymentparameter,
    DeactivateClaimpaymentparameter,
    SavepreviewClaimpaymentparameter
}