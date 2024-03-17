const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetEquipmentgroups(req, res, next) {
    PermissionHandler(req, next, 'equipmentgroupscreen')
}

async function GetEquipmentgroup(req, res, next) {
    PermissionHandler(req, next, 'equipmentgroupscreen')
}

async function AddEquipmentgroup(req, res, next) {
    PermissionHandler(req, next, 'equipmentgroupadd')
}

async function UpdateEquipmentgroup(req, res, next) {
    PermissionHandler(req, next, 'equipmentgroupupdate')
}

async function DeleteEquipmentgroup(req, res, next) {
    PermissionHandler(req, next, 'equipmentgroupdelete')
}

module.exports = {
    GetEquipmentgroups,
    GetEquipmentgroup,
    AddEquipmentgroup,
    UpdateEquipmentgroup,
    DeleteEquipmentgroup,
}