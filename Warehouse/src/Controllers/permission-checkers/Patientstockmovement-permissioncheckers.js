const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetPatientstockmovements(req, res, next) {
    PermissionHandler(req, next, 'patientstockmovementscreen')
}

async function GetPatientstockmovement(req, res, next) {
    PermissionHandler(req, next, 'patientstockmovementscreen')
}

async function AddPatientstockmovement(req, res, next) {
    PermissionHandler(req, next, 'patientstockmovementadd')
}

async function UpdatePatientstockmovement(req, res, next) {
    PermissionHandler(req, next, 'patientstockmovementupdate')
}

async function ApprovePatientstockmovement(req, res, next) {
    PermissionHandler(req, next, 'patientstockmovementupdate')
}

async function ApprovePatientstockmovements(req, res, next) {
    PermissionHandler(req, next, 'patientstockmovementupdate')
}

async function DeletePatientstockmovement(req, res, next) {
    PermissionHandler(req, next, 'patientstockmovementdelete')
}

module.exports = {
    GetPatientstockmovements,
    GetPatientstockmovement,
    AddPatientstockmovement,
    UpdatePatientstockmovement,
    DeletePatientstockmovement,
    ApprovePatientstockmovements,
    ApprovePatientstockmovement
}