const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetStocktypegroups(req, res, next) {
    PermissionHandler(req, next, 'stocktypegroupscreen')
}

async function GetStocktypegroup(req, res, next) {
    PermissionHandler(req, next, 'stocktypegroupscreen')
}

async function AddStocktypegroup(req, res, next) {
    PermissionHandler(req, next, 'stocktypegroupadd')
}

async function UpdateStocktypegroup(req, res, next) {
    PermissionHandler(req, next, 'stocktypegroupupdate')
}


async function DeleteStocktypegroup(req, res, next) {
    PermissionHandler(req, next, 'stocktypegroupdelete')
}


module.exports = {
    GetStocktypegroups,
    GetStocktypegroup,
    AddStocktypegroup,
    UpdateStocktypegroup,
    DeleteStocktypegroup,
}