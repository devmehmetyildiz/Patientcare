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
const ExcelJS = require("exceljs");

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

async function GetClaimpaymentReport(req, res, next) {

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
        const details = await db.claimpaymentdetailModel.findAll({ where: { ParentID: claimpayment?.Uuid, Isactive: true } })

        const patients = await db.patientModel.findAll()
        const patientdefines = await db.patientdefineModel.findAll()

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Rapor");

        worksheet.mergeCells("A1:H1");
        worksheet.getCell("A1").value = config.session.organization;
        worksheet.getCell("A1").font = { bold: true, size: 11, };
        worksheet.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };

        worksheet.mergeCells("A2:H2");
        worksheet.getCell("A2").value = "2025 YILI OCAK  AYI  HAKEDİŞ FATURA DÖKÜMÜ";
        worksheet.getCell("A2").font = { bold: true, size: 11, };
        worksheet.getCell("A2").alignment = { horizontal: "center", vertical: "middle" };

        worksheet.getRow(1).height = 40;
        worksheet.getRow(2).height = 40;

        const headers = [
            "S.NO", "ENGELLİNİN ADI SOYADI", "HİZMET VERİLEN GÜN", "GÜNLÜK ÜCRET TUTARI",
            "Aylık Memmur Maaş katsayısı", "KDV %10", "FATURA TUTARI (TL)", "KDV TEVKİFATI (5/10 Oranında)"
        ];

        worksheet.addRow(headers);
        worksheet.getRow(3).font = { bold: true };
        worksheet.getRow(3).alignment = { horizontal: "center", vertical: "middle" };

        worksheet.getRow(3).eachCell((cell) => {
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
            };
        });

        let data = [];
        details.forEach((detailItem, index) => {
            const patient = patients.find(u => u.Uuid === detailItem?.PatientID);
            const patientdefine = patientdefines.find(u => u.Uuid === patient?.PatientdefineID);

            data.push([
                index + 1,
                `${patientdefine?.Firstname} ${patientdefine?.Lastname}`,
                Number(detailItem?.Daycount ?? 0),
                Number(detailItem?.Unitpayment ?? 0),
                Number(detailItem?.Calculatedpayment ?? 0),
                Number(detailItem?.Calculatedkdv ?? 0),
                Number(detailItem?.Calculatedfinal ?? 0),
                Number(detailItem?.Calculatedwithholding ?? 0)
            ]);
        });

        worksheet.addRows(data);

        const startDate = new Date(claimpayment?.Reportdate)
        startDate.setMonth(startDate.getMonth() + 1)
        startDate.setDate(0)
        const endDate = startDate.getDate()
        for (let rowIndex = 3; rowIndex <= data.length + 3; rowIndex++) {
            worksheet.getRow(rowIndex).eachCell((cell, colNumber) => {
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" }
                };

                if (colNumber === 3) {
                    const dayCountValue = cell.value;
                    if (dayCountValue !== endDate) {
                        cell.font = { bold: true };
                    }
                }
            });
        }

        const buffer = await workbook.xlsx.writeBuffer()
        res.setHeader("Content-Length", buffer.length);

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=styled_export.xlsx");

        await workbook.xlsx.write(res);
        res.end();

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
        Reportdate
    } = req.body

    if (!validator.isNumber(Type)) {
        validationErrors.push(req.t('Claimpayments.Error.TypeRequired'))
    }
    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Claimpayments.Error.NameRequired'))
    }
    if (!validator.isISODate(Reportdate)) {
        validationErrors.push(req.t('Claimpayments.Error.ReportdateRequired'))
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
            Reportdate: new Date(Reportdate),
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
            Reportdate: Reportdate,
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

async function CreateClaimpaymentByPatient({ Reportdate, req, next, }) {

    let details = []
    let Totaldaycount = 0
    let Totalcalculatedpayment = 0
    let Totalcalculatedkdv = 0
    let Totalcalculatedfinal = 0
    let Totalcalculatedwithholding = 0

    const startOfMonth = new Date(Reportdate)
    startOfMonth.setHours(0, 0, 0, 0);
    const endtOfMonth = new Date(Reportdate)
    endtOfMonth.setMonth(endtOfMonth.getMonth() + 1)
    endtOfMonth.setDate(0)
    endtOfMonth.setHours(23, 59, 59, 999);

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

    const patients = await db.sequelize.query(`
        SELECT patients.* 
        FROM patients 
        JOIN patientdefines ON patients.PatientdefineID = patientdefines.Uuid
        WHERE patients.Approvaldate < :endtOfMonth
        AND (
            (patients.Isleft = false AND patients.Isalive = true) OR
            (patients.Isalive = true AND patients.Isleft = true AND patients.Leavedate > :startOfMonth) OR
            (patients.Isleft = false AND patients.Isalive = false AND patients.Deathdate > :startOfMonth)
          )
          AND patients.Ischecked = true
          AND patients.Isapproved = true
          AND patients.Ispreregistration = false
          AND patients.Isactive = true
          AND patientdefines.CostumertypeID = :costumertype
          `, {
        model: db.patientModel,
        mapToModel: true,
        replacements: {
            endtOfMonth: endtOfMonth,
            startOfMonth: startOfMonth,
            costumertype: selectedcostumertype?.Uuid || '',
        },
        type: Sequelize.QueryTypes.SELECT,
    });

    if ((patients || []).length <= 0) {
        return next(createValidationError(req.t('Claimpayments.Error.NoPatientFound'), req.t('Claimpayments'), req.language))
    }

    const dayArray = generateDateArray(startOfMonth, endtOfMonth)

    for (const patient of patients) {

        let daycount = 0

        for (const day of dayArray) {

            const dayStart = new Date(day)
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(day)
            dayEnd.setHours(23, 59, 59, 999);

            const now = new Date()
            now.setHours(23, 59, 59, 999);

            const occuredMovementsAfterDayStart = await db.patientmovementModel.findAll({
                where: {
                    PatientID: patient?.Uuid || '',
                    Isactive: true,
                    Occureddate: {
                        [Sequelize.Op.gte]: dayStart.getTime(),
                    }
                }
            })

            if ((occuredMovementsAfterDayStart || []).length > 0) {
                const isOccuredMovementsHasClaim = (occuredMovementsAfterDayStart || []).filter(movement => {
                    const movementcase = cases.find(u => u.Uuid === movement?.CaseID)
                    const isCalculateclaimpayment = movementcase?.Iscalculateprice || false
                    return isCalculateclaimpayment
                })

                if (isOccuredMovementsHasClaim.length > 0) {
                    daycount += 1
                }
            } else {

                const occuredMovementBeforeDayStart = await db.patientmovementModel.findOne({
                    where: {
                        PatientID: patient?.Uuid || '',
                        Isactive: true,
                        Occureddate: {
                            [Sequelize.Op.lt]: dayStart.getTime(),
                        },
                    },
                    order: [['Occureddate', 'DESC']],
                });

                if (occuredMovementBeforeDayStart) {
                    const movementcase = cases.find(u => u.Uuid === occuredMovementBeforeDayStart?.CaseID)
                    const isCalculateclaimpayment = movementcase?.Iscalculateprice || false
                    if (isCalculateclaimpayment) {
                        daycount += 1
                    }
                }
            }
        }

        const roundToFour = (num) => Math.round((num + Number.EPSILON) * 10000) / 10000;

        const perpayment = claimpaymentparameter?.Patientclaimpaymentperpayment || 0
        const kdvpercent = claimpaymentparameter?.Perpaymentkdvpercent || 0
        const kdvwithholdingpercent = claimpaymentparameter?.Perpaymentkdvwithholdingpercent || 0

        const kdv = roundToFour(kdvpercent / 100);
        const kdvwithholding = roundToFour(kdvwithholdingpercent / 100);

        const totalpayment = roundToFour(daycount * perpayment);
        const calculatedkdv = roundToFour(totalpayment * kdv);
        const calculatedwithholding = roundToFour(calculatedkdv * kdvwithholding);
        const totalfinal = roundToFour(totalpayment + calculatedkdv);

        Totaldaycount += daycount
        Totalcalculatedpayment = roundToFour(Totalcalculatedpayment + totalpayment);
        Totalcalculatedkdv = roundToFour(Totalcalculatedkdv + calculatedkdv);
        Totalcalculatedfinal = roundToFour(Totalcalculatedfinal + totalfinal);
        Totalcalculatedwithholding = roundToFour(Totalcalculatedwithholding + calculatedwithholding);

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

async function CreateClaimpaymentByBhks({ Reportdate, req, next, }) {

    let details = []
    let Totaldaycount = 0
    let Totalcalculatedpayment = 0
    let Totalcalculatedkdv = 0
    let Totalcalculatedfinal = 0
    let Totalcalculatedwithholding = 0

    const startOfMonth = new Date(Reportdate)
    startOfMonth.setHours(0, 0, 0, 0);
    const endtOfMonth = new Date(Reportdate)
    endtOfMonth.setMonth(endtOfMonth.getMonth() + 1)
    endtOfMonth.setDate(0)
    endtOfMonth.setHours(23, 59, 59, 999);

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

    const patients = await db.sequelize.query(`
        SELECT patients.* 
        FROM patients 
        JOIN patientdefines ON patients.PatientdefineID = patientdefines.Uuid
        WHERE patients.Approvaldate < :endtOfMonth
        AND (
            (patients.Isleft = false AND patients.Isalive = true) OR
            (patients.Isalive = true AND patients.Isleft = true AND patients.Leavedate > :startOfMonth) OR
            (patients.Isleft = false AND patients.Isalive = false AND patients.Deathdate > :startOfMonth)
          )
          AND patients.Ischecked = true
          AND patients.Isapproved = true
          AND patients.Ispreregistration = false
          AND patients.Isactive = true
          AND patientdefines.CostumertypeID = :costumertype
          `, {
        model: db.patientModel,
        mapToModel: true,
        replacements: {
            endtOfMonth: endtOfMonth,
            startOfMonth: startOfMonth,
            costumertype: selectedcostumertype?.Uuid || '',
        },
        type: Sequelize.QueryTypes.SELECT,
    });

    if ((patients || []).length <= 0) {
        return next(createValidationError(req.t('Claimpayments.Error.NoPatientFound'), req.t('Claimpayments'), req.language))
    }

    for (const patient of patients) {

        let daycount = 0

        const occuredMovementsAfterDayStart = await db.patientmovementModel.findAll({
            where: {
                PatientID: patient?.Uuid || '',
                Isactive: true,
                Occureddate: {
                    [Sequelize.Op.gte]: startOfMonth.getTime(),
                }
            }
        })

        if ((occuredMovementsAfterDayStart || []).length > 0) {
            const isOccuredMovementsHasClaim = (occuredMovementsAfterDayStart || []).filter(movement => {
                const movementcase = cases.find(u => u.Uuid === movement?.CaseID)
                const isCalculateclaimpayment = movementcase?.Iscalculateprice || false
                return isCalculateclaimpayment
            })

            if (isOccuredMovementsHasClaim.length > 0) {
                daycount += 1
            }
        } else {

            const occuredMovementBeforeDayStart = await db.patientmovementModel.findOne({
                where: {
                    PatientID: patient?.Uuid || '',
                    Isactive: true,
                    Occureddate: {
                        [Sequelize.Op.lt]: startOfMonth.getTime(),
                    },
                },
                order: [['Occureddate', 'DESC']],
            });

            if (occuredMovementBeforeDayStart) {
                const movementcase = cases.find(u => u.Uuid === occuredMovementBeforeDayStart?.CaseID)
                const isCalculateclaimpayment = movementcase?.Iscalculateprice || false
                if (isCalculateclaimpayment) {
                    daycount += 1
                }
            }
        }

        if (daycount > 0) {

            const roundToFour = (num) => Math.round((num + Number.EPSILON) * 10000) / 10000;

            const perpayment = claimpaymentparameter?.Patientclaimpaymentperpayment || 0
            const kdvpercent = claimpaymentparameter?.Perpaymentkdvpercent || 0
            const kdvwithholdingpercent = claimpaymentparameter?.Perpaymentkdvwithholdingpercent || 0

            const kdv = roundToFour(kdvpercent / 100)
            const kdvwithholding = roundToFour(kdvwithholdingpercent / 100)

            const totalpayment = 1 * perpayment

            const calculatedkdv = roundToFour(totalpayment * kdv)
            const calculatedwithholding = roundToFour(calculatedkdv * kdvwithholding)

            const totalfinal = roundToFour(totalpayment + calculatedkdv)

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

async function CreateClaimpaymentByKys({ Reportdate, req, next, }) {
    let details = []
    let Totaldaycount = 0
    let Totalcalculatedpayment = 0
    let Totalcalculatedkdv = 0
    let Totalcalculatedfinal = 0
    let Totalcalculatedwithholding = 0

    const startOfMonth = new Date(Reportdate)
    startOfMonth.setHours(0, 0, 0, 0);
    const endtOfMonth = new Date(Reportdate)
    endtOfMonth.setMonth(endtOfMonth.getMonth() + 1)
    endtOfMonth.setDate(0)
    endtOfMonth.setHours(23, 59, 59, 999);

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

    const patients = await db.sequelize.query(`
        SELECT patients.* 
        FROM patients 
        JOIN patientdefines ON patients.PatientdefineID = patientdefines.Uuid
        WHERE patients.Approvaldate < :endtOfMonth
        AND (
            (patients.Isleft = false AND patients.Isalive = true) OR
            (patients.Isalive = true AND patients.Isleft = true AND patients.Leavedate > :startOfMonth) OR
            (patients.Isleft = false AND patients.Isalive = false AND patients.Deathdate > :startOfMonth)
          )
          AND patients.Ischecked = true
          AND patients.Isapproved = true
          AND patients.Ispreregistration = false
          AND patients.Isactive = true
          AND patientdefines.CostumertypeID = :costumertype
          `, {
        model: db.patientModel,
        mapToModel: true,
        replacements: {
            endtOfMonth: endtOfMonth,
            startOfMonth: startOfMonth,
            costumertype: selectedcostumertype?.Uuid || '',
        },
        type: Sequelize.QueryTypes.SELECT,
    });

    if ((patients || []).length <= 0) {
        return next(createValidationError(req.t('Claimpayments.Error.NoPatientFound'), req.t('Claimpayments'), req.language))
    }
    for (const patient of patients) {
        let daycount = 0

        const occuredMovementsAfterDayStart = await db.patientmovementModel.findAll({
            where: {
                PatientID: patient?.Uuid || '',
                Isactive: true,
                Occureddate: {
                    [Sequelize.Op.gte]: startOfMonth.getTime(),
                }
            }
        })

        if ((occuredMovementsAfterDayStart || []).length > 0) {
            const isOccuredMovementsHasClaim = (occuredMovementsAfterDayStart || []).filter(movement => {
                const movementcase = cases.find(u => u.Uuid === movement?.CaseID)
                const isCalculateclaimpayment = movementcase?.Iscalculateprice || false
                return isCalculateclaimpayment
            })

            if (isOccuredMovementsHasClaim.length > 0) {
                daycount += 1
            }
        } else {

            const occuredMovementBeforeDayStart = await db.patientmovementModel.findOne({
                where: {
                    PatientID: patient?.Uuid || '',
                    Isactive: true,
                    Occureddate: {
                        [Sequelize.Op.lt]: startOfMonth.getTime(),
                    },
                },
                order: [['Occureddate', 'DESC']],
            });

            if (occuredMovementBeforeDayStart) {
                const movementcase = cases.find(u => u.Uuid === occuredMovementBeforeDayStart?.CaseID)
                const isCalculateclaimpayment = movementcase?.Iscalculateprice || false
                if (isCalculateclaimpayment) {
                    daycount += 1
                }
            }
        }

        if (daycount > 0) {
            const roundToFour = (num) => Math.round((num + Number.EPSILON) * 10000) / 10000;

            const perpayment = claimpaymentparameter?.Patientclaimpaymentperpayment || 0
            const kdvpercent = claimpaymentparameter?.Perpaymentkdvpercent || 0
            const kdvwithholdingpercent = claimpaymentparameter?.Perpaymentkdvwithholdingpercent || 0

            const kdv = roundToFour(kdvpercent / 100)
            const kdvwithholding = roundToFour(kdvwithholdingpercent / 100)

            const totalpayment = 1 * perpayment

            const calculatedkdv = roundToFour(totalpayment * kdv)
            const calculatedwithholding = roundToFour(calculatedkdv * kdvwithholding)

            const totalfinal = roundToFour(totalpayment + calculatedkdv)

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

function generateDateArray(startDay, endDay) {
    const start = new Date(startDay)
    const end = new Date(endDay)

    const days = [];

    while (start.getTime() <= end.getTime()) {
        const day = new Date(start)
        days.push(day);
        start.setDate(start.getDate() + 1);
    }

    return days;
}

module.exports = {
    GetClaimpayments,
    GetClaimpayment,
    AddClaimpayment,
    ApproveClaimpayment,
    DeleteClaimpayment,
    GetClaimpaymentReport,
    SavepreviewClaimpayment
}