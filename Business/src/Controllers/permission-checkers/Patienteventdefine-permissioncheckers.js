const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetPatienteventdefines(req, res, next) {
    PermissionHandler(req, next, 'patienteventdefinescreen')
}

async function GetPatienteventdefine(req, res, next) {
    PermissionHandler(req, next, 'patienteventdefinescreen')
}

async function AddPatienteventdefine(req, res, next) {
    PermissionHandler(req, next, 'patienteventdefineadd')
}

async function UpdatePatienteventdefine(req, res, next) {
    PermissionHandler(req, next, 'patienteventdefineupdate')
}

async function DeletePatienteventdefine(req, res, next) {
    PermissionHandler(req, next, 'patienteventdefinedelete')
}

module.exports = {
    GetPatienteventdefines,
    GetPatienteventdefine,
    AddPatienteventdefine,
    UpdatePatienteventdefine,
    DeletePatienteventdefine,
}