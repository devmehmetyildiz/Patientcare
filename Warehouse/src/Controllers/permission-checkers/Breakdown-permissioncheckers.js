const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetBreakdowns(req, res, next) {
    PermissionHandler(req, next, 'breakdownscreen')
}

async function GetBreakdown(req, res, next) {
    PermissionHandler(req, next, 'breakdownscreen')
}

async function AddBreakdown(req, res, next) {
    PermissionHandler(req, next, 'breakdownadd')
}

async function UpdateBreakdown(req, res, next) {
    PermissionHandler(req, next, 'breakdownupdate')
}

async function CompleteBreakdown(req, res, next) {
    PermissionHandler(req, next, 'breakdownupdate')
}

async function DeleteBreakdown(req, res, next) {
    PermissionHandler(req, next, 'breakdowndelete')
}

module.exports = {
    GetBreakdowns,
    GetBreakdown,
    AddBreakdown,
    UpdateBreakdown,
    DeleteBreakdown,
    CompleteBreakdown
}