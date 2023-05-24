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
        sequelizeErrorCatcher(error)
        next()
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
        sequelizeErrorCatcher(error)
        next()
    }
}


async function AddStation(req, res, next) {

    let validationErrors = []
    const {
        Name,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
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
        const createdStation = await db.stationModel.findOne({ where: { Uuid: stationuuid } })
        res.status(200).json(createdStation)
    } catch (err) {
        await t.rollback()
        sequelizeErrorCatcher(err)
        next()
    }
}

async function UpdateStation(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Uuid,
    } = req.body

    if (!Name || !validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED, req.language)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.STATIONID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STATIONID, req.language)
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

        await db.stationModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await t.commit()
        const updatedStation = await db.stationModel.findOne({ where: { Uuid: Uuid } })
        res.status(200).json(updatedStation)
    } catch (error) {
        sequelizeErrorCatcher(error)
        next()
    }


}

async function DeleteStation(req, res, next) {

    let validationErrors = []
    const {
        Uuid
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.STATIONID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STATIONID, req.language)
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

        res.status(200).json({ messages: "deleted", Uuid: Uuid })
    } catch (error) {
        await t.rollback();
        sequelizeErrorCatcher(error)
        next()
    }

}

module.exports = {
    GetStations,
    GetStation,
    AddStation,
    UpdateStation,
    DeleteStation,
}