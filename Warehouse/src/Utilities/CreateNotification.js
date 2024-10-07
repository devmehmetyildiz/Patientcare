const axios = require('axios')
const config = require('../Config')
const { requestErrorCatcher } = require('./Error')

module.exports = async ({ type, service, role, message, pushurl }) => {
    try {

        const notificationMessage = {
            Notificationtype: 'Information',
            Notificationtime: new Date(),
            Subject: `${service?.tr ? service?.tr : service} - ${type}`,
            Message: message?.tr ? message?.tr : message,
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
