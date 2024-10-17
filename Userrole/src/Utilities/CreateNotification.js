const { sequelizeErrorCatcher } = require('./Error')
const uuid = require('uuid').v4

module.exports = async ({ type, service, role, message, pushurl }) => {
    
    const t = await db.sequelize.transaction();
    
    try {

        const notificationMessage = {
            Notificationtype: 'Information',
            Notificationtime: new Date(),
            Subject: `${service} - ${type}`,
            Message: message,
            Pushurl: pushurl,
            Isshowed: false,
            Isreaded: false,
        }

        const data = {
            Privilege: role,
            Message: notificationMessage
        }

        const { Privilege, Message } = data

        const users = await db.userModel.findAll()

        for (const user of users) {
            let notificationSended = false
            const roles = await db.userroleModel.findAll({ where: { UserID: user?.Uuid } })
            for (const role of roles) {
                const privileges = await db.roleprivilegeModel.findAll({ where: { RoleID: role?.RoleID || '' } })
                const willCreatenotification = ((privileges || []).map(u => u.PrivilegeID) || []).includes('admin') || ((privileges || []).map(u => u.PrivilegeID) || []).includes(Privilege)
                if (willCreatenotification) {

                    let notificationuuid = uuid()
                    await db.usernotificationModel.create({
                        ...Message,
                        UserID: user?.Uuid,
                        Uuid: notificationuuid,
                        Createduser: "System",
                        Createtime: new Date(),
                        Isactive: true
                    }, { transaction: t })
                    notificationSended = true
                }

                if (notificationSended) {
                    break;
                }
            }
        }

        await t.commit()

    } catch (err) {
        await t.rollback()
        return console.log(sequelizeErrorCatcher(err))
    }
}
