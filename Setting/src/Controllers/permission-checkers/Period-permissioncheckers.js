const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetPeriods(req, res, next) {
    PermissionHandler(req, next, 'periodscreen')
}

async function GetPeriod(req, res, next) {
    PermissionHandler(req, next, 'periodscreen')
}

async function AddPeriod(req, res, next) {
    PermissionHandler(req, next, 'periodadd')
}

async function FastcreatePeriod(req, res, next) {
    PermissionHandler(req, next, 'periodadd')
}

async function UpdatePeriod(req, res, next) {
    PermissionHandler(req, next, 'periodupdate')
}

async function DeletePeriod(req, res, next) {
    PermissionHandler(req, next, 'perioddelete')
}

module.exports = {
    GetPeriods,
    GetPeriod,
    AddPeriod,
    UpdatePeriod,
    DeletePeriod,
    FastcreatePeriod
}