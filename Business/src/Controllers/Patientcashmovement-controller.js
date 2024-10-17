const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotfounderror = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetPatientcashmovements(req, res, next) {
    try {
        const patientcashmovements = await db.patientcashmovementModel.findAll()
        res.status(200).json(patientcashmovements)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPatientcashmovement(req, res, next) {

    let validationErrors = []
    if (!req.params.movementId) {
        validationErrors.push(req.t('Patientcashmovements.Error.PatientmovementIDRequired'))
    }
    if (!validator.isUUID(req.params.movementId)) {
        validationErrors.push(req.t('Patientcashmovements.Error.UnsupportedPatientmovementID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patientcashmovements'), req.language))
    }

    try {
        const patientcashmovement = await db.patientcashmovementModel.findOne({ where: { Uuid: req.params.movementId } });
        res.status(200).json(patientcashmovement)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}


async function AddPatientcashmovement(req, res, next) {

    let validationErrors = []
    const {
        PatientID,
        RegisterID,
        Movementtype,
        Movementvalue,
    } = req.body


    if (!validator.isUUID(PatientID)) {
        validationErrors.push(req.t('Patientcashmovements.Error.PatientIDRequired'))
    }
    if (!validator.isUUID(RegisterID)) {
        validationErrors.push(req.t('Patientcashmovements.Error.RegisterIDRequired'))
    }
    if (!validator.isNumber(Movementtype)) {
        validationErrors.push(req.t('Patientcashmovements.Error.MovementtypeRequired'))
    }
    if (!validator.isNumber(Movementvalue)) {
        validationErrors.push(req.t('Patientcashmovements.Error.MovementvalueRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patientcashmovements'), req.language))
    }

    let movementuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {

        const registertype = await db.patientcashregisterModel.findAll({ where: { Isactive: true, Uuid: RegisterID } })
        if (!registertype) {
            return next(createNotfounderror(req.t('Patientcashmovements.Error.PatientcashregisterNotFound'), req.t('Patientcashmovements'), req.language))
        }
        if (registertype.Isactive === false) {
            return next(createNotfounderror(req.t('Patientcashmovements.Error.PatientcashregisterNotActive'), req.t('Patientcashmovements'), req.language))
        }

        if (registertype.Iseffectcompany) {
            let companyuuid = uuid()
            await db.companycashmovementModel.create({
                Movementtype: (Movementtype * -1),
                Movementvalue: Movementvalue,
                Info: '',
                Uuid: companyuuid,
                Createduser: "System",
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
        }

        await db.patientcashmovementModel.create({
            ...req.body,
            Uuid: movementuuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        const patient = await db.patientModel.findOne({ where: { Uuid: PatientID } });
        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } });

        await CreateNotification({
            type: types.Create,
            service: req.t('Patientcashmovements'),
            role: 'patientcashmovementnotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Hastasına ait para hareketi ${username} tarafından Oluşturuldu.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient Cash Movement Created By ${username}`
            }[req.language],
            pushurl: '/Patientcashmovements'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetPatientcashmovements(req, res, next)
}

async function UpdatePatientcashmovement(req, res, next) {

    let validationErrors = []
    const {
        PatientID,
        RegisterID,
        Movementtype,
        Movementvalue,
        Uuid
    } = req.body

    if (!validator.isUUID(PatientID)) {
        validationErrors.push(req.t('Patientcashmovements.Error.PatientIDRequired'))
    }
    if (!validator.isUUID(RegisterID)) {
        validationErrors.push(req.t('Patientcashmovements.Error.RegisterIDRequired'))
    }
    if (!validator.isNumber(Movementtype)) {
        validationErrors.push(req.t('Patientcashmovements.Error.MovementtypeRequired'))
    }
    if (!validator.isNumber(Movementvalue)) {
        validationErrors.push(req.t('Patientcashmovements.Error.MovementvalueRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Patientcashmovements.Error.PatientmovementIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patientcashmovements.Error.UnsupportedPatientmovementID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patientcashmovements'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patientcashmovement = await db.patientcashmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!patientcashmovement) {
            return next(createNotfounderror(req.t('Patientcashmovements.Error.NotFound'), req.t('Patientcashmovements'), req.language))
        }
        if (patientcashmovement.Isactive === false) {
            return next(createNotfounderror(req.t('Patientcashmovements.Error.NotActive'), req.t('Patientcashmovements'), req.language))
        }

        await db.patientcashmovementModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        const patient = await db.patientModel.findOne({ where: { Uuid: PatientID } });
        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } });

        await CreateNotification({
            type: types.Update,
            service: req.t('Patientcashmovements'),
            role: 'patientcashmovementnotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Hastasına ait para hareketi ${username} tarafından Güncellendi.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient Cash Movement Updated By ${username}`
            }[req.language],
            pushurl: '/Patientcashmovements'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPatientcashmovements(req, res, next)

}

async function DeletePatientcashmovement(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.movementId

    if (!Uuid) {
        validationErrors.push(req.t('Patientcashmovements.Error.PatientmovementIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Patientcashmovements.Error.UnsupportedPatientmovementID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Patientcashmovements'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const patientcashmovement = await db.patientcashmovementModel.findOne({ where: { Uuid: Uuid } })
        if (!patientcashmovement) {
            return next(createNotfounderror(req.t('Patientcashmovements.Error.NotFound'), req.t('Patientcashmovements'), req.language))
        }
        if (patientcashmovement.Isactive === false) {
            return next(createNotfounderror(req.t('Patientcashmovements.Error.NotActive'), req.t('Patientcashmovements'), req.language))
        }

        await db.patientcashmovementModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })


        const patient = await db.patientModel.findOne({ where: { Uuid: patientcashmovement?.PatientID } });
        const patientdefine = await db.patientdefineModel.findOne({ where: { Uuid: patient?.PatientdefineID } });

        await CreateNotification({
            type: types.Delete,
            service: req.t('Patientcashmovements'),
            role: 'patientcashmovementnotification',
            message: {
                tr: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Hastasına ait para hareketi ${username} tarafından Silindi.`,
                en: `${patientdefine?.Firstname} ${patientdefine?.Lastname} Patient Cash Movement Deleted By ${username}`
            }[req.language],
            pushurl: '/Patientcashmovements'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetPatientcashmovements(req, res, next)
}

module.exports = {
    GetPatientcashmovements,
    GetPatientcashmovement,
    AddPatientcashmovement,
    UpdatePatientcashmovement,
    DeletePatientcashmovement,
}