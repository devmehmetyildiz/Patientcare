const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetPersonelshifts(req, res, next) {
    PermissionHandler(req, next, 'personelshiftscreen')
}

async function GetPersonelshift(req, res, next) {
    PermissionHandler(req, next, 'personelshiftscreen')
}

async function AddPersonelshift(req, res, next) {
    PermissionHandler(req, next, 'personelshiftadd')
}

async function UpdatePersonelshift(req, res, next) {
    PermissionHandler(req, next, 'personelshiftupdate')
}

async function ApprovePersonelshift(req, res, next) {
    PermissionHandler(req, next, 'personelshiftupdate')
}

async function CompletePersonelshift(req, res, next) {
    PermissionHandler(req, next, 'personelshiftupdate')
}

async function SavepreviewPersonelshift(req, res, next) {
    PermissionHandler(req, next, 'personelshiftupdate')
}

async function ActivatePersonelshift(req, res, next) {
    PermissionHandler(req, next, 'personelshiftupdate')
}

async function DeactivatePersonelshift(req, res, next) {
    PermissionHandler(req, next, 'personelshiftdelete')
}

async function DeletePersonelshift(req, res, next) {
    PermissionHandler(req, next, 'personelshiftdelete')
}

async function GetFastCreatedPersonelshift(req, res, next) {
    PermissionHandler(req, next, 'personelshiftscreen')
}

module.exports = {
    GetPersonelshifts,
    GetPersonelshift,
    AddPersonelshift,
    UpdatePersonelshift,
    DeletePersonelshift,
    SavepreviewPersonelshift,
    ApprovePersonelshift,
    CompletePersonelshift,
    ActivatePersonelshift,
    DeactivatePersonelshift,
    GetFastCreatedPersonelshift
}