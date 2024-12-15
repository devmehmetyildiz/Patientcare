const config = require("../Config")
const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const DoGet = require("../Utilities/DoGet")
const DoPost = require("../Utilities/DoPost")
const { sequelizeErrorCatcher, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')
const { patientmovementtypes } = require('../Constants/Patientmovementypes')
const DoDelete = require("../Utilities/DoDelete")
const DoPut = require("../Utilities/DoPut")

async function GetTrainingCount(req, res, next) {
    try {
        let validationErrors = []
        const {
            Startdate,
            Enddate,
            Traningtype
        } = req.body

        if (!validator.isISODate(Startdate)) {
            validationErrors.push(req.t('Overviewcards.Error.StartdateRequired'))
        }
        if (!validator.isISODate(Enddate)) {
            validationErrors.push(req.t('Overviewcards.Error.EnddateRequired'))
        }
        if (!validator.isNumber(Traningtype)) {
            validationErrors.push(req.t('Overviewcards.Error.TraningtypeRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Overviewcards'), req.language))
        }

        const trainings = await db.trainingModel.findAll({
            where: {
                Trainingdate: {
                    [Sequelize.Op.between]: [Startdate, Enddate],
                },
                Typedetail: Traningtype,
                Iscompleted: true,
                Isapproved: true,
                Isonpreview: false,
                Isactive: true,
            },
        });

        let resArr = []

        for (const training of trainings) {
            const rawTrainingDate = new Date(training?.Trainingdate)
            rawTrainingDate.setDate(1)
            const trainingDate = rawTrainingDate.toLocaleDateString('tr')

            const isArrayHaveDate = resArr.some(item => item.key === trainingDate)
            const trainingUsercount = await db.trainingusersModel.count({
                where: {
                    TrainingID: training?.Uuid,
                    Iscompleted: true,
                    Isactive: true
                },
            });
            if (trainingUsercount > 0) {
                if (isArrayHaveDate) {
                    const old = resArr.find(item => item.key === trainingDate)
                    resArr = [
                        ...resArr.filter(u => u.key !== trainingDate),
                        {
                            key: trainingDate,
                            value: trainingUsercount + old?.value || 0
                        }
                    ]
                } else {
                    resArr.push({
                        key: trainingDate,
                        value: trainingUsercount
                    })
                }
            }
        }

        res.json(resArr)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetUserincidentCount(req, res, next) {
    try {
        let validationErrors = []
        const {
            Startdate,
            Enddate,
        } = req.body

        if (!validator.isISODate(Startdate)) {
            validationErrors.push(req.t('Overviewcards.Error.StartdateRequired'))
        }
        if (!validator.isISODate(Enddate)) {
            validationErrors.push(req.t('Overviewcards.Error.EnddateRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Overviewcards'), req.language))
        }

        const incidents = await db.userincidentModel.findAll({
            where: {
                Occuredtime: {
                    [Sequelize.Op.between]: [Startdate, Enddate],
                },
                Iscompleted: true,
                Isapproved: true,
                Isonpreview: false,
                Isactive: true,
            },
        });

        let resArr = []

        for (const incident of incidents) {
            const rawOccuredtime = new Date(incident?.Occuredtime)
            rawOccuredtime.setDate(1)
            const incidentOccuredtime = rawOccuredtime.toLocaleDateString('tr')

            const isArrayHaveDate = resArr.some(item => item.key === incidentOccuredtime)

            if (isArrayHaveDate) {
                const old = resArr.find(item => item.key === incidentOccuredtime)
                resArr = [
                    ...resArr.filter(u => u.key !== incidentOccuredtime),
                    {
                        key: incidentOccuredtime,
                        value: 1 + old?.value || 0
                    }
                ]
            } else {
                resArr.push({
                    key: incidentOccuredtime,
                    value: 1
                })
            }
        }

        res.json(resArr)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPatientvisitCount(req, res, next) {
    try {
        let validationErrors = []
        const {
            Startdate,
            Enddate,
        } = req.body

        if (!validator.isISODate(Startdate)) {
            validationErrors.push(req.t('Overviewcards.Error.StartdateRequired'))
        }
        if (!validator.isISODate(Enddate)) {
            validationErrors.push(req.t('Overviewcards.Error.EnddateRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Overviewcards'), req.language))
        }

        const visits = await db.patientvisitModel.findAll({
            where: {
                Starttime: {
                    [Sequelize.Op.between]: [Startdate, Enddate],
                },
                Iscompleted: true,
                Isapproved: true,
                Isonpreview: false,
                Isactive: true,
            },
        });

        let resArr = []

        for (const visit of visits) {
            const rawStartdate = new Date(visit?.Starttime)
            rawStartdate.setDate(1)
            const visitStartDate = rawStartdate.toLocaleDateString('tr')

            const isArrayHaveDate = resArr.some(item => item.key === visitStartDate)

            if (isArrayHaveDate) {
                const old = resArr.find(item => item.key === visitStartDate)
                resArr = [
                    ...resArr.filter(u => u.key !== visitStartDate),
                    {
                        key: visitStartDate,
                        value: 1 + old?.value || 0
                    }
                ]
            } else {
                resArr.push({
                    key: visitStartDate,
                    value: 1
                })
            }
        }

        res.json(resArr)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetUserLeftCount(req, res, next) {
    try {
        let validationErrors = []
        const {
            Startdate,
            Enddate,
        } = req.body

        if (!validator.isISODate(Startdate)) {
            validationErrors.push(req.t('Overviewcards.Error.StartdateRequired'))
        }
        if (!validator.isISODate(Enddate)) {
            validationErrors.push(req.t('Overviewcards.Error.EnddateRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Overviewcards'), req.language))
        }

        const Users = await DoGet(config.services.Userrole, 'Users')

        const users = (Users?.list || []).filter(user =>
            user.Isworker && !user.Isworking && user.Isactive &&
            new Date(user.Workendtime).getTime() <= new Date(Enddate).getTime() &&
            new Date(user.Workendtime).getTime() >= new Date(Startdate).getTime()
        )

        let resArr = []

        for (const user of users) {
            const rawEnddate = new Date(user?.Workendtime)
            rawEnddate.setDate(1)
            const workEndDate = rawEnddate.toLocaleDateString('tr')

            const isArrayHaveDate = resArr.some(item => item.key === workEndDate)

            if (isArrayHaveDate) {
                const old = resArr.find(item => item.key === workEndDate)
                resArr = [
                    ...resArr.filter(u => u.key !== workEndDate),
                    {
                        key: workEndDate,
                        value: 1 + old?.value || 0
                    }
                ]
            } else {
                resArr.push({
                    key: workEndDate,
                    value: 1
                })
            }
        }

        res.json(resArr)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPatientEnterCount(req, res, next) {
    try {
        let validationErrors = []
        const {
            Startdate,
            Enddate,
        } = req.body

        if (!validator.isISODate(Startdate)) {
            validationErrors.push(req.t('Overviewcards.Error.StartdateRequired'))
        }
        if (!validator.isISODate(Enddate)) {
            validationErrors.push(req.t('Overviewcards.Error.EnddateRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Overviewcards'), req.language))
        }


        const patients = await db.patientModel.findAll({
            where: {
                Approvaldate: {
                    [Sequelize.Op.between]: [Startdate, Enddate],
                },
                Ischecked: true,
                Isapproved: true,
                Ispreregistration: false,
                Isactive: true,
            },
        });

        let resArr = []

        for (const patient of patients) {
            const rawApprovaldate = new Date(patient?.Approvaldate)
            rawApprovaldate.setDate(1)
            const approvalDate = rawApprovaldate.toLocaleDateString('tr')

            const isArrayHaveDate = resArr.some(item => item.key === approvalDate)

            if (isArrayHaveDate) {
                const old = resArr.find(item => item.key === approvalDate)
                resArr = [
                    ...resArr.filter(u => u.key !== approvalDate),
                    {
                        key: approvalDate,
                        value: 1 + old?.value || 0
                    }
                ]
            } else {
                resArr.push({
                    key: approvalDate,
                    value: 1
                })
            }
        }
        res.json(resArr)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetStayedPatientCount(req, res, next) {
    try {
        let validationErrors = []
        const {
            Startdate,
            Enddate,
        } = req.body

        if (!validator.isISODate(Startdate)) {
            validationErrors.push(req.t('Overviewcards.Error.StartdateRequired'))
        }
        if (!validator.isISODate(Enddate)) {
            validationErrors.push(req.t('Overviewcards.Error.EnddateRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Overviewcards'), req.language))
        }

        function generateMonthArray(startDate, endDate) {
            const start = new Date(startDate);
            start.setDate(1)
            const end = new Date(endDate);
            end.setDate(1)
            const months = [];

            while (start <= end) {
                const month = start.toDateString()
                months.push(month);
                start.setMonth(start.getMonth() + 1);
            }

            return months;
        }

        const monthArray = generateMonthArray(Startdate, Enddate);

        let resArr = []

        for (const month of monthArray) {

            const startOfMonth = new Date(month)
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0); 
            const endtOfMonth = new Date(month)
            endtOfMonth.setMonth(endtOfMonth.getMonth() + 1);
            endtOfMonth.setDate(0);
            endtOfMonth.setHours(23, 59, 59, 999); 

            const patients = await db.patientModel.count({
                where: {
                    Approvaldate: {
                        [Sequelize.Op.lt]: endtOfMonth,
                    },
                    [Sequelize.Op.or]: [
                        {
                            Isleft: false,
                            Isalive: true,
                        },
                        {
                            Isalive: true,
                            Isleft: true,
                            Leavedate: {
                                [Sequelize.Op.gt]: startOfMonth,
                            },
                        },
                        {
                            Isleft: false,
                            Isalive: false,
                            Deathdate: {
                                [Sequelize.Op.gt]: startOfMonth,
                            },
                        },
                    ],
                    Ischecked: true,
                    Isapproved: true,
                    Ispreregistration: false,
                    Isactive: true,
                },
            });

            const targetDate = startOfMonth.toLocaleDateString('tr')

            const isArrayHaveDate = resArr.some(item => item.key === targetDate)

            if (isArrayHaveDate) {
                const old = resArr.find(item => item.key === targetDate)
                resArr = [
                    ...resArr.filter(u => u.key !== targetDate),
                    {
                        key: targetDate,
                        value: patients + old?.value || 0
                    }
                ]
            } else {
                resArr.push({
                    key: targetDate,
                    value: patients
                })
            }
        }
        res.json(resArr)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetRequiredFileCountForPatients(req, res, next) {
    try {
        let validationErrors = []
        const {
            Startdate,
            Enddate,
        } = req.body

        if (!validator.isISODate(Startdate)) {
            validationErrors.push(req.t('Overviewcards.Error.StartdateRequired'))
        }
        if (!validator.isISODate(Enddate)) {
            validationErrors.push(req.t('Overviewcards.Error.EnddateRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Overviewcards'), req.language))
        }

        function generateMonthArray(startDate, endDate) {
            const start = new Date(startDate);
            start.setDate(1)
            const end = new Date(endDate);
            end.setDate(1)
            const months = [];

            while (start <= end) {
                const month = start.toLocaleDateString('tr')
                months.push(month);
                start.setMonth(start.getMonth() + 1);
            }

            return months;
        }

        const monthArray = generateMonthArray(Startdate, Enddate);

        let resArr = []

        for (const month of monthArray) {

            const startOfMonth = new Date(month)
            startOfMonth.setDate(1)
            const endtOfMonth = new Date(month)
            endtOfMonth.setDate(0)
            endtOfMonth.setMonth(endtOfMonth.getMonth() + 1)

            const patients = await db.patientModel.count({
                where: {
                    Approvaldate: {
                        [Sequelize.Op.lte]: endtOfMonth,
                    },
                    [Sequelize.Op.or]: [
                        { Isleft: true, Leavedate: { [Sequelize.Op.gt]: endtOfMonth } }, // Left after the month
                        { Isleft: false, Leavedate: null } // Hasn't left
                    ],
                    [Sequelize.Op.or]: [
                        { Isalive: false, Deathdate: { [Sequelize.Op.gt]: endtOfMonth } }, // Died after the month
                        { Isalive: true, Deathdate: null } // Is still alive
                    ],
                    Ischecked: true,
                    Isapproved: true,
                    Ispreregistration: false,
                    Isactive: true,
                }
            });

            const targetDate = startOfMonth.toLocaleDateString('tr')

            const isArrayHaveDate = resArr.some(item => item.key === targetDate)

            if (isArrayHaveDate) {
                const old = resArr.find(item => item.key === targetDate)
                resArr = [
                    ...resArr.filter(u => u.key !== targetDate),
                    {
                        key: targetDate,
                        value: patients + old?.value || 0
                    }
                ]
            } else {
                resArr.push({
                    key: targetDate,
                    value: patients
                })
            }
        }
        res.json(resArr)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}



module.exports = {
    GetTrainingCount,
    GetPatientvisitCount,
    GetUserincidentCount,
    GetUserLeftCount,
    GetPatientEnterCount,
    GetRequiredFileCountForPatients,
    GetStayedPatientCount
}