const messages = require("../Constants/ClaimpaymentMessages")
const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const { claimpaymenttypes } = require('../Constants/Claimpaymenttypes')
const DoGet = require("../Utilities/DoGet")
const config = require("../Config")

async function GetClaimpayments(req, res, next) {
    try {
        const claimpayments = await db.claimpaymentModel.findAll()
        for (const claimpayment of claimpayments) {
            claimpayment.Details = await db.claimpaymentdetailModel.findAll({ where: { ParentID: claimpayment?.Uuid, Isactive: true } })
        }
        res.status(200).json(claimpayments)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetClaimpayment(req, res, next) {

    let validationErrors = []
    if (!req.params.claimpaymentId) {
        validationErrors.push(messages.VALIDATION_ERROR.CLAIMPAYMENTID_REQUIRED)
    }
    if (!validator.isUUID(req.params.claimpaymentId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_CLAIMPAYMENTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const claimpayment = await db.claimpaymentModel.findOne({ where: { Uuid: req.params.claimpaymentId } });
        claimpayment.Details = await db.claimpaymentdetailModel.findAll({ where: { ParentID: claimpayment?.Uuid, Isactive: true } })
        res.status(200).json(claimpayment)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddClaimpayment(req, res, next) {

    let validationErrors = []
    const {
        Type,
        Starttime,
        Endtime,
    } = req.body

    if (!validator.isNumber(Type)) {
        validationErrors.push(messages.VALIDATION_ERROR.TYPE_REQUIRED)
        return next(createValidationError(validationErrors, req.language))
    }
    if (!validator.isISODate(Starttime)) {
        return next(createValidationError([messages.VALIDATION_ERROR.STARTTIME_REQUIRED], req.language))
    }
    if (!validator.isISODate(Endtime)) {
        return next(createValidationError([messages.VALIDATION_ERROR.ENDTIME_REQUIRED], req.language))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let ClaimpaymentID = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    let CalculationResponse = null
    try {
        const config = {
            ClaimpaymentID: ClaimpaymentID,
            Type: Type,
            Starttime: new Date(Starttime),
            Endtime: new Date(Endtime),
            next: next
        }

        switch (Type) {
            case claimpaymenttypes.Patient:
                CalculationResponse = await CreateClaimpaymentByPatient(config)
                break;
            case claimpaymenttypes.Bhks:
                CalculationResponse = await CreateClaimpaymentByBhks(config)
                break;
            case claimpaymenttypes.Kys:
                CalculationResponse = await CreateClaimpaymentByKys(config)
                break;
            case claimpaymenttypes.Personel:
                CalculationResponse = await CreateClaimpaymentByPersonel(config)
                break;
            default:
                return next(createValidationError([messages.VALIDATION_ERROR.UNSUPPORTED_TYPE], req.language))
        }

        await db.claimpaymentModel.create({
            ...CalculationResponse,
            Uuid: ClaimpaymentID,
            Isapproved: false,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: 'Hakedişler',
            role: 'claimpaymentnotification',
            message: `${ClaimpaymentID} numaralı hakediş ${username} tarafından Eklendi.`,
            pushurl: '/Claimpayments'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetClaimpayments(req, res, next)
}

async function ApproveClaimpayment(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.claimpaymentId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.CLAIMPAYMENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_CLAIMPAYMENTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const claimpayment = await db.claimpaymentModel.findOne({ where: { Uuid: Uuid } })
        if (!claimpayment) {
            return next(createNotfounderror([messages.ERROR.CLAIMPAYMENT_NOT_FOUND], req.language))
        }
        if (claimpayment.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.CLAIMPAYMENT_NOT_ACTIVE], req.language))
        }
        if (claimpayment.Isapproved === true) {
            return next(createAccessDenied([messages.ERROR.CLAIMPAYMENT_ALREADY_APPROVED], req.language))
        }

        await db.claimpaymentparameterModel.update({
            ...claimpayment,
            Isapproved: true,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })


        await CreateNotification({
            type: types.Update,
            service: 'Hakedişlet',
            role: 'claimpaymentnotification',
            message: `${Uuid} numaralı hakediş ${username} tarafından Onaylandı.`,
            pushurl: '/Claimpayments'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetClaimpayments(req, res, next)
}

async function DeleteClaimpayment(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.claimpaymentId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.CLAIMPAYMENTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_CLAIMPAYMENTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const claimpayment = await db.claimpaymentModel.findOne({ where: { Uuid: Uuid } })
        if (!claimpayment) {
            return next(createNotfounderror([messages.ERROR.CLAIMPAYMENT_NOT_FOUND], req.language))
        }
        if (claimpayment.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.CLAIMPAYMENT_NOT_ACTIVE], req.language))
        }

        await db.claimpaymentModel.update({
            ...claimpayment,
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: 'Hakediş Parametreleri',
            role: 'claimpaymentparameternotification',
            message: `${Uuid} numaralı hakediş parametresi ${username} tarafından Silindi.`,
            pushurl: '/Claimpaymentparameters'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetClaimpayments(req, res, next)
}

async function CreateClaimpaymentByPatient({ ClaimpaymentID, Type, Starttime, Endtime, next }) {

    let details = []
    let Totaldaycount = 0
    let Totalcalculatedpayment = 0
    let Totalcalculatedkdv = 0
    let Totalcalculatedfinal = 0
    let Totalcalculatedwithholding = 0

    Totaldaycount = GetDayCount(Starttime, Endtime)
    const costumertypes = await DoGet(config.services.Setting, 'Costumertypes')
    const cases = await DoGet(config.services.Setting, 'Cases')
    const claimpaymentparameter = await db.claimpaymentparameterModel.findOne({ where: { Isactive: true, Issettingactive: true, Isapproved: true } })
    if (!claimpaymentparameter) {
        return next(createValidationError([messages.ERROR.CLAIMPAYMENTPARAMETER_NOT_FOUND], req.language))
    }
    const selectedcostumertype = (costumertypes || []).find(u => u.Uuid === claimpaymentparameter?.CostumertypeID)
    if (!selectedcostumertype) {
        return next(createValidationError([messages.ERROR.PARAMETERCOSTUMERTYPE_NOT_FOUND], req.language))
    }
    const patients = await db.patientModel.findAll({
        include: [
            {
                model: db.patientdefineModel,
                where: {
                    CostumertypeID: selectedcostumertype?.Uuid || ''
                },
                required: true 
            }
        ],
        where: Sequelize.literal(
            '`patientModel`.`PatientdefineID` = `patientdefineModel`.`Uuid` AND ' +
            '`patientModel`.`Isactive` = true AND ' +
            '`patientModel`.`Ischecked` = true AND ' +
            '`patientModel`.`Isapproved` = true AND ' +
            '`patientModel`.`Isalive` = true AND ' +
            '`patientModel`.`Ispreregistration` = false AND ' +
            '`patientModel`.`Isleft` = false'
        )
    });
    if ((patients || []).length <= 0) {
        return next(createValidationError([messages.ERROR.NO_PATIENT_FOUND], req.language))
    }
    const dates = getDateArray(Starttime, Endtime)
    for (const patient of patients) {
        const patientmovements = await db.patientmovementModel.findAll({ where: { PatientID: patient?.Uuid, } });
    }
}

async function CreateClaimpaymentByBhks(ClaimpaymentID, Type, Starttime, Endtime, next) {

}

async function CreateClaimpaymentByKys(ClaimpaymentID, Type, Starttime, Endtime, next) {

}

async function CreateClaimpaymentByPersonel(ClaimpaymentID, Type, Starttime, Endtime, next) {

}

function GetDayCount(Starttime, Endtime) {
    const oneDay = 1000 * 60 * 60 * 24;

    const differenceInTime = Endtime.getTime() - Starttime.getTime();

    const differenceInDays = Math.round(differenceInTime / oneDay);

    return differenceInDays;
}

function getDateArray(Starttime, Endtime) {
    let dateArray = [];
    let currentDate = new Date(Starttime);

    while (currentDate <= Endtime) {
        dateArray.push(currentDate);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
}

module.exports = {
    GetClaimpayments,
    GetClaimpayment,
    AddClaimpayment,
    ApproveClaimpayment,
    DeleteClaimpayment
}