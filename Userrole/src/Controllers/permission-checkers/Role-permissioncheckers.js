const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetRoles(req, res, next) {
    PermissionHandler(req, next, 'rolescreen')
}

async function GetRolescount(req, res, next) {
    PermissionHandler(req, next, 'rolescreen')
}

async function GetRole(req, res, next) {
    PermissionHandler(req, next, 'rolescreen')
}

async function Getprivileges(req, res, next) {
    PermissionHandler(req, next, 'rolescreen')
}

async function Getprivilegegroups(req, res, next) {
    PermissionHandler(req, next, 'rolescreen')
}

async function Getprivilegesbyuserid(req, res, next) {
    PermissionHandler(req, next, 'rolescreen')
}

async function GetActiveuserprivileges(req, res, next) {
    PermissionHandler(req, next, 'rolescreen')
}

async function AddRole(req, res, next) {
    PermissionHandler(req, next, 'roleadd')
}

async function UpdateRole(req, res, next) {
    PermissionHandler(req, next, 'roleupdate')
}

async function DeleteRole(req, res, next) {
    PermissionHandler(req, next, 'roledelete')
}


module.exports = {
    GetRoles,
    GetRole,
    AddRole,
    UpdateRole,
    DeleteRole,
    Getprivilegesbyuserid,
    GetActiveuserprivileges,
    Getprivileges,
    Getprivilegegroups,
    GetRolescount
}