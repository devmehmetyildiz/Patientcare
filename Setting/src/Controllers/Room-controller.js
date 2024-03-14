const { types } = require("../Constants/Defines")
const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const CreateNotification = require("../Utilities/CreateNotification")

async function GetRooms(req, res, next) {
    try {
        const rooms = await db.roomModel.findAll({ where: { Isactive: true } })
        res.status(200).json(rooms)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetRoom(req, res, next) {

    let validationErrors = []
    if (!req.params.roomId) {
        validationErrors.push(messages.VALIDATION_ERROR.ROOMID_REQUIRED)
    }
    if (!validator.isUUID(req.params.roomId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_ROOMID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const room = await db.roomModel.findOne({ where: { Uuid: req.params.roomId } });
        res.status(200).json(room)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}


async function AddRoom(req, res, next) {

    let validationErrors = []
    const {
        Name,
        FloorID
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isUUID(FloorID)) {
        validationErrors.push(messages.VALIDATION_ERROR.ROOMID_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let roomuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.roomModel.create({
            ...req.body,
            Uuid: roomuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: 'Odalar',
            role: 'roomnotification',
            message: `${Name} odası ${username} tarafından Oluşturuldu.`,
            pushurl: '/Rooms'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetRooms(req, res, next)
}

async function UpdateRoom(req, res, next) {

    let validationErrors = []
    const {
        Name,
        FloorID,
        Uuid,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isUUID(FloorID)) {
        validationErrors.push(messages.VALIDATION_ERROR.FLOORID_REQUIRED)
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
    const username = req?.identity?.user?.Username || 'System'

    try {
        const room =await db.roomModel.findOne({ where: { Uuid: Uuid } })
        if (!room) {
            return next(createNotfounderror([messages.ERROR.BED_NOT_FOUND], req.language))
        }
        if (room.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.BED_NOT_ACTIVE], req.language))
        }

        await db.roomModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Odalar',
            role: 'roomnotification',
            message: `${Name} odası ${username} tarafından Güncellendi.`,
            pushurl: '/Rooms'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetRooms(req, res, next)
}

async function DeleteRoom(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.roomId

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
    const username = req?.identity?.user?.Username || 'System'
    try {
        const room =await db.roomModel.findOne({ where: { Uuid: Uuid } })
        if (!room) {
            return next(createNotfounderror([messages.ERROR.BED_NOT_FOUND], req.language))
        }
        if (room.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.BED_NOT_ACTIVE], req.language))
        }

        await db.roomModel.destroy({ where: { Uuid: Uuid }, transaction: t });

        await CreateNotification({
            type: types.Delete,
            service: 'Odalar',
            role: 'roomnotification',
            message: `${room?.Name} odası ${username} tarafından Silindi.`,
            pushurl: '/Rooms'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetRooms(req, res, next)
}

module.exports = {
    GetRooms,
    GetRoom,
    AddRoom,
    UpdateRoom,
    DeleteRoom,
}