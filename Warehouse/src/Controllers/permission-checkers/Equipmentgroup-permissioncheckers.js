const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetEquipmentgroups(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('equipmentgroupview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Equipmentgroup View', req.language, { en: 'Equipmentgroup View', tr: 'Equipmentgroup View' }))
    }
}

async function GetEquipmentgroup(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('equipmentgroupview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Equipmentgroup View', req.language, { en: 'Equipmentgroup View', tr: 'Equipmentgroup View' }))
    }
}

async function AddEquipmentgroup(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('equipmentgroupadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Equipmentgroup Add', req.language, { en: 'Equipmentgroup Add', tr: 'Equipmentgroup Add' }))
    }
}

async function UpdateEquipmentgroup(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('equipmentgroupupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Equipmentgroup Update', req.language, { en: 'Equipmentgroup Update', tr: 'Equipmentgroup Update' }))
    }
}

async function DeleteEquipmentgroup(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('equipmentgroupdelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Equipmentgroup Delete', req.language, { en: 'Equipmentgroup Delete', tr: 'Equipmentgroup Delete' }))
    }
}

module.exports = {
    GetEquipmentgroups,
    GetEquipmentgroup,
    AddEquipmentgroup,
    UpdateEquipmentgroup,
    DeleteEquipmentgroup,
}