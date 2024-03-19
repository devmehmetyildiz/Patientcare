const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetPersonelshiftdetails(req, res, next) {
    PermissionHandler(req, next, 'personelshiftdetailscreen')
}

async function GetPersonelshiftdetail(req, res, next) {
    PermissionHandler(req, next, 'personelshiftdetailscreen')
}

async function AddPersonelshiftdetail(req, res, next) {
    PermissionHandler(req, next, 'personelshiftdetailadd')
}

async function UpdatePersonelshiftdetail(req, res, next) {
    PermissionHandler(req, next, 'personelshiftdetailupdate')
}

async function DeletePersonelshiftdetail(req, res, next) {
    PermissionHandler(req, next, 'personelshiftdetaildelete')
}

module.exports = {
    GetPersonelshiftdetails,
    GetPersonelshiftdetail,
    AddPersonelshiftdetail,
    UpdatePersonelshiftdetail,
    DeletePersonelshiftdetail,
}