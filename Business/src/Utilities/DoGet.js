const axios = require('axios')
const config = require('../Config')

module.exports = async (service, route) => {
    const res = await axios({
        method: 'GET',
        url: `${service}${route}`,
        headers: {
            session_key: config.session.secret
        }
    })

    return res.data
}
