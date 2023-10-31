let config = {
  env: process.env.REACT_APP_ENV,
  port: process.env.REACT_APP_PUBLIC_PORT,
  version: process.env.REACT_APP_VERSION,
  session: {
    name: process.env.REACT_APP_SESSION_NAME,
  }
}

if (config.env === 'development') {
  config.services = {
    Auth: process.env.REACT_APP_AUTH_URL_DEV,
    Business: process.env.REACT_APP_BUSINESS_URL_DEV,
    Setting: process.env.REACT_APP_SETTING_URL_DEV,
    System: process.env.REACT_APP_SYSTEM_URL_DEV,
    Userrole: process.env.REACT_APP_USERROLE_URL_DEV,
    Warehouse: process.env.REACT_APP_WAREHOUSE_URL_DEV,
    Log: process.env.REACT_APP_LOG_URL_DEV,
    File: process.env.REACT_APP_FILE_URL_DEV,
  }
} else {
  config.services = {
    Auth: process.env.REACT_APP_AUTH_URL_PROD,
    Business: process.env.REACT_APP_BUSINESS_URL_PROD,
    Setting: process.env.REACT_APP_SETTING_URL_PROD,
    System: process.env.REACT_APP_SYSTEM_URL_PROD,
    Userrole: process.env.REACT_APP_USERROLE_URL_PROD,
    Warehouse: process.env.REACT_APP_WAREHOUSE_URL_PROD,
    Log: process.env.REACT_APP_LOG_URL_PROD,
    File: process.env.REACT_APP_FILE_URL_PROD,
  }
}


export default config