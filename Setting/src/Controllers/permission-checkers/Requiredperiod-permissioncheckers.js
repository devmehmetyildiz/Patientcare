const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetRequiredperiods(req, res, next) {
    PermissionHandler(req, next, 'requiredperiodscreen')
}

async function GetRequiredperiod(req, res, next) {
    PermissionHandler(req, next, 'requiredperiodscreen')
}

async function AddRequiredperiod(req, res, next) {
    PermissionHandler(req, next, 'requiredperiodadd')
}

async function UpdateRequiredperiod(req, res, next) {
    PermissionHandler(req, next, 'requiredperiodupdate')
}

async function DeleteRequiredperiod(req, res, next) {
    PermissionHandler(req, next, 'requiredperioddelete')
}

module.exports = {
    GetRequiredperiods,
    GetRequiredperiod,
    AddRequiredperiod,
    UpdateRequiredperiod,
    DeleteRequiredperiod,
}