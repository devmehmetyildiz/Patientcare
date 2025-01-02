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

async function GetTrainingCountPersonel(req, res, next) {
    try {
        let validationErrors = []
        const {
            Startdate,
            Enddate,
        } = req.query

        if (!validator.isISODate(Startdate)) {
            validationErrors.push(req.t('Overviewcards.Error.StartdateRequired'))
        }
        if (!validator.isISODate(Enddate)) {
            validationErrors.push(req.t('Overviewcards.Error.EnddateRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Overviewcards'), req.language))
        }

        const users = await DoGet(config.services.Userrole, 'Users')

        const monthArray = generateMonthArray(Startdate, Enddate);

        let resArr = []

        for (const month of monthArray) {

            let totalUserCount = 0
            let totalParticipatedUserCount = 0
            let totalTraningCount = 0

            const startOfMonth = new Date(month)
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);
            const endtOfMonth = new Date(month)
            endtOfMonth.setMonth(endtOfMonth.getMonth() + 1);
            endtOfMonth.setDate(0);
            endtOfMonth.setHours(23, 59, 59, 999);

            const trainings = await db.trainingModel.findAll({
                where: {
                    Trainingdate: {
                        [Sequelize.Op.between]: [startOfMonth, endtOfMonth],
                    },
                    Typedetail: 0,
                    Iscompleted: true,
                    Isapproved: true,
                    Isonpreview: false,
                    Isactive: true,
                },
            });

            const workingUsersBetweenMonth = (users.list || []).filter(u =>
                u.Isactive &&
                u.Isworker &&
                (
                    (u.Isworking && CheckDate(u.Workstarttime, endtOfMonth) < 0) ||
                    (!u.Isworking && CheckDate(u.Workstarttime, startOfMonth) < 0 && CheckDate(u.Workendtime, startOfMonth) > 0)
                )
            )

            totalTraningCount = trainings.length
            totalUserCount = workingUsersBetweenMonth.length
            for (const training of trainings) {
                const trainingUsercount = await db.trainingusersModel.count({
                    where: {
                        TrainingID: training?.Uuid,
                        Iscompleted: true,
                        Isactive: true
                    },
                });
                totalParticipatedUserCount += trainingUsercount
            }

            const targetDate = startOfMonth.toDateString()

            const isArrayHaveDate = resArr.some(item => item.key === targetDate)

            if (isArrayHaveDate) {
                const old = resArr.find(item => item.key === targetDate)
                resArr = [
                    ...resArr.filter(u => u.key !== targetDate),
                    {
                        key: targetDate,
                        totalTraningCount: totalTraningCount + old?.totalTraningCount || 0,
                        totalParticipatedUserCount: totalParticipatedUserCount + old?.totalParticipatedUserCount || 0,
                        totalUserCount: totalUserCount + old?.totalUserCount || 0,
                    }
                ]
            } else {
                resArr.push({
                    key: targetDate,
                    totalTraningCount: totalTraningCount,
                    totalParticipatedUserCount: totalParticipatedUserCount,
                    totalUserCount: totalUserCount,
                })
            }
        }
        res.json(resArr)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetTrainingCountPatientcontact(req, res, next) {
    try {
        let validationErrors = []
        const {
            Startdate,
            Enddate,
        } = req.query

        if (!validator.isISODate(Startdate)) {
            validationErrors.push(req.t('Overviewcards.Error.StartdateRequired'))
        }
        if (!validator.isISODate(Enddate)) {
            validationErrors.push(req.t('Overviewcards.Error.EnddateRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Overviewcards'), req.language))
        }


        const monthArray = generateMonthArray(Startdate, Enddate);

        let resArr = []

        for (const month of monthArray) {

            let totalParticipatedPatientContactCount = 0
            let totalTraningCount = 0
            let totalPatientcontactCount = 0

            const startOfMonth = new Date(month)
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);
            const endtOfMonth = new Date(month)
            endtOfMonth.setMonth(endtOfMonth.getMonth() + 1);
            endtOfMonth.setDate(0);
            endtOfMonth.setHours(23, 59, 59, 999);

            const trainings = await db.trainingModel.findAll({
                where: {
                    Trainingdate: {
                        [Sequelize.Op.between]: [startOfMonth, endtOfMonth],
                    },
                    Typedetail: 2,
                    Iscompleted: true,
                    Isapproved: true,
                    Isonpreview: false,
                    Isactive: true,
                },
            });

            totalTraningCount = trainings.length

            for (const training of trainings) {
                const trainingUsercount = await db.trainingusersModel.count({
                    where: {
                        TrainingID: training?.Uuid,
                        Iscompleted: true,
                        Isactive: true
                    },
                });
                totalParticipatedPatientContactCount += trainingUsercount
            }

            const patients = await db.patientModel.findAll({
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

            for (const patient of patients) {
                const patientdefine = await db.patientdefineModel.findOne({ where: { Isactive: true, Uuid: patient?.PatientdefineID || '' } })
                const firstcontact = (validator.isString(patientdefine?.Contactname1) && ((patientdefine?.Contactname1 || '').length > 0)) ? patientdefine?.Contactname1 : null
                const secondcontact = (validator.isString(patientdefine?.Contactname2) && ((patientdefine?.Contactname2 || '').length > 0)) ? patientdefine?.Contactname2 : null
                if (firstcontact) {
                    totalPatientcontactCount++;
                }
                if (secondcontact) {
                    totalPatientcontactCount++;
                }
            }

            const targetDate = startOfMonth.toDateString()

            const isArrayHaveDate = resArr.some(item => item.key === targetDate)

            if (isArrayHaveDate) {
                const old = resArr.find(item => item.key === targetDate)
                resArr = [
                    ...resArr.filter(u => u.key !== targetDate),
                    {
                        key: targetDate,
                        totalTraningCount: totalTraningCount + old?.totalTraningCount || 0,
                        totalParticipatedPatientContactCount: totalParticipatedPatientContactCount + old?.totalParticipatedPatientContactCount || 0,
                        totalPatientcontactCount: totalPatientcontactCount + old?.totalPatientcontactCount || 0,
                    }
                ]
            } else {
                resArr.push({
                    key: targetDate,
                    totalTraningCount: totalTraningCount,
                    totalParticipatedPatientContactCount: totalParticipatedPatientContactCount,
                    totalPatientcontactCount: totalPatientcontactCount
                })
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
        } = req.query

        if (!validator.isISODate(Startdate)) {
            validationErrors.push(req.t('Overviewcards.Error.StartdateRequired'))
        }
        if (!validator.isISODate(Enddate)) {
            validationErrors.push(req.t('Overviewcards.Error.EnddateRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Overviewcards'), req.language))
        }

        const monthArray = generateMonthArray(Startdate, Enddate);

        let resArr = []

        for (const month of monthArray) {

            let totalIncidentCount = 0

            const startOfMonth = new Date(month)
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);
            const endtOfMonth = new Date(month)
            endtOfMonth.setMonth(endtOfMonth.getMonth() + 1);
            endtOfMonth.setDate(0);
            endtOfMonth.setHours(23, 59, 59, 999);

            const incidents = await db.userincidentModel.count({
                where: {
                    Occuredtime: {
                        [Sequelize.Op.between]: [startOfMonth, endtOfMonth],
                    },
                    Iscompleted: true,
                    Isapproved: true,
                    Isonpreview: false,
                    Isactive: true,
                },
            });

            totalIncidentCount = incidents

            const targetDate = startOfMonth.toDateString()

            const isArrayHaveDate = resArr.some(item => item.key === targetDate)

            if (isArrayHaveDate) {
                const old = resArr.find(item => item.key === targetDate)
                resArr = [
                    ...resArr.filter(u => u.key !== targetDate),
                    {
                        key: targetDate,
                        totalIncidentCount: totalIncidentCount + old?.totalIncidentCount || 0,
                    }
                ]
            } else {
                resArr.push({
                    key: targetDate,
                    totalIncidentCount: totalIncidentCount,
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
        } = req.query

        if (!validator.isISODate(Startdate)) {
            validationErrors.push(req.t('Overviewcards.Error.StartdateRequired'))
        }
        if (!validator.isISODate(Enddate)) {
            validationErrors.push(req.t('Overviewcards.Error.EnddateRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Overviewcards'), req.language))
        }

        const monthArray = generateMonthArray(Startdate, Enddate);

        let resArr = []

        for (const month of monthArray) {

            let totalVisitCount = 0
            let totalPatientContactCount = 0

            const startOfMonth = new Date(month)
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);
            const endtOfMonth = new Date(month)
            endtOfMonth.setMonth(endtOfMonth.getMonth() + 1);
            endtOfMonth.setDate(0);
            endtOfMonth.setHours(23, 59, 59, 999);


            const visits = await db.patientvisitModel.count({
                where: {
                    Starttime: {
                        [Sequelize.Op.between]: [startOfMonth, endtOfMonth],
                    },
                    Iscompleted: true,
                    Isapproved: true,
                    Isonpreview: false,
                    Isactive: true,
                },
            });

            totalVisitCount = visits

            const patients = await db.patientModel.findAll({
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

            for (const patient of patients) {
                const patientdefine = await db.patientdefineModel.findOne({ where: { Isactive: true, Uuid: patient?.PatientdefineID || '' } })
                const firstcontact = (validator.isString(patientdefine?.Contactname1) && ((patientdefine?.Contactname1 || '').length > 0)) ? patientdefine?.Contactname1 : null
                const secondcontact = (validator.isString(patientdefine?.Contactname2) && ((patientdefine?.Contactname2 || '').length > 0)) ? patientdefine?.Contactname2 : null
                if (firstcontact) {
                    totalPatientContactCount++;
                }
                if (secondcontact) {
                    totalPatientContactCount++;
                }
            }

            const targetDate = startOfMonth.toDateString()

            const isArrayHaveDate = resArr.some(item => item.key === targetDate)

            if (isArrayHaveDate) {
                const old = resArr.find(item => item.key === targetDate)
                resArr = [
                    ...resArr.filter(u => u.key !== targetDate),
                    {
                        key: targetDate,
                        totalVisitCount: totalVisitCount + old?.totalVisitCount || 0,
                        totalPatientContactCount: totalPatientContactCount + old?.totalPatientContactCount || 0,
                    }
                ]
            } else {
                resArr.push({
                    key: targetDate,
                    totalVisitCount: totalVisitCount,
                    totalPatientContactCount: totalPatientContactCount
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
        } = req.query

        if (!validator.isISODate(Startdate)) {
            validationErrors.push(req.t('Overviewcards.Error.StartdateRequired'))
        }
        if (!validator.isISODate(Enddate)) {
            validationErrors.push(req.t('Overviewcards.Error.EnddateRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Overviewcards'), req.language))
        }

        const users = await DoGet(config.services.Userrole, 'Users')

        const monthArray = generateMonthArray(Startdate, Enddate);

        let resArr = []

        for (const month of monthArray) {

            let totalLeftCount = 0
            let totalUserCount = 0

            const startOfMonth = new Date(month)
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);
            const endtOfMonth = new Date(month)
            endtOfMonth.setMonth(endtOfMonth.getMonth() + 1);
            endtOfMonth.setDate(0);
            endtOfMonth.setHours(23, 59, 59, 999);

            const leftUsers = (users?.list || []).filter(user =>
                user.Isworker && !user.Isworking && user.Isactive &&
                new Date(user.Workendtime).getTime() <= new Date(endtOfMonth).getTime() &&
                new Date(user.Workendtime).getTime() >= new Date(startOfMonth).getTime()
            )

            const workingUsersBetweenMonth = (users.list || []).filter(u =>
                u.Isactive &&
                u.Isworker &&
                (
                    (u.Isworking && CheckDate(u.Workstarttime, endtOfMonth) < 0) ||
                    (!u.Isworking && CheckDate(u.Workstarttime, startOfMonth) < 0 && CheckDate(u.Workendtime, startOfMonth) > 0)
                )
            )

            totalLeftCount = leftUsers.length
            totalUserCount = workingUsersBetweenMonth.length

            const targetDate = startOfMonth.toDateString()

            const isArrayHaveDate = resArr.some(item => item.key === targetDate)

            if (isArrayHaveDate) {
                const old = resArr.find(item => item.key === targetDate)
                resArr = [
                    ...resArr.filter(u => u.key !== targetDate),
                    {
                        key: targetDate,
                        totalLeftCount: totalLeftCount + old?.totalLeftCount || 0,
                        totalUserCount: totalUserCount + old?.totalUserCount || 0,
                    }
                ]
            } else {
                resArr.push({
                    key: targetDate,
                    totalLeftCount: totalLeftCount,
                    totalUserCount: totalUserCount
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

async function GetPatientIncomeOutcome(req, res, next) {
    try {
        let validationErrors = []
        const {
            Startdate,
            Enddate,
        } = req.query

        if (!validator.isISODate(Startdate)) {
            validationErrors.push(req.t('Overviewcards.Error.StartdateRequired'))
        }
        if (!validator.isISODate(Enddate)) {
            validationErrors.push(req.t('Overviewcards.Error.EnddateRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Overviewcards'), req.language))
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

            const nowEnd = new Date()
            nowEnd.setMonth(nowEnd.getMonth() + 1)
            nowEnd.setDate(0)
            nowEnd.setHours(23, 59, 59, 999)

            let enterCount = null
            let leftCount = null
            let deadCount = null

            if (endtOfMonth <= nowEnd) {
                enterCount = await db.patientModel.count({
                    where: {
                        Approvaldate: {
                            [Sequelize.Op.between]: [startOfMonth, endtOfMonth],
                        },
                        Ischecked: true,
                        Isapproved: true,
                        Ispreregistration: false,
                        Isactive: true,
                    },
                });
                leftCount = await db.patientModel.count({
                    where: {
                        Leavedate: {
                            [Sequelize.Op.between]: [startOfMonth, endtOfMonth],
                        },
                        Ischecked: true,
                        Isapproved: true,
                        Ispreregistration: false,
                        Isactive: true,
                    },
                });
                deadCount = await db.patientModel.count({
                    where: {
                        Deathdate: {
                            [Sequelize.Op.between]: [startOfMonth, endtOfMonth],
                        },
                        Ischecked: true,
                        Isapproved: true,
                        Ispreregistration: false,
                        Isactive: true,
                    },
                });
            }

            const targetDate = startOfMonth.toLocaleDateString('tr')
            resArr.push({
                key: targetDate,
                enterCount,
                leftCount,
                deadCount
            })
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
        } = req.query

        if (!validator.isISODate(Startdate)) {
            validationErrors.push(req.t('Overviewcards.Error.StartdateRequired'))
        }
        if (!validator.isISODate(Enddate)) {
            validationErrors.push(req.t('Overviewcards.Error.EnddateRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Overviewcards'), req.language))
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

            const nowEnd = new Date()
            nowEnd.setMonth(nowEnd.getMonth() + 1)
            nowEnd.setDate(0)
            nowEnd.setHours(23, 59, 59, 999)
            let patients = null
            if (endtOfMonth <= nowEnd) {
                patients = await db.patientModel.count({
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
            }

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

async function GetCompletedFileCountForPatients(req, res, next) {
    try {
        let validationErrors = []
        const {
            Startdate,
            Enddate,
        } = req.query

        if (!validator.isISODate(Startdate)) {
            validationErrors.push(req.t('Overviewcards.Error.StartdateRequired'))
        }
        if (!validator.isISODate(Enddate)) {
            validationErrors.push(req.t('Overviewcards.Error.EnddateRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Overviewcards'), req.language))
        }

        const monthArray = generateMonthArray(Startdate, Enddate);
        const usagetypes = await DoGet(config.services.Setting, 'Usagetypes')
        const files = await DoGet(config.services.File, 'Files')

        let resArr = []

        for (const month of monthArray) {

            const startOfMonth = new Date(month)
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);
            const endtOfMonth = new Date(month)
            endtOfMonth.setMonth(endtOfMonth.getMonth() + 1);
            endtOfMonth.setDate(0);
            endtOfMonth.setHours(23, 59, 59, 999);

            const patients = await db.patientModel.findAll({
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

            let completedFileCount = 0
            let patientCount = 0

            patients.forEach(patient => {
                const requiredUsagetypes = (usagetypes || []).filter(u => u.Isactive && u.Isrequiredpatientusagetype)
                const requiredUsagetypesCount = (requiredUsagetypes || []).length
                const patientfiles = (files || []).filter(u => u.Isactive && u.ParentID === patient?.Uuid).flatMap(file => {
                    return (file?.Usagetype || '').split(',')
                })

                const missingTypes = requiredUsagetypes.filter(requiredType => (patientfiles || []).includes(requiredType))
                const missingTypesCount = (missingTypes || []).length
                completedFileCount += requiredUsagetypesCount - missingTypesCount
            });
            patientCount = (patients || []).length

            const targetDate = startOfMonth.toDateString()

            const isArrayHaveDate = resArr.some(item => item.key === targetDate)

            if (isArrayHaveDate) {
                const old = resArr.find(item => item.key === targetDate)
                resArr = [
                    ...resArr.filter(u => u.key !== targetDate),
                    {
                        key: targetDate,
                        completedFileCount: completedFileCount + old?.completedFileCount || 0,
                        patientCount: patientCount + old?.patientCount || 0,
                    }
                ]
            } else {
                resArr.push({
                    key: targetDate,
                    completedFileCount: completedFileCount,
                    patientCount: patientCount,
                })
            }
        }
        res.json(resArr)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
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

function CheckDate(targetDate, checkDate) {

    const target = validator.isISODate(targetDate) ? new Date(targetDate).getTime() : null
    const check = validator.isISODate(checkDate) ? new Date(checkDate).getTime() : null

    if (!target && !check) {
        return null
    }
    const diff = target - check
    if (diff < 0) {
        return -1
    }
    if (diff > 0) {
        return 1
    }
    return 0
}


module.exports = {
    GetTrainingCountPersonel,
    GetPatientvisitCount,
    GetUserincidentCount,
    GetUserLeftCount,
    GetPatientEnterCount,
    GetCompletedFileCountForPatients,
    GetStayedPatientCount,
    GetTrainingCountPatientcontact,
    GetPatientIncomeOutcome
}