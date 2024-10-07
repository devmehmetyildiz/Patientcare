const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetCareplanparameters(req, res, next) {
    PermissionHandler(req, next, 'careplanparameterscreen')
}

async function GetCareplanparameter(req, res, next) {
    PermissionHandler(req, next, 'careplanparameterscreen')
}

async function AddCareplanparameter(req, res, next) {
    PermissionHandler(req, next, 'careplanparameteradd')
}

async function UpdateCareplanparameter(req, res, next) {
    PermissionHandler(req, next, 'careplanparameterupdate')
}

async function DeleteCareplanparameter(req, res, next) {
    PermissionHandler(req, next, 'careplanparameterdelete')
}

module.exports = {
    GetCareplanparameters,
    GetCareplanparameter,
    AddCareplanparameter,
    UpdateCareplanparameter,
    DeleteCareplanparameter,
}