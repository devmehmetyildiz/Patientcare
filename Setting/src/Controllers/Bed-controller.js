const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetBeds(req, res, next) {
    try {
        const beds = await db.bedModel.findAll({ where: { Isactive: true } })
        res.status(200).json(beds)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetBed(req, res, next) {

    let validationErrors = []
    if (!req.params.bedId) {
        validationErrors.push(messages.VALIDATION_ERROR.BEDID_REQUIRED)
    }
    if (!validator.isUUID(req.params.bedId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_BEDID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const bed = await db.bedModel.findOne({ where: { Uuid: req.params.bedId } });
        res.status(200).json(bed)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}


async function AddBed(req, res, next) {

    let validationErrors = []
    const {
        Name,
        RoomID
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isUUID(RoomID)) {
        validationErrors.push(messages.VALIDATION_ERROR.ROOMID_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let beduuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.bedModel.create({
            ...req.body,
            Uuid: beduuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetBeds(req, res, next)
}

async function UpdateBed(req, res, next) {

    let validationErrors = []
    const {
        Name,
        RoomID,
        Uuid,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isUUID(RoomID)) {
        validationErrors.push(messages.VALIDATION_ERROR.ROOMID_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.BEDID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_BEDID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const bed = db.bedModel.findOne({ where: { Uuid: Uuid } })
        if (!bed) {
            return next(createNotfounderror([messages.ERROR.BED_NOT_FOUND], req.language))
        }
        if (bed.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.BED_NOT_ACTIVE], req.language))
        }

        await db.bedModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetBeds(req, res, next)
}

async function DeleteBed(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.bedId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.BEDID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_BEDID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const bed = db.bedModel.findOne({ where: { Uuid: Uuid } })
        if (!bed) {
            return next(createNotfounderror([messages.ERROR.BED_NOT_FOUND], req.language))
        }
        if (bed.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.BED_NOT_ACTIVE], req.language))
        }
        const t = await db.sequelize.transaction();

        await db.bedModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetBeds(req, res, next)
}

module.exports = {
    GetBeds,
    GetBed,
    AddBed,
    UpdateBed,
    DeleteBed,
}