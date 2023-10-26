const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")


async function GetMailsettings(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('mailsettingview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Mailsettings View', req.language, { en: 'View Mailsettings', tr: 'View Mailsettings' }))
    }
}

async function GetMailsetting(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('mailsettingview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Mailsettings View', req.language, { en: 'View Mailsettings', tr: 'View Mailsettings' }))
    }
}
async function GetActiveMailsetting(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('mailsettingview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Mailsettings View', req.language, { en: 'View Mailsettings', tr: 'View Mailsettings' }))
    }
}

async function AddMailsetting(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('mailsettingadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Mailsettings Add', req.language, { en: 'Mailsettings Add', tr: 'Mailsettings Add' }))
    }
}

async function UpdateMailsetting(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('mailsettingupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Mailsettings Update', req.language, { en: 'Mailsettings Update', tr: 'Mailsettings Update' }))
    }
}

async function DeleteMailsetting(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('mailsettingdelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Mailsettings Delete', req.language, { en: 'Mailsettings Delete', tr: 'Mailsettings Delete' }))
    }
}

module.exports = {
    GetMailsettings,
    GetMailsetting,
    AddMailsetting,
    UpdateMailsetting,
    DeleteMailsetting,
    GetActiveMailsetting
}