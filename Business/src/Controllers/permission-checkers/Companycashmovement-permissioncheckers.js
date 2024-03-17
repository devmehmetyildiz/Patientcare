const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetCompanycashmovements(req, res, next) {
    PermissionHandler(req, next, 'companycashmovementscreen')
}

async function GetCompanycashmovement(req, res, next) {
    PermissionHandler(req, next, 'companycashmovementscreen')
}

async function AddCompanycashmovement(req, res, next) {
    PermissionHandler(req, next, 'companycashmovementadd')
}

async function UpdateCompanycashmovement(req, res, next) {
    PermissionHandler(req, next, 'companycashmovementupdate')
}

async function DeleteCompanycashmovement(req, res, next) {
    PermissionHandler(req, next, 'companycashmovementdelete')
}

module.exports = {
    GetCompanycashmovements,
    GetCompanycashmovement,
    AddCompanycashmovement,
    UpdateCompanycashmovement,
    DeleteCompanycashmovement,
}