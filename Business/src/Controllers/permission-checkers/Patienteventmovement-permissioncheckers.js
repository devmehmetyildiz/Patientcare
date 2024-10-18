const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetPatienteventmovements(req, res, next) {
    PermissionHandler(req, next, 'patienteventmovementscreen')
}

async function GetPatienteventmovement(req, res, next) {
    PermissionHandler(req, next, 'patienteventmovementscreen')
}

async function AddPatienteventmovement(req, res, next) {
    PermissionHandler(req, next, 'patienteventmovementadd')
}

async function UpdatePatienteventmovement(req, res, next) {
    PermissionHandler(req, next, 'patienteventmovementupdate')
}

async function DeletePatienteventmovement(req, res, next) {
    PermissionHandler(req, next, 'patienteventmovementdelete')
}

module.exports = {
    GetPatienteventmovements,
    GetPatienteventmovement,
    AddPatienteventmovement,
    UpdatePatienteventmovement,
    DeletePatienteventmovement,
}