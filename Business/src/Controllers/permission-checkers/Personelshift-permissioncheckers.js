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
    PermissionHandler(req, next, 'personelshiftapprove')
}

async function CompletePersonelshift(req, res, next) {
    PermissionHandler(req, next, 'personelshiftcomplete')
}

async function DeactivePersonelshift(req, res, next) {
    PermissionHandler(req, next, 'personelshiftdeactive')
}

async function DeletePersonelshift(req, res, next) {
    PermissionHandler(req, next, 'personelshiftdelete')
}

module.exports = {
    GetPersonelshifts,
    GetPersonelshift,
    AddPersonelshift,
    UpdatePersonelshift,
    DeletePersonelshift,
    ApprovePersonelshift,
    CompletePersonelshift,
    DeactivePersonelshift,
}