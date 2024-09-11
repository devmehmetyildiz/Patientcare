const PermissionHandler = require("../../Utilities/PermissionHandler")

async function Getusersalt(req, res, next) {
    PermissionHandler(req, next, 'userscreen')
}

async function Getuserbyemail(req, res, next) {
    PermissionHandler(req, next, 'userscreen')
}

async function Getuserbyusername(req, res, next) {
    PermissionHandler(req, next, 'userscreen')
}

async function Changepasswordbyrequest(req, res, next) {
    PermissionHandler(req, next, 'userscreen')
}

async function Changepassword(req, res, next) {
    PermissionHandler(req, next, 'userscreen')
}

async function Getusername(req, res, next) {
    PermissionHandler(req, next, 'userscreen')
}

async function Getmeta(req, res, next) {
    PermissionHandler(req, next, 'userscreen')
}

async function Gettablemeta(req, res, next) {
    PermissionHandler(req, next, 'userscreen')
}

async function Resettablemeta(req, res, next) {
    PermissionHandler(req, next, 'userscreen')
}

async function Savetablemeta(req, res, next) {
    PermissionHandler(req, next, 'userscreen')
}

module.exports = {
    Getusername,
    Getmeta,
    Changepassword,
    Resettablemeta,
    Gettablemeta,
    Savetablemeta,
    Getuserbyusername,
    Getuserbyemail,
    Getusersalt,
    Changepasswordbyrequest
}