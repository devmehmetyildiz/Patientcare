const ExcelJS = require("exceljs");
const config = require("../Config");
const { createValidationError, sequelizeErrorCatcher } = require("../Utilities/Error");
const validator = require("../Utilities/Validator")
const { claimpaymenttypes } = require('../Constants/Claimpaymenttypes')

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

        const formattedPatients = details.map(item => {
            const patient = patients.find(u => u.Uuid === item?.PatientID);
            const patientdefine = patientdefines.find(u => u.Uuid === patient?.PatientdefineID);
            const happensDate = patient?.Happensdate;
            return { ...item, happensDate, name: `${patientdefine?.Firstname} ${patientdefine?.Lastname}` }
        }).sort((a, b) => a.happensDate - b.happensDate);

        const claimpaymentType = claimpayment?.Type
        const isByksorKys = claimpaymentType === claimpaymenttypes.Bhks || claimpaymentType === claimpaymenttypes.Kys

        const ExcelHeaders = getClaimpaymentExcelColumns(claimpaymentType);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Rapor");

        worksheet.mergeCells("A1:H1");
        worksheet.getCell("A1").value = config.session.organization;
        worksheet.getCell("A1").font = { bold: true, size: 11, };
        worksheet.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };

        if (isByksorKys) {
            worksheet.mergeCells("A2:G2");
        } else {
            worksheet.mergeCells("A2:H2");
        }
        worksheet.getCell("A2").value = excelTitle(claimpaymentType, claimpayment?.Reportdate);
        worksheet.getCell("A2").font = { bold: true, size: 11, };
        worksheet.getCell("A2").alignment = { horizontal: "center", vertical: "middle" };

        worksheet.getRow(1).height = 40;
        worksheet.getRow(2).height = 40;

        worksheet.addRow(ExcelHeaders);
        worksheet.getRow(3).font = { bold: true };
        worksheet.getRow(3).alignment = { horizontal: "center", vertical: "middle" };

        let mainData = generateMainData(claimpaymentType, formattedPatients);

        worksheet.addRows(mainData);

        let footerData = generateFooterData(claimpaymentType, claimpayment);
        worksheet.addRow(footerData);
        worksheet.getRow(mainData.length + 4).font = { bold: true, color: { argb: "FF0000" } };

        const startDate = new Date(claimpayment?.Reportdate)
        startDate.setMonth(startDate.getMonth() + 1)
        startDate.setDate(0)
        const endDate = startDate.getDate()

        for (let rowIndex = 3; rowIndex <= mainData.length + 4; rowIndex++) {
            worksheet.getRow(rowIndex).eachCell((cell, colNumber) => {
                const isLastRow = rowIndex === mainData.length + 4;

                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" }
                };

                if (!isLastRow && !isByksorKys) {
                    if (colNumber === 3) {
                        const dayCountValue = cell.value;
                        if (dayCountValue !== endDate) {
                            cell.font = { bold: true };
                        }
                    }
                }

                if (colNumber > 3) {
                    cell.numFmt = '#,##0.00';
                }
            });
        }

        const title = excelTitle(claimpaymentType, claimpayment?.Reportdate);
        const filename = `${title}.xlsx`;

        const buffer = await workbook.xlsx.writeBuffer()

        res.setHeader("Content-Length", buffer.length);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(filename)}"`);

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

const getClaimpaymentExcelColumns = (claimpaymentType) => {
    switch (claimpaymentType) {
        case claimpaymenttypes.Patient:
            return [
                "S.NO", "ENGELLİNİN ADI SOYADI", "HİZMET VERİLEN GÜN", "GÜNLÜK ÜCRET TUTARI",
                "Aylık Memmur Maaş katsayısı", "KDV %10", "FATURA TUTARI (TL)", "KDV TEVKİFATI (5/10 Oranında)"
            ];
        case claimpaymenttypes.Bhks:
            return [
                "S.NO", "ENGELLİNİN ADI SOYADI", "ONAY TARİHİ",
                "Aylık Memmur Maaş katsayısı", "KDV %10", "FATURA TUTARI (TL)", "KDV TEVKİFATI (5/10 Oranında)"
            ];
        case claimpaymenttypes.Kys:
            return [
                "S.NO", "ENGELLİNİN ADI SOYADI", "ONAY TARİHİ",
                "Aylık Memmur Maaş katsayısı", "KDV %10", "FATURA TUTARI (TL)", "KDV TEVKİFATI (5/10 Oranında)"
            ];
        default:
            return [
                "S.NO", "ENGELLİNİN ADI SOYADI", "HİZMET VERİLEN GÜN", "GÜNLÜK ÜCRET TUTARI",
                "Aylık Memmur Maaş katsayısı", "KDV %10", "FATURA TUTARI (TL)", "KDV TEVKİFAT"]
    }
}

const excelTitle = (claimpaymentType, reportDate) => {

    const occuredDate = new Date(reportDate)
    const month = occuredDate.getMonth()
    const year = occuredDate.getFullYear()

    switch (claimpaymentType) {
        case claimpaymenttypes.Patient:
            return `${year} YILI ${month} AYI HAKEDİŞ FATURA DÖKÜMÜ`
        case claimpaymenttypes.Bhks:
            return `${year} YILI ${month} AYI BAKIM HİZMETLERİ KALİTE STANDARTLARI TEŞVİK ÖDEMESİ YAPILACAK ENGELLİ FATURA DÖKÜMÜ`
        case claimpaymenttypes.Kys:
            return `${year} YILI ${month} AYI TSE KYS TEŞVİK ÖDEMESİ YAPILACAK FATURA DÖKÜMÜ`
        default:
            return `${year} YILI ${month} AYI HAKEDİŞ FATURA DÖKÜMÜ`
    }
}

const generateMainData = (claimpaymentType, details) => {
    switch (claimpaymentType) {
        case claimpaymenttypes.Patient:
            return details.map((item, index) => {
                return [
                    Number(index + 1),
                    item?.name,
                    Number(item?.Daycount),
                    Number(item?.Unitpayment),
                    Number(item?.Calculatedpayment),
                    Number(item?.Calculatedkdv),
                    Number(item?.Calculatedfinal),
                    Number(item?.Calculatedwithholding)
                ]
            })
        case claimpaymenttypes.Bhks:
            return details.map((item, index) => {
                return [
                    Number(index + 1),
                    item?.name,
                    item?.happensDate,
                    Number(item?.Calculatedpayment),
                    Number(item?.Calculatedkdv),
                    Number(item?.Calculatedfinal),
                    Number(item?.Calculatedwithholding)
                ]
            })
        case claimpaymenttypes.Kys:
            return details.map((item, index) => {
                return [
                    Number(index + 1),
                    item?.name,
                    item?.happensDate,
                    Number(item?.Calculatedpayment),
                    Number(item?.Calculatedkdv),
                    Number(item?.Calculatedfinal),
                    Number(item?.Calculatedwithholding)
                ]
            })
        default:
            return details.map((item, index) => {
                return [
                    Number(index + 1),
                    item?.name,
                    Number(item?.Daycount),
                    Number(item?.Unitpayment),
                    Number(item?.Calculatedpayment),
                    Number(item?.Calculatedkdv),
                    Number(item?.Calculatedfinal),
                    Number(item?.Calculatedwithholding)
                ]
            })
    }
}

const generateFooterData = (claimpaymentType, claimpayment) => {
    switch (claimpaymentType) {
        case claimpaymenttypes.Patient:
            return [
                "",
                "TOPLAM",
                Number(claimpayment?.Totaldaycount),
                "",
                Number(claimpayment?.Totalcalculatedpayment),
                Number(claimpayment?.Totalcalculatedkdv),
                Number(claimpayment?.Totalcalculatedfinal),
                Number(claimpayment?.Totalcalculatedwithholding)
            ]
        case claimpaymenttypes.Bhks:
            return [
                "",
                "TOPLAM",
                "",
                Number(claimpayment?.Totalcalculatedpayment),
                Number(claimpayment?.Totalcalculatedkdv),
                Number(claimpayment?.Totalcalculatedfinal),
                Number(claimpayment?.Totalcalculatedwithholding)
            ]
        case claimpaymenttypes.Kys:
            return [
                "",
                "TOPLAM",
                "",
                Number(claimpayment?.Totalcalculatedpayment),
                Number(claimpayment?.Totalcalculatedkdv),
                Number(claimpayment?.Totalcalculatedfinal),
                Number(claimpayment?.Totalcalculatedwithholding)
            ]
        default:
            return [
                "",
                "TOPLAM",
                Number(claimpayment?.Totaldaycount),
                "",
                Number(claimpayment?.Totalcalculatedpayment),
                Number(claimpayment?.Totalcalculatedkdv),
                Number(claimpayment?.Totalcalculatedfinal),
                Number(claimpayment?.Totalcalculatedwithholding)
            ]
    }
}

module.exports = {
    GetClaimpaymentReport,
}