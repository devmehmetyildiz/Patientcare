const axios = require('axios')
const config = require('../Config')
const { requestErrorCatcher } = require('./Error')

//type will be İnsert Update Delete
// service will be Department...
// role will be role 
// message will be created name or something

module.exports = async (type, service, role, message, pushurl) => {
    try {

        const notificationMessage = {
            Notificationtype: 'Information',
            Notificationtime: Date.now.toString(),
            Subject: `${service} - ${type}`,
            Message: message,
            Pushurl: pushurl,
            Isshowed: false,
            Isreaded: false,
        }

        await axios({
            method: 'POST',
            url: `${config.services.Userrole}Usernotifications/AddUsernotificationbyrole`,
            headers: {
                session_key: config.session.secret
            },
            data: {
                Privilege: role,
                Message: notificationMessage
            }
        })
    } catch (error) {
        console.log(requestErrorCatcher(error, 'Userrole'))
    }
}
