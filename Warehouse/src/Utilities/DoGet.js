const axios = require('axios')
const config = require('../Config')
const { requestErrorCatcher } = require('./Error')

module.exports = async (service, route) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `${service}${route}`,
            headers: {
                session_key: config.session.secret
            }
        })

        return res.data
    } catch (error) {
        throw error
    }
}
