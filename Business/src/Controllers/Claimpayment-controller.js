const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
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
        validationErrors.push(req.t('Claimpayments.Error.ClaimpaymentIDRequired'))
    }
    if (!validator.isUUID(req.params.claimpaymentId)) {
        validationErrors.push(req.t('Claimpayments.Error.UnsupportedClaimpaymentID'))
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
        Name,
        Info,
        Type,
        Starttime,
        Endtime,
    } = req.body

    if (!validator.isNumber(Type)) {
        validationErrors.push(req.t('Claimpayments.Error.TypeRequired'))
    }
    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Claimpayments.Error.NameRequired'))
    }
    if (!validator.isISODate(Starttime)) {
        validationErrors.push(req.t('Claimpayments.Error.StarttimeRequired'))
    }
    if (!validator.isISODate(Endtime)) {
        validationErrors.push(req.t('Claimpayments.Error.EndtimeRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Claimpayments'), req.language))
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
            next: next,
            req: req
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
                return next(createValidationError(req.t('Claimpayments.Error.Unsupportedtype'), req.t('Claimpayments'), req.language))
        }

        if (!CalculationResponse) {
            return next(createValidationError(req.t('Claimpayments.Error.DidNotCalculate'), req.t('Claimpayments'), req.language))
        }

        const {
            details,
            Totaldaycount,
            Totalcalculatedpayment,
            Totalcalculatedkdv,
            Totalcalculatedfinal,
            Totalcalculatedwithholding
        } = CalculationResponse

        await db.claimpaymentModel.create({
            Name: Name,
            Info: Info,
            Type: Type,
            Starttime: Starttime,
            Endtime: Endtime,
            Uuid: ClaimpaymentID,
            Totaldaycount: Totaldaycount,
            Totalcalculatedpayment: Totalcalculatedpayment,
            Totalcalculatedkdv: Totalcalculatedkdv,
            Totalcalculatedfinal: Totalcalculatedfinal,
            Totalcalculatedwithholding: Totalcalculatedwithholding,
            Isonpreview: true,
            Isapproved: false,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        for (const detail of details) {

            const {
                PatientID,
                Daycount,
                Unitpayment,
                Calculatedpayment,
                Calculatedkdv,
                Calculatedfinal,
                Calculatedwithholding
            } = detail

            await db.claimpaymentdetailModel.create({
                Uuid: uuid(),
                ParentID: ClaimpaymentID,
                PatientID: PatientID,
                Daycount: Daycount,
                Unitpayment: Unitpayment,
                Calculatedpayment: Calculatedpayment,
                Calculatedkdv: Calculatedkdv,
                Calculatedfinal: Calculatedfinal,
                Calculatedwithholding: Calculatedwithholding,
                Createduser: username,
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })

        }

        await CreateNotification({
            type: types.Create,
            service: req.t('Claimpayments'),
            role: 'claimpaymentnotification',
            message: {
                tr: `${Name} İsimli Hakediş ${username} tarafından Oluşturuldu.`,
                en: `${Name} Named Claimpayment Created By ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Claimpayments.Error.ClaimpaymentIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Claimpayments.Error.UnsupportedClaimpaymentID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Claimpayments'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const claimpayment = await db.claimpaymentModel.findOne({ where: { Uuid: Uuid } })
        if (!claimpayment) {
            return next(createNotFoundError(req.t('Claimpayments.Error.NotFound'), req.t('Claimpayments'), req.language))
        }
        if (claimpayment.Isactive === false) {
            return next(createNotFoundError(req.t('Claimpayments.Error.NotActive'), req.t('Claimpayments'), req.language))
        }
        if (claimpayment.Isapproved === true) {
            return next(createNotFoundError(req.t('Claimpayments.Error.Approved'), req.t('Claimpayments'), req.language))
        }

        await db.claimpaymentModel.update({
            Isapproved: true,
            Approveduser: username,
            Approvetime: new Date(),
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })


        await CreateNotification({
            type: types.Update,
            service: req.t('Claimpayments'),
            role: 'claimpaymentnotification',
            message: {
                tr: `${claimpayment?.Name} İsimli Hakediş ${username} tarafından Onaylandı.`,
                en: `${claimpayment?.Name} Named Claimpayment Approved By ${username}`
            }[req.language],
            pushurl: '/Claimpayments'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetClaimpayments(req, res, next)
}

async function SavepreviewClaimpayment(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.claimpaymentId

    if (!Uuid) {
        validationErrors.push(req.t('Claimpayments.Error.ClaimpaymentIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Claimpayments.Error.UnsupportedClaimpaymentID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Claimpayments'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const claimpayment = await db.claimpaymentModel.findOne({ where: { Uuid: Uuid } })
        if (!claimpayment) {
            return next(createNotFoundError(req.t('Claimpayments.Error.NotFound'), req.t('Claimpayments'), req.language))
        }
        if (claimpayment.Isactive === false) {
            return next(createNotFoundError(req.t('Claimpayments.Error.NotActive'), req.t('Claimpayments'), req.language))
        }
        if (claimpayment.Isapproved === true) {
            return next(createNotFoundError(req.t('Claimpayments.Error.Approved'), req.t('Claimpayments'), req.language))
        }

        await db.claimpaymentModel.update({
            Isonpreview: false,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid, }, transaction: t })


        await CreateNotification({
            type: types.Update,
            service: req.t('Claimpayments'),
            role: 'claimpaymentnotification',
            message: {
                tr: `${claimpayment?.Name} İsimli Hakediş ${username} tarafından Kayıt Edildi.`,
                en: `${claimpayment?.Name} Named Claimpayment Saved By ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Claimpayments.Error.ClaimpaymentIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Claimpayments.Error.UnsupportedClaimpaymentID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Claimpayments'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const claimpayment = await db.claimpaymentModel.findOne({ where: { Uuid: Uuid } })
        if (!claimpayment) {
            return next(createNotFoundError(req.t('Claimpayments.Error.NotFound'), req.t('Claimpayments'), req.language))
        }
        if (claimpayment.Isactive === false) {
            return next(createNotFoundError(req.t('Claimpayments.Error.NotActive'), req.t('Claimpayments'), req.language))
        }

        await db.claimpaymentModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.claimpaymentdetailModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { ParentID: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Claimpayments'),
            role: 'claimpaymentnotification',
            message: {
                tr: `${claimpayment?.Name} İsimli Hakediş ${username} tarafından Silindi.`,
                en: `${claimpayment?.Name} Named Claimpayment Deleted By ${username}`
            }[req.language],
            pushurl: '/Claimpayments'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetClaimpayments(req, res, next)
}

async function CreateClaimpaymentByPatient({ Starttime, Endtime, req, next, }) {

    let details = []
    let Totaldaycount = 0
    let Totalcalculatedpayment = 0
    let Totalcalculatedkdv = 0
    let Totalcalculatedfinal = 0
    let Totalcalculatedwithholding = 0

    const costumertypes = await DoGet(config.services.Setting, 'Costumertypes')
    const cases = await DoGet(config.services.Setting, 'Cases')
    const claimpaymentparameter = await db.claimpaymentparameterModel.findOne(
        {
            where:
            {
                Isactive: true,
                Issettingactive: true,
                Isapproved: true,
                Type: claimpaymenttypes.Patient
            }
        })
    if (!claimpaymentparameter) {
        return next(createValidationError(req.t('Claimpayments.Error.ClaimpaymentparameterNotFound'), req.t('Claimpayments'), req.language))
    }
    const selectedcostumertype = (costumertypes || []).find(u => u.Uuid === claimpaymentparameter?.CostumertypeID)
    if (!selectedcostumertype) {
        return next(createValidationError(req.t('Claimpayments.Error.ClaimpaymentparameterCostumertypeNotFound'), req.t('Claimpayments'), req.language))
    }
    const patients = await db.sequelize.query(
        `SELECT patients.* FROM patients
         JOIN patientdefines ON patients.PatientdefineID = patientdefines.Uuid
         WHERE patients.Isactive = true
           AND patients.Ischecked = true
           AND patients.Isapproved = true
           AND patients.Isalive = true
           AND patients.Ispreregistration = false
           AND patients.Isleft = false
           AND patientdefines.CostumertypeID = '${selectedcostumertype?.Uuid || ''}'
           `,
        {
            model: db.patientModel,
            mapToModel: true
        }
    );
    if ((patients || []).length <= 0) {
        return next(createValidationError(req.t('Claimpayments.Error.NoPatientFound'), req.t('Claimpayments'), req.language))
    }
    const dates = getDateArray(Starttime, Endtime)
    for (const patient of patients) {
        const patientmovements = await db.patientmovementModel.findAll({ where: { PatientID: patient?.Uuid || '' } });

        let daycount = 0

        for (const date of dates) {

            const filteredMovements = patientmovements.filter(movement => movement.Occureddate <= date);
            const sortedMovements = filteredMovements.sort((a, b) => b.Occureddate - a.Occureddate);
            const newestMovement = sortedMovements.length > 0 ? sortedMovements[0] : null;

            if (newestMovement) {
                const movementcase = cases.find(u => u.Uuid === newestMovement?.CaseID)
                const isCalculateclaimpayment = movementcase?.Iscalculateprice || false

                if (isCalculateclaimpayment) {
                    daycount += 1
                }
            }
        }

        const perpayment = claimpaymentparameter?.Patientclaimpaymentperpayment || 0
        const kdvpercent = claimpaymentparameter?.Perpaymentkdvpercent || 0
        const kdvwithholdingpercent = claimpaymentparameter?.Perpaymentkdvwithholdingpercent || 0

        const kdv = kdvpercent / 100
        const kdvwithholding = kdvwithholdingpercent / 100

        const totalpayment = daycount * perpayment

        const calculatedkdv = totalpayment * kdv
        const calculatedwithholding = calculatedkdv * kdvwithholding

        const totalfinal = totalpayment + calculatedkdv

        Totaldaycount += daycount
        Totalcalculatedpayment += totalpayment
        Totalcalculatedkdv += calculatedkdv
        Totalcalculatedfinal += totalfinal
        Totalcalculatedwithholding += calculatedwithholding

        details.push({
            PatientID: patient?.Uuid,
            Daycount: daycount,
            Unitpayment: perpayment,
            Calculatedpayment: totalpayment,
            Calculatedkdv: calculatedkdv,
            Calculatedfinal: totalfinal,
            Calculatedwithholding: calculatedwithholding
        })
    }

    return {
        details,
        Totaldaycount,
        Totalcalculatedpayment,
        Totalcalculatedkdv,
        Totalcalculatedfinal,
        Totalcalculatedwithholding,
    }
}

async function CreateClaimpaymentByBhks({ Starttime, Endtime, req, next, }) {
    let details = []
    let Totaldaycount = 0
    let Totalcalculatedpayment = 0
    let Totalcalculatedkdv = 0
    let Totalcalculatedfinal = 0
    let Totalcalculatedwithholding = 0

    const costumertypes = await DoGet(config.services.Setting, 'Costumertypes')
    const cases = await DoGet(config.services.Setting, 'Cases')
    const claimpaymentparameter = await db.claimpaymentparameterModel.findOne(
        {
            where:
            {
                Isactive: true,
                Issettingactive: true,
                Isapproved: true,
                Type: claimpaymenttypes.Bhks
            }
        })
    if (!claimpaymentparameter) {
        return next(createValidationError(req.t('Claimpayments.Error.ClaimpaymentparameterNotFound'), req.t('Claimpayments'), req.language))
    }
    const selectedcostumertype = (costumertypes || []).find(u => u.Uuid === claimpaymentparameter?.CostumertypeID)
    if (!selectedcostumertype) {
        return next(createValidationError(req.t('Claimpayments.Error.ClaimpaymentparameterCostumertypeNotFound'), req.t('Claimpayments'), req.language))
    }
    const patients = await db.sequelize.query(
        `SELECT patients.* FROM patients
         JOIN patientdefines ON patients.PatientdefineID = patientdefines.Uuid
         WHERE patients.Isactive = true
           AND patients.Ischecked = true
           AND patients.Isapproved = true
           AND patients.Isalive = true
           AND patients.Ispreregistration = false
           AND patients.Isleft = false
           AND patientdefines.CostumertypeID = '${selectedcostumertype?.Uuid || ''}'
           `,
        {
            model: db.patientModel,
            mapToModel: true
        }
    );
    if ((patients || []).length <= 0) {
        return next(createValidationError(req.t('Claimpayments.Error.NoPatientFound'), req.t('Claimpayments'), req.language))
    }
    const dates = getDateArray(Starttime, Endtime)
    for (const patient of patients) {
        const patientmovements = await db.patientmovementModel.findAll({ where: { PatientID: patient?.Uuid || '' } });

        let daycount = 0

        for (const date of dates) {

            const filteredMovements = patientmovements.filter(movement => movement.Occureddate <= date);
            const sortedMovements = filteredMovements.sort((a, b) => b.Occureddate - a.Occureddate);
            const newestMovement = sortedMovements.length > 0 ? sortedMovements[0] : null;

            if (newestMovement) {
                const movementcase = cases.find(u => u.Uuid === newestMovement?.CaseID)
                const isCalculateclaimpayment = movementcase?.Iscalculateprice || false

                if (isCalculateclaimpayment) {
                    daycount += 1
                }
            }

            if (daycount > 0) {
                break;
            }
        }

        if (daycount > 0) {
            const perpayment = claimpaymentparameter?.Patientclaimpaymentperpayment || 0
            const kdvpercent = claimpaymentparameter?.Perpaymentkdvpercent || 0
            const kdvwithholdingpercent = claimpaymentparameter?.Perpaymentkdvwithholdingpercent || 0

            const kdv = kdvpercent / 100
            const kdvwithholding = kdvwithholdingpercent / 100

            const totalpayment = 1 * perpayment

            const calculatedkdv = totalpayment * kdv
            const calculatedwithholding = calculatedkdv * kdvwithholding

            const totalfinal = totalpayment + calculatedkdv

            Totaldaycount += daycount
            Totalcalculatedpayment += totalpayment
            Totalcalculatedkdv += calculatedkdv
            Totalcalculatedfinal += totalfinal
            Totalcalculatedwithholding += calculatedwithholding

            details.push({
                PatientID: patient?.Uuid,
                Daycount: daycount,
                Unitpayment: perpayment,
                Calculatedpayment: totalpayment,
                Calculatedkdv: calculatedkdv,
                Calculatedfinal: totalfinal,
                Calculatedwithholding: calculatedwithholding
            })
        }
    }

    return {
        details,
        Totaldaycount,
        Totalcalculatedpayment,
        Totalcalculatedkdv,
        Totalcalculatedfinal,
        Totalcalculatedwithholding,
    }
}

async function CreateClaimpaymentByKys({ Starttime, Endtime, req, next, }) {
    let details = []
    let Totaldaycount = 0
    let Totalcalculatedpayment = 0
    let Totalcalculatedkdv = 0
    let Totalcalculatedfinal = 0
    let Totalcalculatedwithholding = 0

    const costumertypes = await DoGet(config.services.Setting, 'Costumertypes')
    const cases = await DoGet(config.services.Setting, 'Cases')
    const claimpaymentparameter = await db.claimpaymentparameterModel.findOne(
        {
            where:
            {
                Isactive: true,
                Issettingactive: true,
                Isapproved: true,
                Type: claimpaymenttypes.Kys
            }
        })
    if (!claimpaymentparameter) {
        return next(createValidationError(req.t('Claimpayments.Error.ClaimpaymentparameterNotFound'), req.t('Claimpayments'), req.language))
    }
    const selectedcostumertype = (costumertypes || []).find(u => u.Uuid === claimpaymentparameter?.CostumertypeID)
    if (!selectedcostumertype) {
        return next(createValidationError(req.t('Claimpayments.Error.ClaimpaymentparameterCostumertypeNotFound'), req.t('Claimpayments'), req.language))
    }
    const patients = await db.sequelize.query(
        `SELECT patients.* FROM patients
         JOIN patientdefines ON patients.PatientdefineID = patientdefines.Uuid
         WHERE patients.Isactive = true
           AND patients.Ischecked = true
           AND patients.Isapproved = true
           AND patients.Isalive = true
           AND patients.Ispreregistration = false
           AND patients.Isleft = false
           AND patientdefines.CostumertypeID = '${selectedcostumertype?.Uuid || ''}'
           `,
        {
            model: db.patientModel,
            mapToModel: true
        }
    );
    if ((patients || []).length <= 0) {
        return next(createValidationError(req.t('Claimpayments.Error.NoPatientFound'), req.t('Claimpayments'), req.language))
    }
    const dates = getDateArray(Starttime, Endtime)
    for (const patient of patients) {
        const patientmovements = await db.patientmovementModel.findAll({ where: { PatientID: patient?.Uuid || '' } });

        let daycount = 0

        for (const date of dates) {

            const filteredMovements = patientmovements.filter(movement => movement.Occureddate <= date);
            const sortedMovements = filteredMovements.sort((a, b) => b.Occureddate - a.Occureddate);
            const newestMovement = sortedMovements.length > 0 ? sortedMovements[0] : null;

            if (newestMovement) {
                const movementcase = cases.find(u => u.Uuid === newestMovement?.CaseID)
                const isCalculateclaimpayment = movementcase?.Iscalculateprice || false

                if (isCalculateclaimpayment) {
                    daycount += 1
                }
            }

            if (daycount > 0) {
                break;
            }
        }

        if (daycount > 0) {
            const perpayment = claimpaymentparameter?.Patientclaimpaymentperpayment || 0
            const kdvpercent = claimpaymentparameter?.Perpaymentkdvpercent || 0
            const kdvwithholdingpercent = claimpaymentparameter?.Perpaymentkdvwithholdingpercent || 0

            const kdv = kdvpercent / 100
            const kdvwithholding = kdvwithholdingpercent / 100

            const totalpayment = 1 * perpayment

            const calculatedkdv = totalpayment * kdv
            const calculatedwithholding = calculatedkdv * kdvwithholding

            const totalfinal = totalpayment + calculatedkdv

            Totaldaycount += daycount
            Totalcalculatedpayment += totalpayment
            Totalcalculatedkdv += calculatedkdv
            Totalcalculatedfinal += totalfinal
            Totalcalculatedwithholding += calculatedwithholding

            details.push({
                PatientID: patient?.Uuid,
                Daycount: daycount,
                Unitpayment: perpayment,
                Calculatedpayment: totalpayment,
                Calculatedkdv: calculatedkdv,
                Calculatedfinal: totalfinal,
                Calculatedwithholding: calculatedwithholding
            })
        }

    }

    return {
        details,
        Totaldaycount,
        Totalcalculatedpayment,
        Totalcalculatedkdv,
        Totalcalculatedfinal,
        Totalcalculatedwithholding,
    }
}

async function CreateClaimpaymentByPersonel() {

}

function getDateArray(Starttime, Endtime) {
    let dateArray = [];
    let currentDate = new Date(Starttime);

    while (currentDate <= Endtime) {
        dateArray.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
}

module.exports = {
    GetClaimpayments,
    GetClaimpayment,
    AddClaimpayment,
    ApproveClaimpayment,
    DeleteClaimpayment,
    SavepreviewClaimpayment
}