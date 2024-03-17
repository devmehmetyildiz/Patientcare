const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetPatienttypes(req, res, next) {
    PermissionHandler(req, next, 'patienttypescreen')
}

async function GetPatienttype(req, res, next) {
    PermissionHandler(req, next, 'patienttypescreen')
}

async function AddPatienttype(req, res, next) {
    PermissionHandler(req, next, 'patienttypeadd')
}

async function UpdatePatienttype(req, res, next) {
    PermissionHandler(req, next, 'patienttypeupdate')
}

async function DeletePatienttype(req, res, next) {
    PermissionHandler(req, next, 'patienttypedelete')
}

module.exports = {
    GetPatienttypes,
    GetPatienttype,
    AddPatienttype,
    UpdatePatienttype,
    DeletePatienttype,
}