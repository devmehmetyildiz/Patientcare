const { spawn } = require('child_process');
const uuid = require('uuid').v4

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

module.exports = {
    CroneJobs,
    stopChildProcess
}