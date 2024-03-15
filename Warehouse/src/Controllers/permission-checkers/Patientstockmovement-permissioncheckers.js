const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")


async function GetPatientstockmovements(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientstockmovementscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientstockmovements screen', req.language, { en: 'Patientstockmovements screen', tr: 'Patientstockmovements screen' }))
    }
}

async function GetPatientstockmovement(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientstockmovementscreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientstockmovements screen', req.language, { en: 'Patientstockmovements screen', tr: 'Patientstockmovements screen' }))
    }
}

async function AddPatientstockmovement(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientstockmovementadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientstockmovements Add', req.language, { en: 'Patientstockmovements Add', tr: 'Patientstockmovements Add' }))
    }

}

async function UpdatePatientstockmovement(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientstockmovementupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientstockmovements Update', req.language, { en: 'Patientstockmovements Update', tr: 'Patientstockmovements Update' }))
    }
}

async function ApprovePatientstockmovement(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientstockmovementupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientstockmovements Update', req.language, { en: 'Patientstockmovements Update', tr: 'Patientstockmovements Update' }))
    }
}

async function ApprovePatientstockmovements(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientstockmovementupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientstockmovements Update', req.language, { en: 'Patientstockmovements Update', tr: 'Patientstockmovements Update' }))
    }
}

async function DeletePatientstockmovement(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('patientstockmovementdelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Patientstockmovements Delete', req.language, { en: 'Patientstockmovements Delete', tr: 'Patientstockmovements Delete' }))
    }
}

module.exports = {
    GetPatientstockmovements,
    GetPatientstockmovement,
    AddPatientstockmovement,
    UpdatePatientstockmovement,
    DeletePatientstockmovement,
    ApprovePatientstockmovements,
    ApprovePatientstockmovement
}