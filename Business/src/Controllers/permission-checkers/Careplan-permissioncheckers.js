const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetCareplans(req, res, next) {
    PermissionHandler(req, next, 'careplanscreen')
}

async function GetCareplan(req, res, next) {
    PermissionHandler(req, next, 'careplanscreen')
}

async function AddCareplan(req, res, next) {
    PermissionHandler(req, next, 'careplanadd')
}

async function UpdateCareplan(req, res, next) {
    PermissionHandler(req, next, 'careplanupdate')
}

async function ApproveCareplan(req, res, next) {
    PermissionHandler(req, next, 'careplanupdate')
}

async function SavepreviewCareplan(req, res, next) {
    PermissionHandler(req, next, 'careplanupdate')
}

async function DeleteCareplan(req, res, next) {
    PermissionHandler(req, next, 'careplandelete')
}

module.exports = {
    GetCareplans,
    GetCareplan,
    AddCareplan,
    ApproveCareplan,
    UpdateCareplan,
    DeleteCareplan,
    SavepreviewCareplan
}