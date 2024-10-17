const axios = require('axios')
const config = require('../Config')

module.exports = async (service, route, body) => {
    const res = await axios({
        method: 'POST',
        url: `${service}${route}`,
        data: body,
        headers: {
            session_key: config.session.secret
        }
    })

    return res.data
}
