const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetFloors(req, res, next) {
    try {
        const floors = await db.floorModel.findAll()
        res.status(200).json(floors)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetFloor(req, res, next) {

    let validationErrors = []
    if (!req.params.floorId) {
        validationErrors.push(req.t('Floors.Error.FloorIDRequired'))
    }
    if (!validator.isUUID(req.params.floorId)) {
        validationErrors.push(req.t('Floors.Error.UnsupportedFloorID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Floors'), req.language))
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
        validationErrors.push(req.t('Floors.Error.NameRequired'))
    }
    if (!validator.isString(Gender)) {
        validationErrors.push(req.t('Floors.Error.GenderRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Floors'), req.language))
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
            service: req.t('Floors'),
            role: 'floornotification',
            message: {
                en: `${Name} Floor Created By ${username}.`,
                tr: `${Name} Kat ${username} tarafından Oluşturuldu.`
            }[req.language],
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
        validationErrors.push(req.t('Floors.Error.GenderRequired'))
    }
    if (!validator.isNumber(parseInt(Floorstartnumber))) {
        validationErrors.push(req.t('Floors.Error.FloorStartNumberRequired'))
    }
    if (!validator.isNumber(parseInt(Floorendnumber))) {
        validationErrors.push(req.t('Floors.Error.FloorEndNumberRequired'))
    }
    if (!validator.isNumber(parseInt(Roomstartnumber))) {
        validationErrors.push(req.t('Floors.Error.RoomStartNumberRequired'))
    }
    if (!validator.isNumber(parseInt(Roomendnumber))) {
        validationErrors.push(req.t('Floors.Error.RoomEndNumberRequired'))
    }
    if (!validator.isNumber(parseInt(Bedstartnumber))) {
        validationErrors.push(req.t('Floors.Error.BedStartNumberRequired'))
    }
    if (!validator.isNumber(parseInt(Bedendnumber))) {
        validationErrors.push(req.t('Floors.Error.BedEndNumberRequired'))
    }
    const floorstartnumber = parseInt(Floorstartnumber)
    const floorendnumber = parseInt(Floorendnumber)
    const roomstartnumber = parseInt(Roomstartnumber)
    const roomendnumber = parseInt(Roomendnumber)
    const bedstartnumber = parseInt(Bedstartnumber)
    const bedendnumber = parseInt(Bedendnumber)

    if (floorstartnumber > floorendnumber) {
        validationErrors.push(req.t('Floors.Error.FloorNumberCantSmall'))
    }
    if (roomstartnumber > roomendnumber) {
        validationErrors.push(req.t('Floors.Error.RoomNumberCantSmall'))
    }
    if (bedstartnumber > bedendnumber) {
        validationErrors.push(req.t('Floors.Error.BedNumberCantSmall'))
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
            service: req.t('Floors'),
            role: 'floornotification',
            message: {
                en: `Floors Created By Fast Create`,
                tr: `Hızlı Kat Özelliği İle Katlar Oluşturuldu`
            }[req.language],
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
        validationErrors.push(req.t('Floors.Error.NameRequired'))
    }
    if (!validator.isString(Gender)) {
        validationErrors.push(req.t('Floors.Error.GenderRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Floors.Error.FloorIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Floors.Error.UnsupportedFloorID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Floors'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        const floor = await db.floorModel.findOne({ where: { Uuid: Uuid } })
        if (!floor) {
            return next(createNotFoundError(req.t('Floors.Error.NotFound'), req.t('Floors'), req.language))
        }
        if (floor.Isactive === false) {
            return next(createNotFoundError(req.t('Floors.Error.NotActive'), req.t('Floors'), req.language))
        }

        await db.floorModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Floors'),
            role: 'floornotification',
            message: {
                en: `${Name} Floor Updated By ${username}.`,
                tr: `${Name} Katı ${username} Tarafından Güncellendi.`
            }[req.language],
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
        validationErrors.push(req.t('Floors.Error.FloorIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Floors.Error.UnsupportedFloorID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Floors'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        const floor = await db.floorModel.findOne({ where: { Uuid: Uuid } })
        if (!floor) {
            return next(createNotFoundError(req.t('Floors.Error.NotFound'), req.t('Floors'), req.language))
        }
        if (floor.Isactive === false) {
            return next(createNotFoundError(req.t('Floors.Error.NotActive'), req.t('Floors'), req.language))
        }

        await db.floorModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Floors'),
            role: 'floornotification',
            message: {
                en: `${floor?.Name} Floor Deleted By ${username}.`,
                tr: `${floor?.Name} Katı ${username} Tarafından Silindi.`
            }[req.language],
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