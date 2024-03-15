const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetEquipments(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('equipmentscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Equipment screen', req.language, { en: 'Equipment screen', tr: 'Equipment screen' }))
    }
}

async function GetEquipment(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('equipmentscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Equipment screen', req.language, { en: 'Equipment screen', tr: 'Equipment screen' }))
    }
}

async function AddEquipment(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('equipmentadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Equipment Add', req.language, { en: 'Equipment Add', tr: 'Equipment Add' }))
    }
}

async function UpdateEquipment(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('equipmentupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Equipment Update', req.language, { en: 'Equipment Update', tr: 'Equipment Update' }))
    }
}

async function DeleteEquipment(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('equipmentdelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Equipment Delete', req.language, { en: 'Equipment Delete', tr: 'Equipment Delete' }))
    }
}

module.exports = {
    GetEquipments,
    GetEquipment,
    AddEquipment,
    UpdateEquipment,
    DeleteEquipment,
}