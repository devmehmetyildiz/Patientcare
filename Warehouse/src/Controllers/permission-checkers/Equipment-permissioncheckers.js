const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetEquipments(req, res, next) {
    PermissionHandler(req, next, 'equipmentscreen')
}

async function GetEquipment(req, res, next) {
    PermissionHandler(req, next, 'equipmentscreen')
}

async function AddEquipment(req, res, next) {
    PermissionHandler(req, next, 'equipmentadd')
}

async function UpdateEquipment(req, res, next) {
    PermissionHandler(req, next, 'equipmentupdate')
}

async function DeleteEquipment(req, res, next) {
    PermissionHandler(req, next, 'equipmentdelete')
}

module.exports = {
    GetEquipments,
    GetEquipment,
    AddEquipment,
    UpdateEquipment,
    DeleteEquipment,
}