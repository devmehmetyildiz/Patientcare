const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetBeds(req, res, next) {
    try {
        const beds = await db.bedModel.findAll()
        res.status(200).json(beds)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetBed(req, res, next) {

    let validationErrors = []
    if (!req.params.bedId) {
        validationErrors.push(req.t('Beds.Error.IdRequired'))
    }
    if (!validator.isUUID(req.params.bedId)) {
        validationErrors.push(req.t('Beds.Error.UnsupportedBedID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Beds'), req.language))
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
        validationErrors.push(req.t('Beds.Error.NameRequired'))
    }
    if (!validator.isUUID(RoomID)) {
        validationErrors.push(req.t('Beds.Error.RoomIDRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Beds'), req.language))
    }

    let beduuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        await db.bedModel.create({
            ...req.body,
            Uuid: beduuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: req.t('Beds'),
            role: 'bednotification',
            message: {
                tr: `${Name} yatağı ${username} tarafından Oluşturuldu.`,
                en: `${Name} bed created by ${username}`
            }[req.language],
            pushurl: '/Beds'
        })

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
        validationErrors.push(req.t('Beds.Error.NameRequired'))
    }
    if (!validator.isUUID(RoomID)) {
        validationErrors.push(req.t('Beds.Error.RoomIDRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Beds.Error.IdRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Beds.Error.UnsupportedBedID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Beds'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        const bed = await db.bedModel.findOne({ where: { Uuid: Uuid } })
        if (!bed) {
            return next(createNotFoundError(req.t('Beds.Error.NotFound'), req.t('Beds'), req.language))
        }
        if (bed.Isactive === false) {
            return next(createNotFoundError(req.t('Beds.Error.NotActive'), req.t('Beds'), req.language))
        }

        await db.bedModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Beds'),
            role: 'bednotification',
            message: {
                tr: `${Name} yatağı ${username} tarafından Güncellendi.`,
                en: `${Name} bed updated by ${username}`
            }[req.language],
            pushurl: '/Beds'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetBeds(req, res, next)
}

async function ChangeBedstatus(req, res, next) {

    let validationErrors = []
    const {
        OldUuid,
        NewUuid,
        Status
    } = req.body

    if (!NewUuid) {
        validationErrors.push(req.t('Beds.Error.IdRequired'))
    }
    if (!validator.isUUID(NewUuid)) {
        validationErrors.push(req.t('Beds.Error.UnsupportedBedID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        if (OldUuid && validator.isUUID(OldUuid)) {
            const oldbed = await db.bedModel.findOne({ where: { Uuid: OldUuid } })
            if (!oldbed) {
                return next(createNotFoundError(req.t('Beds.Error.NotFound'), req.t('Beds'), req.language))
            }
            if (oldbed.Isactive === false) {
                return next(createNotFoundError(req.t('Beds.Error.NotFound'), req.t('Beds'), req.language))
            }

            await db.bedModel.update({
                ...oldbed,
                Isoccupied: false,
                Updateduser: username,
                Updatetime: new Date(),
            }, { where: { Uuid: OldUuid }, transaction: t })
        }
        const newBed = await db.bedModel.findOne({ where: { Uuid: NewUuid } })
        if (!newBed) {
            return next(createNotFoundError(req.t('Beds.Error.NotFound'), req.t('Beds'), req.language))
        }
        if (newBed.Isactive === false) {
            return next(createNotFoundError(req.t('Beds.Error.NotFound'), req.t('Beds'), req.language))
        }

        await db.bedModel.update({
            ...newBed,
            Isoccupied: validator.isBoolean(Status) ? Status : true,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: NewUuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Beds'),
            role: 'bednotification',
            message: {
                tr: `${newBed?.Name} yatağı ${username} tarafından Güncellendi.`,
                en: `${newBed?.Name} bed updated by ${username}`
            }[req.language],
            pushurl: '/Beds'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetBeds(req, res, next)
}

async function ChangeBedOccupied(req, res, next) {

    let validationErrors = []
    const {
        BedID,
        Isoccupied,
        PatientID
    } = req.body

    if (!validator.isUUID(BedID)) {
        validationErrors.push(req.t('Beds.Error.IdRequired'))
    }
    if (!validator.isBoolean(Isoccupied)) {
        validationErrors.push(req.t('Beds.Error.Isoccupied'))
    } else {
        if (Isoccupied && !validator.isUUID(PatientID)) {
            validationErrors.push(req.t('Beds.Error.PatientIDRequired'))
        }
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        const bed = await db.bedModel.findOne({ where: { Uuid: BedID } })
        if (!bed) {
            return next(createNotFoundError(req.t('Beds.Error.NotFound'), req.t('Beds'), req.language))
        }
        if (bed.Isactive === false) {
            return next(createNotFoundError(req.t('Beds.Error.NotActive'), req.t('Beds'), req.language))
        }

        await db.bedModel.update({
            ...bed,
            Isoccupied: Isoccupied,
            PatientID: Isoccupied ? PatientID : null,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: BedID }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Beds'),
            role: 'bednotification',
            message: {
                tr: `${bed?.Name} yatağı ${username} tarafından Güncellendi.`,
                en: `${bed?.Name} bed updated by ${username}`
            }[req.language],
            pushurl: '/Beds'
        })

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
        validationErrors.push(req.t('Beds.Error.IdRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Beds.Error.UnsupportedBedID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        const bed = await db.bedModel.findOne({ where: { Uuid: Uuid } })
        if (!bed) {
            return next(createNotFoundError(req.t('Beds.Error.NotFound'), req.t('Beds'), req.language))
        }
        if (bed.Isactive === false) {
            return next(createNotFoundError(req.t('Beds.Error.NotActive'), req.t('Beds'), req.language))
        }
        if (bed.Isoccupied === true || bed.Isoccupied === 1) {
            return next(createNotFoundError(req.t('Beds.Error.Isoccupied'), req.t('Beds'), req.language))
        }

        await db.bedModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Beds'),
            role: 'bednotification',
            message: {
                tr: `${bed?.Name} yatağı ${username} tarafından Silindi.`,
                en: `${bed?.Name} bed deleted by ${username}`
            }[req.language],
            pushurl: '/Beds'
        })

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
    ChangeBedstatus,
    ChangeBedOccupied
}
