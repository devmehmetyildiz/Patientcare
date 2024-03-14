const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetPersonels(req, res, next) {
    try {
        const personels = await db.personelModel.findAll({ where: { Isactive: true } })
        res.status(200).json(personels)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPersonel(req, res, next) {

    let validationErrors = []
    if (!req.params.personelId) {
        validationErrors.push(messages.VALIDATION_ERROR.STATIONID_REQUIRED)
    }
    if (!validator.isUUID(req.params.personelId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_STATIONID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const personel = await db.personelModel.findOne({ where: { Uuid: req.params.personelId } });
        res.status(200).json(personel)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}


async function AddPersonel(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Surname,
        CountryID,
        Professions,
        Workstarttime,
        Gender,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isString(Surname)) {
        validationErrors.push(messages.VALIDATION_ERROR.SURNAME_REQUIRED)
    }
    if (!validator.isString(CountryID)) {
        validationErrors.push(messages.VALIDATION_ERROR.COUNTRYID_REQUIRED)
    }
    if (!validator.isString(Professions)) {
        validationErrors.push(messages.VALIDATION_ERROR.PROFESSION_REQUIRED)
    }
    if (!validator.isISODate(Workstarttime)) {
        validationErrors.push(messages.VALIDATION_ERROR.WORKSTARTTIME_REQUIRED)
    }
    if (!validator.isString(Gender)) {
        validationErrors.push(messages.VALIDATION_ERROR.GENDER_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let personeluuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.personelModel.create({
            ...req.body,
            Uuid: personeluuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetPersonels(req, res, next)
}

async function AddRecordPersonel(req, res, next) {

    const t = await db.sequelize.transaction();
    try {
        for (const data of req.body) {
            const {
                Name,
                Surname,
                CountryID,
                Professions,
                Workstarttime,
                Gender,
            } = data

            let validationErrors = []
            
            if (!validator.isString(Name)) {
                validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
            }
            if (!validator.isString(Surname)) {
                validationErrors.push(messages.VALIDATION_ERROR.SURNAME_REQUIRED)
            }
            if (!validator.isString(CountryID)) {
                validationErrors.push(messages.VALIDATION_ERROR.COUNTRYID_REQUIRED)
            }
            if (!validator.isString(Professions)) {
                validationErrors.push(messages.VALIDATION_ERROR.PROFESSION_REQUIRED)
            }
            if (!validator.isISODate(Workstarttime)) {
                validationErrors.push(messages.VALIDATION_ERROR.WORKSTARTTIME_REQUIRED)
            }
            if (!validator.isString(Gender)) {
                validationErrors.push(messages.VALIDATION_ERROR.GENDER_REQUIRED)
            }

            if (validationErrors.length > 0) {
                return next(createValidationError(validationErrors, req.language))
            }

            let personeluuid = uuid()

            await db.personelModel.create({
                ...data,
                Uuid: personeluuid,
                Createduser: "System",
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
        }

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetPersonels(req, res, next)
}

async function UpdatePersonel(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Surname,
        CountryID,
        Professions,
        Workstarttime,
        Gender,
        Uuid
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isString(Surname)) {
        validationErrors.push(messages.VALIDATION_ERROR.SURNAME_REQUIRED)
    }
    if (!validator.isString(CountryID)) {
        validationErrors.push(messages.VALIDATION_ERROR.COUNTRYID_REQUIRED)
    }
    if (!validator.isString(Professions)) {
        validationErrors.push(messages.VALIDATION_ERROR.PROFESSION_REQUIRED)
    }
    if (!validator.isISODate(Workstarttime)) {
        validationErrors.push(messages.VALIDATION_ERROR.WORKSTARTTIME_REQUIRED)
    }
    if (!validator.isString(Gender)) {
        validationErrors.push(messages.VALIDATION_ERROR.GENDER_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PERSONELID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PERSONELID)
    }

    const t = await db.sequelize.transaction();
    try {
        const personel = db.personelModel.findOne({ where: { Uuid: Uuid } })
        if (!personel) {
            return next(createNotfounderror([messages.ERROR.PERSONEL_NOT_FOUND], req.language))
        }
        if (personel.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PERSONEL_NOT_ACTIVE], req.language))
        }

        await db.personelModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPersonels(req, res, next)

}

async function DeletePersonel(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.personelId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PERSONELID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PERSONELID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const personel = db.personelModel.findOne({ where: { Uuid: Uuid } })
        if (!personel) {
            return next(createNotfounderror([messages.ERROR.PERSONEL_NOT_FOUND], req.language))
        }
        if (personel.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PERSONEL_NOT_ACTIVE], req.language))
        }

        await db.personelModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetPersonels(req, res, next)
}

module.exports = {
    GetPersonels,
    GetPersonel,
    AddPersonel,
    UpdatePersonel,
    DeletePersonel,
    AddRecordPersonel
}