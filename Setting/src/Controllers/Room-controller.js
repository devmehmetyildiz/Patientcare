const { types } = require("../Constants/Defines")
const { sequelizeErrorCatcher, } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const CreateNotification = require("../Utilities/CreateNotification")

async function GetRooms(req, res, next) {
    try {
        const rooms = await db.roomModel.findAll()
        res.status(200).json(rooms)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetRoom(req, res, next) {

    let validationErrors = []
    if (!req.params.roomId) {
        validationErrors.push(req.t('Rooms.Error.RoomIDRequired'))
    }
    if (!validator.isUUID(req.params.roomId)) {
        validationErrors.push(req.t('Rooms.Error.UnsupportedRoomID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Rooms'), req.language))
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
        validationErrors.push(req.t('Rooms.Error.RoomIDRequired'))
    }
    if (!validator.isUUID(FloorID)) {
        validationErrors.push(req.t('Rooms.Error.FloorIDRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Rooms'), req.language))
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
            service: req.t('Rooms'),
            role: 'roomnotification',
            message: {
                en: `${Name} Room Created By ${username}.`,
                tr: `${Name} Odası ${username} Tarafından Oluşturuldu.`
            }[req.language],
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
        validationErrors.push(req.t('Rooms.Error.NameRequired'))
    }
    if (!validator.isUUID(FloorID)) {
        validationErrors.push(req.t('Rooms.Error.FloorIDRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Rooms.Error.RoomIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Rooms.Error.UnsupportedRoomID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Rooms'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const room = await db.roomModel.findOne({ where: { Uuid: Uuid } })
        if (!room) {
            return next(createNotFoundError(req.t('Rooms.Error.NotFound'), req.t('Rooms'), req.language))
        }
        if (room.Isactive === false) {
            return next(createNotFoundError(req.t('Rooms.Error.NotActive'), req.t('Rooms'), req.language))
        }

        await db.roomModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Rooms'),
            role: 'roomnotification',
            message: {
                en: `${Name} Updated By ${username}.`,
                tr: `${Name} Odası ${username} Tarafından Güncellendi.`
            }[req.language],
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
        validationErrors.push(req.t('Rooms.Error.RoomIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Rooms.Error.UnsupportedRoomID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Rooms'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        const room = await db.roomModel.findOne({ where: { Uuid: Uuid } })
        if (!room) {
            return next(createNotFoundError(req.t('Rooms.Error.NotFound'), req.t('Rooms'), req.language))
        }
        if (room.Isactive === false) {
            return next(createNotFoundError(req.t('Rooms.Error.NotActive'), req.t('Rooms'), req.language))
        }

        await db.roomModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Rooms'),
            role: 'roomnotification',
            message: {
                en: `${room?.Name} Room Deleted By ${username}.`,
                tr: `${room?.Name} Odası ${username} Tarafından Silindi.`
            }[req.language],
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