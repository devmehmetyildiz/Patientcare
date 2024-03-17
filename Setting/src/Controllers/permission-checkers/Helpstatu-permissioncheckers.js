const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetHelpstatus(req, res, next) {
    PermissionHandler(req, next, 'helpstatuscreen')
}

async function GetHelpstatu(req, res, next) {
    PermissionHandler(req, next, 'helpstatuscreen')
}

async function AddHelpstatu(req, res, next) {
    PermissionHandler(req, next, 'helpstatuadd')
}

async function UpdateHelpstatu(req, res, next) {
    PermissionHandler(req, next, 'helpstatuupdate')
}

async function DeleteHelpstatu(req, res, next) {
    PermissionHandler(req, next, 'helpstatudelete')
}

module.exports = {
    GetHelpstatus,
    GetHelpstatu,
    AddHelpstatu,
    UpdateHelpstatu,
    DeleteHelpstatu,
}