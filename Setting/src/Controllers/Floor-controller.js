const { types } = require("../Constants/Defines")
const messages = require("../Constants/Messages")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetFloors(req, res, next) {
    try {
        const floors = await db.floorModel.findAll({ where: { Isactive: true } })
        res.status(200).json(floors)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetFloor(req, res, next) {

    let validationErrors = []
    if (!req.params.floorId) {
        validationErrors.push(messages.VALIDATION_ERROR.FILEID_REQUIRED)
    }
    if (!validator.isUUID(req.params.floorId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_FLOORID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const floor = await db.floorModel.findOne({ where: { Uuid: req.params.floorId } });
        res.status(200).json(floor)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}


async function AddFloor(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Gender
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isString(Gender)) {
        validationErrors.push(messages.VALIDATION_ERROR.GENDER_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let flooruuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        await db.floorModel.create({
            ...req.body,
            Uuid: flooruuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: 'Katlar',
            role: 'floornotification',
            message: `${Name} yatağı ${username} tarafından Oluşturuldu.`,
            pushurl: '/Floors'
        })
        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetFloors(req, res, next)
}

async function FastcreateFloor(req, res, next) {
    let validationErrors = []
    const {
        Formatfloorstringstart,
        Formatfloorstringend,
        Formatroomstringstart,
        Formatroomstringend,
        Formatbedstringstart,
        Formatbedstringend,
        Floorstartnumber,
        Floorendnumber,
        Gender,
        Roomstartnumber,
        Roomendnumber,
        Bedstartnumber,
        Bedendnumber,
    } = req.body


    if (!validator.isString(Gender)) {
        validationErrors.push(messages.VALIDATION_ERROR.GENDER_REQUIRED)
    }
    if (!validator.isNumber(parseInt(Floorstartnumber))) {
        validationErrors.push(messages.VALIDATION_ERROR.FLOORSTARTNUMBER_REQUIRED)
    }
    if (!validator.isNumber(parseInt(Floorendnumber))) {
        validationErrors.push(messages.VALIDATION_ERROR.FLOORENDNUMBER_REQUIRED)
    }
    if (!validator.isNumber(parseInt(Roomstartnumber))) {
        validationErrors.push(messages.VALIDATION_ERROR.ROOMSTARTNUMBER_REQUIRED)
    }
    if (!validator.isNumber(parseInt(Roomendnumber))) {
        validationErrors.push(messages.VALIDATION_ERROR.ROOMENDNUMBER_REQUIRED)
    }
    if (!validator.isNumber(parseInt(Bedstartnumber))) {
        validationErrors.push(messages.VALIDATION_ERROR.BEDSTARTNUMBER_REQUIRED)
    }
    if (!validator.isNumber(parseInt(Bedendnumber))) {
        validationErrors.push(messages.VALIDATION_ERROR.BEDENDNUMBER_REQUIRED)
    }
    const floorstartnumber = parseInt(Floorstartnumber)
    const floorendnumber = parseInt(Floorendnumber)
    const roomstartnumber = parseInt(Roomstartnumber)
    const roomendnumber = parseInt(Roomendnumber)
    const bedstartnumber = parseInt(Bedstartnumber)
    const bedendnumber = parseInt(Bedendnumber)

    if (floorstartnumber > floorendnumber) {
        validationErrors.push(messages.VALIDATION_ERROR.STARTNUMBER_CANTSMALL)
    }
    if (roomstartnumber > roomendnumber) {
        validationErrors.push(messages.VALIDATION_ERROR.STARTNUMBER_CANTSMALL)
    }
    if (bedstartnumber > bedendnumber) {
        validationErrors.push(messages.VALIDATION_ERROR.STARTNUMBER_CANTSMALL)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {

        let currentfloorstart = floorstartnumber
        while (currentfloorstart <= Floorendnumber) {
            let flooruuid = uuid()
            await db.floorModel.create({
                Name: `${Formatfloorstringstart || ''}${currentfloorstart}${Formatfloorstringend || ''}`,
                Uuid: flooruuid,
                Gender: Gender,
                Createduser: username,
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })

            let currentroomstart = roomstartnumber
            while (currentroomstart <= roomendnumber) {
                let roomuuid = uuid()
                await db.roomModel.create({
                    Name: `${Formatroomstringstart || ''}${currentroomstart}${Formatroomstringend || ''}`,
                    Uuid: roomuuid,
                    FloorID: flooruuid,
                    Createduser: username,
                    Createtime: new Date(),
                    Isactive: true
                }, { transaction: t })

                let currentbedstart = bedstartnumber
                while (currentbedstart <= bedendnumber) {
                    let beduuid = uuid()
                    await db.bedModel.create({
                        Name: `${Formatbedstringstart || ''}${currentbedstart}${Formatbedstringend || ''}`,
                        Uuid: beduuid,
                        RoomID: roomuuid,
                        Isoccupied: false,
                        Createduser: username,
                        Createtime: new Date(),
                        Isactive: true
                    }, { transaction: t })
                    currentbedstart++;
                }
                currentroomstart++;
            }
            currentfloorstart++;
        }

        await CreateNotification({
            type: types.Create,
            service: 'Katlar',
            role: 'floornotification',
            message: `Hızlı kat özelliği ile katlar oluşturuldu`,
            pushurl: '/Floors'
        })
        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetFloors(req, res, next)
}


async function UpdateFloor(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Uuid,
        Gender
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isString(Gender)) {
        validationErrors.push(messages.VALIDATION_ERROR.GENDER_REQUIRED)
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
        const floor =await db.floorModel.findOne({ where: { Uuid: Uuid } })
        if (!floor) {
            return next(createNotfounderror([messages.ERROR.FLOOR_NOT_FOUND], req.language))
        }
        if (floor.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.FLOOR_NOT_ACTIVE], req.language))
        }

        await db.floorModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Katlar',
            role: 'floornotification',
            message: `${floor?.Name} katı ${username} tarafından Güncellendi.`,
            pushurl: '/Floors'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetFloors(req, res, next)
}

async function DeleteFloor(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.floorId

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
        const floor =await db.floorModel.findOne({ where: { Uuid: Uuid } })
        if (!floor) {
            return next(createNotfounderror([messages.ERROR.FLOOR_NOT_FOUND], req.language))
        }
        if (floor.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.FLOOR_NOT_ACTIVE], req.language))
        }

        await db.floorModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: 'Katlar',
            role: 'floornotification',
            message: `${floor?.Name} katı ${username} tarafından Silindi.`,
            pushurl: '/Floors'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetFloors(req, res, next)
}

module.exports = {
    GetFloors,
    GetFloor,
    AddFloor,
    UpdateFloor,
    DeleteFloor,
    FastcreateFloor
}