const config = {
  env: process.env.REACT_APP_ENV,
  port: process.env.REACT_APP_PUBLIC_PORT,
  session: {
    name: process.env.REACT_APP_SESSION_NAME,
  },
  services: {
    Auth: process.env.REACT_APP_AUTH_URL,
    Business: process.env.REACT_APP_BUSINESS_URL,
    Setting: process.env.REACT_APP_SETTING_URL,
    System: process.env.REACT_APP_SYSTEM_URL,
    Userrole: process.env.REACT_APP_USERROLE_URL,
    Warehouse: process.env.REACT_APP_WAREHOUSE_URL,
    File: process.env.REACT_APP_FILE_URL,
  }

}

export default config