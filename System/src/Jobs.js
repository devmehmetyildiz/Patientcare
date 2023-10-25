const { spawn } = require('child_process');
const axios = require('axios')
const uuid = require('uuid').v4
const config = require('./Config')
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("./Utilities/Error")

async function CroneJobs() {
    const rules = await db.ruleModel.findAll({ where: { Isactive: true } })
    rules.forEach((rule, index) => {

        if (!childProcesses[rule.Uuid]) {
            console.log('rule.Uuid: ', `${rule.Uuid} calısmaya basladı`);
            const process = spawn('node', ['-e', rule.Rule]);

            process.stdout.on('data', async (data) => {
                try {
                    const ruleloguuid = uuid()
                    await db.rulelogModel.create({
                        Uuid: ruleloguuid,
                        RuleID: rule.Uuid,
                        Log: `output => ${data}`,
                        Date: new Date()
                    })
                    await db.ruleModel.update({
                        Status: 1,
                        Updateduser: "System",
                        Updatetime: new Date(),
                    }, { where: { Uuid: rule.Uuid } })
                } catch (err) {
                    await db.ruleModel.update({
                        Status: 0,
                        Updateduser: "System",
                        Updatetime: new Date(),
                    }, { where: { Uuid: rule.Uuid } })
                    console.log('err: ', err);
                }
            });

            process.stderr.on('data', async (data) => {
                try {
                    const ruleloguuid = uuid()
                    await db.rulelogModel.create({
                        Uuid: ruleloguuid,
                        RuleID: rule.Uuid,
                        Log: `Child process ${rule.Name} error:${data}`,
                        Date: new Date()
                    })
                    await db.ruleModel.update({
                        Status: 1,
                        Updateduser: "System",
                        Updatetime: new Date(),
                    }, { where: { Uuid: rule.Uuid } })
                } catch (err) {
                    await db.ruleModel.update({
                        Status: 0,
                        Updateduser: "System",
                        Updatetime: new Date(),
                    }, { where: { Uuid: rule.Uuid } })
                    console.log('err: ', err);
                }
            });

            process.on('close', async (code) => {
                try {
                    const ruleloguuid = uuid()
                    await db.rulelogModel.create({
                        Uuid: ruleloguuid,
                        RuleID: rule.Uuid,
                        Log: `Child process ${rule.Name} exited with code ${code}`,
                        Date: new Date()
                    })
                    await db.ruleModel.update({
                        Status: 0,
                        Updateduser: "System",
                        Updatetime: new Date(),
                    }, { where: { Uuid: rule.Uuid } })
                } catch (err) {
                    console.log('err: ', err);

                }
            });
            childProcesses[rule.Uuid] = process
        }
    })
}

async function stopChildProcess(ruleId) {
    const process = childProcesses[ruleId];
    if (process) {
        process.kill();
        delete childProcesses[ruleId]; // Remove the child process reference from the object
        console.log(`Stopped child process for rule with ID: ${ruleId}`);
    } else {
        console.log(`Child process for rule with ID ${ruleId} not found`);
    }
}

async function CheckPatient() {

    const Datetime = new Date()

    try {
        let cases = []
        let todogroupdefines = []
        let tododefines = []
        let checkperiods = []
        let periods = []
        let patients = []
        try {
            const caseresponse = axios({
                method: 'GET',
                url: config.services.Setting + `Cases`,
                headers: {
                    session_key: config.session.secret
                }
            })
            const tododefineresponse = axios({
                method: 'GET',
                url: config.services.Setting + `Tododefines`,
                headers: {
                    session_key: config.session.secret
                }
            })
            const todogroupdefineresponse = axios({
                method: 'GET',
                url: config.services.Setting + `Todogroupdefines`,
                headers: {
                    session_key: config.session.secret
                }
            })
            const periodresponse = axios({
                method: 'GET',
                url: config.services.Setting + `Periods`,
                headers: {
                    session_key: config.session.secret
                }
            })
            const checkperiodresponse = axios({
                method: 'GET',
                url: config.services.Setting + `Checkperiods`,
                headers: {
                    session_key: config.session.secret
                }
            })
            const patientresponse = axios({
                method: 'GET',
                url: config.services.Business + `Patients`,
                headers: {
                    session_key: config.session.secret
                }
            })

            const responses = await Promise.all([
                caseresponse,
                tododefineresponse,
                todogroupdefineresponse,
                periodresponse,
                checkperiodresponse,
                patientresponse
            ])

            cases = responses[0]?.data
            tododefines = responses[1]?.data
            todogroupdefines = responses[2]?.data
            periods = responses[3]?.data
            checkperiods = responses[4]?.data
            patients = responses[5]?.data

        } catch (error) {
            console.log(requestErrorCatcher(error, 'Setting-Business'))
        }

        console.log("Checkpatientstarted at", Datetime);
        (patients || []).filter(u => u.TodogroupdefineID && u.CaseID && !u.Iswaitingactivation).forEach(patient => {
            Checkpatientroutine(patient, cases, todogroupdefines, tododefines, checkperiods, periods, Datetime)
        })

    } catch (error) {
        console.log(sequelizeErrorCatcher(error))
    }
}

async function Checkpatientroutine(patient, cases, todogroupdefines, tododefines, checkperiods, periods, Datetime) {

    const now = Datetime;
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;
    const dayIndex = now.getDay();
    let todosthatwillcreate = []
    console.log("patient check started -> ", patient.Uuid)
    const patientcase = (cases || []).find(u => u.Uuid === patient.CaseID)
    if (patientcase && patientcase.Isroutinework) {
        const patienttodogroupdefine = (todogroupdefines || []).find(u => u.Uuid === patient.TodogroupdefineID)
        if (patienttodogroupdefine) {
            const patienttodos = patienttodogroupdefine.Tododefineuuids.map(uuid => {
                return (tododefines || []).find(u => u.Uuid === uuid.TodoID)
            })
            for (const todo of patienttodos) {
                const patientcheckperiods = todo.Checkperioduuids.map(uuid => {
                    return (checkperiods || []).find(u => u.Uuid === uuid.CheckperiodID)
                })

                for (const checkperiod of patientcheckperiods) {

                    const ishaveroutineinthisday = (checkperiod.Occureddays.split(',') || []).map(u => { return parseInt(u) }).find(u => u === dayIndex)

                    if (ishaveroutineinthisday) {
                        const patientperiods = checkperiod.Perioduuids.map(uuid => {
                            return (periods || []).find(u => u.Uuid === uuid.PeriodID)
                        })

                        const foundedperiod = patientperiods.find(u => u.Occuredtime === currentTime)
                        if (foundedperiod) {
                            todosthatwillcreate.push({
                                TododefineID: todo.Uuid,
                                Checktime: foundedperiod.Checktime,
                                Willapprove: todo.IsNeedactivation || false,
                                Isapproved: false,
                                IsCompleted: !todo.IsRequired || true,
                                Occuredtime: currentTime
                            })
                        }
                    }

                }
            }
        }
    }
    console.log("patient check ended -> ", patient.Uuid)
    console.log("Patient routine founded->", todosthatwillcreate.length)
    if (todosthatwillcreate.length > 0) {
        const reqdata = todosthatwillcreate.map((u, index) => {
            return { ...u, Order: index + 1 }
        })

        try {
            await axios({
                url: config.services.Business + "Todos/AddPatienttodolist",
                method: "POST",
                headers: {
                    session_key: config.session.secret
                },
                data: {
                    PatientID: patient.Uuid,
                    Todos: reqdata
                }
            })
        } catch (error) {
            console.log(requestErrorCatcher(error, 'Business'))
        }
    }
}

module.exports = {
    CroneJobs,
    stopChildProcess,
    CheckPatient
}