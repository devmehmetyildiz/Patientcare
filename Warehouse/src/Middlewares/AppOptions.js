const config = require("../Config")

const crossDomainEnabler = (req, res, next) => {
  const domains = config.session.corsdomains;
  const origin = req.headers.origin;

  if (domains.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, Content-Length, X-Requested-With');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
};


const getCorsOptions = () => {

  const whitelist = config.session.corsdomains
  const corsOptions = {
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  }

  return corsOptions
}

const getSessionOption = (session) => {
  const MemoryStore = require('session-memory-store')(session)

  return {
    secret: config.session.secret,
    name: config.session.name,
    resave: false,
    store: new MemoryStore(),
    saveUninitialized: false,
  }
}

const CreateApp = (app) => {
  if (config.env === 'development' || config.env === 'production') {
    const http = require('http')
    const httpServer = http.createServer(app)
    httpServer.listen(config.env === 'development' ? config.port : process.env.PORT, () => {
      if (config.env === 'development') {
        console.log(`${config.session.name} service is running at http://localhost:${httpServer.address().port} for public usage`)
      }
      db.applog_warehouseModel.create({
        Event: "App opened at: " + new Date()
      }).catch(() => { })
    })
  }
}

module.exports = {
  crossDomainEnabler, getCorsOptions, getSessionOption,CreateApp
}