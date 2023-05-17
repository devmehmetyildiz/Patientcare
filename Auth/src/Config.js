require("dotenv").config()

const config = {
  env: process.env.APP_ENV,
  port: process.env.APP_PUBLIC_PORT,
  session: {
    name: process.env.APP_SESSION_NAME,
    secret: process.env.APP_SESSION_SECRET
  },
  database: {
    host: process.env.APP_MYSQL_DB_SERVER,
    user: process.env.APP_MYSQL_DB_USER,
    password: process.env.APP_MYSQL_DB_PASSWORD,
    database: process.env.APP_MYSQL_DB_NAME,
  },

}

function parseBoolean(str) {
  return str === 'true' ? true : false
}

function parseServiceUrl(url) {
  return url !== undefined ? url.replace(/\/$/, '') : url
}

module.exports = config