const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetStations(req, res, next) {
    try {
        const stations = await db.stationModel.findAll({ where: { Isactive: true } })
        res.status(200).json(stations)
    } catch (error) {
       return next(sequelizeErrorCatcher(error))
    }
}

async function GetStation(req, res, next) {

    let validationErrors = []
    if (!req.params.stationId) {
        validationErrors.push(messages.VALIDATION_ERROR.STATIONID_REQUIRED)
    }
    if (!validator.isUUID(req.params.stationId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STATIONID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const station = await db.stationModel.findOne({ where: { Uuid: req.params.stationId } });
        res.status(200).json(station)
    } catch (error) {
        return  next(sequelizeErrorCatcher(error))
    }
}


async function AddStation(req, res, next) {

    let validationErrors = []
    const {
        Name,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let stationuuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.stationModel.create({
            ...req.body,
            Uuid: stationuuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return  next(sequelizeErrorCatcher(err))
    }
    GetStations(req,res,next)
}

async function UpdateStation(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Uuid,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.STATIONID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STATIONID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const station = db.stationModel.findOne({ where: { Uuid: Uuid } })
        if (!station) {
            return next(createNotfounderror([messages.ERROR.STATION_NOT_FOUND], req.language))
        }
        if (station.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STATION_NOT_ACTIVE], req.language))
        }

        await db.stationModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await t.commit()
    } catch (error) {
        return  next(sequelizeErrorCatcher(error))
    }
    GetStations(req,res,next)
}

async function DeleteStation(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.stationId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.STATIONID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STATIONID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const station = db.stationModel.findOne({ where: { Uuid: Uuid } })
        if (!station) {
            return next(createNotfounderror([messages.ERROR.STATION_NOT_FOUND], req.language))
        }
        if (station.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.STATION_NOT_ACTIVE], req.language))
        }
        const t = await db.sequelize.transaction();

        await db.stationModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        return  next(sequelizeErrorCatcher(error))
    }
    GetStations(req,res,next)
}

module.exports = {
    GetStations,
    GetStation,
    AddStation,
    UpdateStation,
    DeleteStation,
}