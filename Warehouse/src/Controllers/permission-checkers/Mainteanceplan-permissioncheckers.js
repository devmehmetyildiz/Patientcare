const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetMainteanceplans(req, res, next) {
    PermissionHandler(req, next, 'mainteanceplanscreen')
}

async function GetMainteanceplan(req, res, next) {
    PermissionHandler(req, next, 'mainteanceplanscreen')
}

async function AddMainteanceplan(req, res, next) {
    PermissionHandler(req, next, 'mainteanceplanadd')
}

async function UpdateMainteanceplan(req, res, next) {
    PermissionHandler(req, next, 'mainteanceplanupdate')
}

async function SavepreviewMainteanceplan(req, res, next) {
    PermissionHandler(req, next, 'mainteanceplanupdate')
}

async function ApproveMainteanceplan(req, res, next) {
    PermissionHandler(req, next, 'mainteanceplanupdate')
}

async function CompleteMainteanceplan(req, res, next) {
    PermissionHandler(req, next, 'mainteanceplanupdate')
}

async function WorkMainteanceplan(req, res, next) {
    PermissionHandler(req, next, 'mainteanceplanupdate')
}

async function StopMainteanceplan(req, res, next) {
    PermissionHandler(req, next, 'mainteanceplanupdate')
}

async function DeleteMainteanceplan(req, res, next) {
    PermissionHandler(req, next, 'mainteanceplandelete')
}

module.exports = {
    GetMainteanceplans,
    GetMainteanceplan,
    AddMainteanceplan,
    UpdateMainteanceplan,
    DeleteMainteanceplan,
    SavepreviewMainteanceplan,
    ApproveMainteanceplan,
    CompleteMainteanceplan,
    WorkMainteanceplan,
    StopMainteanceplan
}