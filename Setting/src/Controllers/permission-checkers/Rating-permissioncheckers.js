const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetRatings(req, res, next) {
    PermissionHandler(req, next, 'ratingscreen')
}

async function GetRating(req, res, next) {
    PermissionHandler(req, next, 'ratingscreen')
}

async function AddRating(req, res, next) {
    PermissionHandler(req, next, 'ratingadd')
}

async function UpdateRating(req, res, next) {
    PermissionHandler(req, next, 'ratingupdate')
}

async function DeleteRating(req, res, next) {
    PermissionHandler(req, next, 'ratingdelete')
}

module.exports = {
    GetRatings,
    GetRating,
    AddRating,
    UpdateRating,
    DeleteRating,
}