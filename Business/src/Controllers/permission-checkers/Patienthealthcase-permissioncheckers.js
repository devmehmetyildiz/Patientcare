const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetPatienthealthcases(req, res, next) {
    PermissionHandler(req, next, 'patienthealthcasescreen')
}

async function GetPatienthealthcase(req, res, next) {
    PermissionHandler(req, next, 'patienthealthcasescreen')
}

async function AddPatienthealthcase(req, res, next) {
    PermissionHandler(req, next, 'patienthealthcaseadd')
}

async function UpdatePatienthealthcase(req, res, next) {
    PermissionHandler(req, next, 'patienthealthcaseupdate')
}

async function DeletePatienthealthcase(req, res, next) {
    PermissionHandler(req, next, 'patienthealthcasedelete')
}

module.exports = {
    GetPatienthealthcases,
    GetPatienthealthcase,
    AddPatienthealthcase,
    UpdatePatienthealthcase,
    DeletePatienthealthcase,
}