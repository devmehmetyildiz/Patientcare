const { spawn } = require('child_process');
const axios = require('axios')
const uuid = require('uuid').v4
const config = require('./Config')
const { sequelizeErrorCatcher, requestErrorCatcher } = require("./Utilities/Error")

async function CroneJobs() {
    const rules = await db.ruleModel.findAll({ where: { Isactive: true, Status: true } })
    rules.forEach((rule) => {

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
        let tododefines = []
        let periods = []
        let patients = []
        let todos = []
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
            const periodresponse = axios({
                method: 'GET',
                url: config.services.Setting + `Periods`,
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
            const todosresponse = axios({
                method: 'GET',
                url: config.services.Business + `Todos`,
                headers: {
                    session_key: config.session.secret
                }
            })

            const responses = await Promise.all([
                caseresponse,
                tododefineresponse,
                periodresponse,
                patientresponse,
                todosresponse
            ])

            cases = responses[0]?.data
            tododefines = responses[1]?.data
            periods = responses[2]?.data
            patients = responses[3]?.data
            todos = responses[4]?.data

        } catch (error) {
            console.log(requestErrorCatcher(error, 'Setting-Business'))
        }

        console.log("Checkpatientstarted at", Datetime);
        (patients || []).filter(u => u.CaseID && !u.Iswaitingactivation).forEach(patient => {
            Checkpatientroutine(patient, cases, tododefines, periods, todos, Datetime)
        })

    } catch (error) {
        console.log(sequelizeErrorCatcher(error))
    }
}

async function Checkpatientroutine(patient, cases, tododefines, periods, todos, Datetime) {

    const now = Datetime;
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;
    let todosthatwillcreate = []
    console.log("patient check started -> ", patient.Uuid)
    const patientcase = (cases || []).find(u => u.Uuid === patient.CaseID)

    if (patientcase && patientcase.Isroutinework) {
        const patienttodos = patient.Tododefineuuids.map(uuid => {
            return (tododefines || []).filter(u => u.Isactive).find(u => u.Uuid === uuid.TododefineID)
        }).filter(u => u);

        for (const todo of patienttodos) {

            const todoperiods = todo.Perioduuids.map(uuid => {
                return (periods || []).filter(u => u.Isactive).find(u => u.Uuid === uuid.PeriodID)
            }).filter(u => u)

            if ((todoperiods || []).find(u => u.Occuredtime === currentTime)) {

                let willcreateroutine = false;
                const foundedlasttodo = ((todos || []).sort((a, b) => b.Id - a.Id).find(u =>
                    u.PatientID === patient?.Uuid &&
                    u.TododefineID === todo?.Uuid
                ))

                if (!foundedlasttodo) {
                    willcreateroutine = true
                } else {
                    if (isAllowedDate(foundedlasttodo.Createtime, todo?.Dayperiod)) {
                        willcreateroutine = true
                    }
                }

                if (willcreateroutine) {


                    const foundedperiod = todoperiods.find(u => u.Occuredtime === currentTime)
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

function isAllowedDate(date1, daycount) {
    const d1 = new Date(date1);
    const d2 = new Date();
    d2.setDate(d2.getDate() + daycount);
    return d2 < d1;
    /*   return (
          d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate()
      ); */
}

module.exports = {
    CroneJobs,
    stopChildProcess,
    CheckPatient
}