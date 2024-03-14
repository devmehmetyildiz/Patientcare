const { types } = require("../Constants/Defines")
const messages = require("../Constants/RatingMessages")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetRatings(req, res, next) {
    try {
        const ratings = await db.ratingModel.findAll({ where: { Isactive: true } })
        res.status(200).json(ratings)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetRating(req, res, next) {

    let validationErrors = []
    if (!req.params.ratingId) {
        validationErrors.push(messages.VALIDATION_ERROR.RATINGID_REQUIRED)
    }
    if (!validator.isUUID(req.params.ratingId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_RATINGID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const rating = await db.ratingModel.findOne({ where: { Uuid: req.params.ratingId } });
        if (!rating) {
            return createNotfounderror([messages.ERROR.RATING_NOT_FOUND])
        }
        if (!rating.Isactive) {
            return createNotfounderror([messages.ERROR.RATING_NOT_ACTIVE])
        }
        res.status(200).json(rating)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddRating(req, res, next) {

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

    let ratinguuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.ratingModel.create({
            ...req.body,
            Uuid: ratinguuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: 'Değerlendirmeler',
            role: 'ratingnotification',
            message: `${Name} değerlendirmesi ${username} tarafından Oluşturuldu.`,
            pushurl: '/Ratings'
        })
        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetRatings(req, res, next)
}

async function UpdateRating(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Uuid
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.RATINGID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_RATINGID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const rating =await db.ratingModel.findOne({ where: { Uuid: Uuid } })
        if (!rating) {
            return next(createNotfounderror([messages.ERROR.RATING_NOT_FOUND], req.language))
        }
        if (rating.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.RATING_NOT_ACTIVE], req.language))
        }

        await db.ratingModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Değerlendirmeler',
            role: 'ratingnotification',
            message: `${Name} değerlendirmesi ${username} tarafından Güncellendi.`,
            pushurl: '/Ratings'
        })
        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetRatings(req, res, next)
}

async function DeleteRating(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.ratingId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.RATINGID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_RATINGID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        const rating =await db.ratingModel.findOne({ where: { Uuid: Uuid } })
        if (!rating) {
            return next(createNotfounderror([messages.ERROR.RATING_NOT_FOUND], req.language))
        }
        if (rating.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.RATING_NOT_ACTIVE], req.language))
        }

        await db.ratingModel.destroy({ where: { Uuid: Uuid }, transaction: t });

        await CreateNotification({
            type: types.Delete,
            service: 'Değerlendirmeler',
            role: 'ratingnotification',
            message: `${rating?.Name} değerlendirmesi ${username} tarafından Silindi.`,
            pushurl: '/Ratings'
        })
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetRatings(req, res, next)
}

module.exports = {
    GetRatings,
    GetRating,
    AddRating,
    UpdateRating,
    DeleteRating,
}