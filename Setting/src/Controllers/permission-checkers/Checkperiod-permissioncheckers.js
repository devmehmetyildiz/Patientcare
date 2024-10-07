const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetCheckperiods(req, res, next) {
    PermissionHandler(req, next, 'checkperiodscreen')
}

async function GetCheckperiod(req, res, next) {
    PermissionHandler(req, next, 'checkperiodscreen')
}

async function AddCheckperiod(req, res, next) {
    PermissionHandler(req, next, 'checkperiodadd')
}

async function UpdateCheckperiod(req, res, next) {
    PermissionHandler(req, next, 'checkperiodupdate')
}

async function DeleteCheckperiod(req, res, next) {
    PermissionHandler(req, next, 'checkperioddelete')
}


module.exports = {
    GetCheckperiods,
    GetCheckperiod,
    AddCheckperiod,
    UpdateCheckperiod,
    DeleteCheckperiod,
}