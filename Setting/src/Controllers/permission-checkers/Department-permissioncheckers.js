const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetDepartments(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('departmentview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Departments View', req.language, { en: 'View Departments', tr: 'View Departments' }))
    }
}

async function GetDepartment(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('departmentview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Departments View', req.language, { en: 'View Departments', tr: 'View Departments' }))
    }
}

async function AddDepartment(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('departmentadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Departments Add', req.language, { en: 'Departments Add', tr: 'Departments Add' }))
    }
}

async function UpdateDepartment(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('departmentupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Departments Update', req.language, { en: 'Departments Update', tr: 'Departments Update' }))
    }
}

async function DeleteDepartment(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('departmentdelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Departments Delete', req.language, { en: 'Departments Delete', tr: 'Departments Delete' }))
    }
}

module.exports = {
    GetDepartments,
    GetDepartment,
    AddDepartment,
    UpdateDepartment,
    DeleteDepartment,
}