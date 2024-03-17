const PermissionHandler = require("../../Utilities/PermissionHandler")

async function Register(req, res, next) {
    next()
}

async function GetUsers(req, res, next) {
    PermissionHandler(req, next, 'userscreen')
}

async function GetUserscount(req, res, next) {
    PermissionHandler(req, next, 'userscreen')
}

async function GetUser(req, res, next) {
    PermissionHandler(req, next, 'userscreen')
}

async function Getbyusername(req, res, next) {
    PermissionHandler(req, next, 'userscreen')
}

async function Getbyemail(req, res, next) {
    PermissionHandler(req, next, 'userscreen')
}

async function Getusersalt(req, res, next) {
    PermissionHandler(req, next, 'userscreen')
}

async function Getusertablemetaconfig(req, res, next) {
    PermissionHandler(req, next, 'userscreen')
}

async function Saveusertablemetaconfig(req, res, next) {
    PermissionHandler(req, next, 'userupdate')
}

async function AddUser(req, res, next) {
    PermissionHandler(req, next, 'useradd')
}

async function UpdateUser(req, res, next) {
    PermissionHandler(req, next, 'userupdate')
}

async function DeleteUser(req, res, next) {
    PermissionHandler(req, next, 'userdelete')
}

async function GetActiveUsername(req, res, next) {
    PermissionHandler(req, next, 'userscreen')
}

async function GetActiveUserMeta(req, res, next) {
    PermissionHandler(req, next, 'userscreen')
}

async function Resettablemeta(req, res, next) {
    PermissionHandler(req, next, 'userupdate')
}

async function Changepassword(req, res, next) {
    PermissionHandler(req, next, 'userupdate')
}

async function UpdateUsermeta(req, res, next) {
    PermissionHandler(req, next, 'userupdate')
}

module.exports = {
    GetUsers,
    GetUser,
    AddUser,
    UpdateUser,
    DeleteUser,
    Register,
    Getbyusername,
    Getusersalt,
    GetActiveUsername,
    GetActiveUserMeta,
    Getusertablemetaconfig,
    Saveusertablemetaconfig,
    Getbyemail,
    Resettablemeta,
    GetUserscount,
    Changepassword,
    UpdateUsermeta
}