const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetPrinttemplates(req, res, next) {
    PermissionHandler(req, next, 'printtemplatescreen')
}

async function GetPrinttemplate(req, res, next) {
    PermissionHandler(req, next, 'printtemplatescreen')
}

async function AddPrinttemplate(req, res, next) {
    PermissionHandler(req, next, 'printtemplateadd')
}

async function UpdatePrinttemplate(req, res, next) {
    PermissionHandler(req, next, 'printtemplateupdate')
}

async function DeletePrinttemplate(req, res, next) {
    PermissionHandler(req, next, 'printtemplatedelete')
}

module.exports = {
    GetPrinttemplates,
    GetPrinttemplate,
    AddPrinttemplate,
    UpdatePrinttemplate,
    DeletePrinttemplate,
}