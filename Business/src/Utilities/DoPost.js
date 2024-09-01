const axios = require('axios')
const config = require('../Config')
const { requestErrorCatcher } = require('./Error')

module.exports = async (service, route, body) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `${service}${route}`,
            data: body,
            headers: {
                session_key: config.session.secret
            }
        })

        return res.data
    } catch (error) {
        throw error
    }
}
