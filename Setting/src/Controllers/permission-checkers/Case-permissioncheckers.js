const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetCases(req, res, next) {
    PermissionHandler(req, next, 'casescreen')
}

async function GetCompleteCase(req, res, next) {
    PermissionHandler(req, next, 'casescreen')
}

async function GetDeactivateCase(req, res, next) {
    PermissionHandler(req, next, 'casescreen')
}

async function GetCase(req, res, next) {
    PermissionHandler(req, next, 'casescreen')
}

async function AddCase(req, res, next) {
    PermissionHandler(req, next, 'caseadd')
}

async function UpdateCase(req, res, next) {
    PermissionHandler(req, next, 'caseupdate')
}

async function DeleteCase(req, res, next) {
    PermissionHandler(req, next, 'casedelete')
}

module.exports = {
    GetCases,
    GetCase,
    AddCase,
    UpdateCase,
    DeleteCase,
    GetCompleteCase,
    GetDeactivateCase
}