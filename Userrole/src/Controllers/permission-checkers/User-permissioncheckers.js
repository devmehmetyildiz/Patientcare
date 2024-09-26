const PermissionHandler = require("../../Utilities/PermissionHandler")

async function Register(req, res, next) {
    next()
}

async function GetUsers(req, res, next) {
    PermissionHandler(req, next, 'userscreen')
}

async function GetUser(req, res, next) {
    PermissionHandler(req, next, 'userscreen')
}

async function AddUser(req, res, next) {
    PermissionHandler(req, next, 'useradd')
}

async function UpdateUser(req, res, next) {
    PermissionHandler(req, next, 'userupdate')
}

async function UpdateUsercase(req, res, next) {
    PermissionHandler(req, next, 'userupdate')
}

async function UpdateUsermovement(req, res, next) {
    PermissionHandler(req, next, 'userupdate')
}

async function DeleteUsermovement(req, res, next) {
    PermissionHandler(req, next, 'userdelete')
}

async function DeleteUser(req, res, next) {
    PermissionHandler(req, next, 'userdelete')
}

async function GetUsersforshift(req, res, next) {
    PermissionHandler(req, next, 'userscreen')
}

module.exports = {
    GetUsers,
    GetUser,
    AddUser,
    UpdateUser,
    DeleteUser,
    Register,
    GetUsersforshift,
    UpdateUsercase,
    UpdateUsermovement,
    DeleteUsermovement
}