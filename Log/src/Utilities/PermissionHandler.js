const Privileges = require('../Constants/Privileges')
const Permissionchecker = require('./Permissionchecker')
const { createAccessDenied } = require("./Error")

module.exports = (req, next, permission, permission2, permission3) => {

    let permissionCount = 0
    permission && (permissionCount++)
    permission2 && (permissionCount++)
    permission3 && (permissionCount++)

    switch (permissionCount) {
        case 1:
            if ((req.identity.privileges && (req.identity.privileges.includes(permission) || Permissionchecker(req)))) {
                next()
            } else {
                let privilege = Privileges.find(u => u.code === permission)
                next(createAccessDenied(privilege?.text[req.language || 'tr'], req.language, privilege?.group))
            }
            break;
        case 2:
            if ((req.identity.privileges && (req.identity.privileges.includes(permission) || req.identity.privileges.includes(permission2) || Permissionchecker(req)))) {
                next()
            } else {
                let privilege = Privileges.find(u => u.code === permission)
                next(createAccessDenied(privilege?.text[req.language || 'tr'], req.language, privilege?.group))
            }
            break;
        case 3:
            if ((req.identity.privileges && (req.identity.privileges.includes(permission) || req.identity.privileges.includes(permission2) || req.identity.privileges.includes(permission3) || Permissionchecker(req)))) {
                next()
            } else {
                let privilege = Privileges.find(u => u.code === permission)
                next(createAccessDenied(privilege?.text[req.language || 'tr'], req.language, privilege?.group))
            }
            break;

        default:
            if ((req.identity.privileges && (req.identity.privileges.includes(permission) || Permissionchecker(req)))) {
                next()
            } else {
                let privilege = Privileges.find(u => u.code === permission)
                next(createAccessDenied(privilege?.text[req.language || 'tr'], req.language, privilege?.group))
            }
            break;
    }
}