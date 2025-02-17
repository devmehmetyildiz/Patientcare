const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetClaimpayments(req, res, next) {
    PermissionHandler(req, next, 'claimpaymentscreen')
}

async function GetClaimpayment(req, res, next) {
    PermissionHandler(req, next, 'claimpaymentscreen')
}

async function AddClaimpayment(req, res, next) {
    PermissionHandler(req, next, 'claimpaymentadd')
}

async function ApproveClaimpayment(req, res, next) {
    PermissionHandler(req, next, 'claimpaymentapprove')
}

async function SavepreviewClaimpayment(req, res, next) {
    PermissionHandler(req, next, 'claimpaymentsavepreview')
}

async function DeleteClaimpayment(req, res, next) {
    PermissionHandler(req, next, 'claimpaymentdelete')
}

module.exports = {
    GetClaimpayments,
    GetClaimpayment,
    AddClaimpayment,
    ApproveClaimpayment,
    DeleteClaimpayment,
    SavepreviewClaimpayment
}