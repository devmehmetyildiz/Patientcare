const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetWarehouses(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('warehouseview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Warehouses View', req.language, { en: 'Warehouses View', tr: 'Warehouses View' }))
    }
}

async function GetWarehousescount(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('warehouseview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Warehouses View', req.language, { en: 'Warehouses View', tr: 'Warehouses View' }))
    }
}

async function GetWarehouse(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('warehouseview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Warehouses View', req.language, { en: 'Warehouses View', tr: 'Warehouses View' }))
    }
}

async function AddWarehouse(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('warehouseadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Warehouses Add', req.language, { en: 'Warehouses Add', tr: 'Warehouses Add' }))
    }
}

async function UpdateWarehouse(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('warehouseupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Warehouses Update', req.language, { en: 'Warehouses Update', tr: 'Warehouses Update' }))
    }
}

async function DeleteWarehouse(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('warehouseadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Warehouses Delete', req.language, { en: 'Warehouses Delete', tr: 'Warehouses Delete' }))
    }
}

module.exports = {
    GetWarehouses,
    GetWarehouse,
    AddWarehouse,
    UpdateWarehouse,
    DeleteWarehouse,
}