const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetDepartments(req, res, next) {
    PermissionHandler(req, next, 'departmentscreen')
}

async function GetDepartment(req, res, next) {
    PermissionHandler(req, next, 'departmentscreen')
}

async function AddDepartment(req, res, next) {
    PermissionHandler(req, next, 'departmentadd')
}

async function UpdateDepartment(req, res, next) {
    PermissionHandler(req, next, 'departmentupdate')
}

async function DeleteDepartment(req, res, next) {
    PermissionHandler(req, next, 'departmentdelete')
}

module.exports = {
    GetDepartments,
    GetDepartment,
    AddDepartment,
    UpdateDepartment,
    DeleteDepartment,
}