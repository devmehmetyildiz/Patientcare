const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetRatings(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('ratingscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Ratings screen', req.language, { en: 'screen Ratings', tr: 'screen Ratings' }))
    }
}

async function GetRating(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('ratingscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Ratings screen', req.language, { en: 'screen Ratings', tr: 'screen Ratings' }))
    }
}

async function AddRating(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('ratingadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Ratings Add', req.language, { en: 'Ratings Add', tr: 'Ratings Add' }))
    }
}

async function UpdateRating(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('ratingupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Ratings Update', req.language, { en: 'Ratings Update', tr: 'Ratings Update' }))
    }
}

async function DeleteRating(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('ratingdelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Ratings Delete', req.language, { en: 'Ratings Delete', tr: 'Ratings Delete' }))
    }
}

module.exports = {
    GetRatings,
    GetRating,
    AddRating,
    UpdateRating,
    DeleteRating,
}