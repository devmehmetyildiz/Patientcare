const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetPatienthealthcasedefines(req, res, next) {
    PermissionHandler(req, next, 'patienthealthcasedefinescreen')
}

async function GetPatienthealthcasedefine(req, res, next) {
    PermissionHandler(req, next, 'patienthealthcasedefinescreen')
}

async function AddPatienthealthcasedefine(req, res, next) {
    PermissionHandler(req, next, 'patienthealthcasedefineadd')
}

async function UpdatePatienthealthcasedefine(req, res, next) {
    PermissionHandler(req, next, 'patienthealthcasedefineupdate')
}

async function DeletePatienthealthcasedefine(req, res, next) {
    PermissionHandler(req, next, 'patienthealthcasedefinedelete')
}

module.exports = {
    GetPatienthealthcasedefines,
    GetPatienthealthcasedefine,
    AddPatienthealthcasedefine,
    UpdatePatienthealthcasedefine,
    DeletePatienthealthcasedefine,
}