const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors');
const config = require('./Config');
const crossDomainEnabler = require('./Middlewares/Crossdomainenabler');
app.use(cors());

require("./Middlewares/Databaseconnector")()
  .then(() => {
    const session = require('express-session')
    const router = require('xpress-router')
    const routes = require('./Routes')
    const MemoryStore = require('session-memory-store')(session)
    const errorHandlers = require('./Middlewares/Errorhandlers')

    app.use(express.static('./dist'))
    app.set('views', __dirname + '/views/')
    app.set('view engine', 'pug')
    app.disable('x-powered-by')

    app.use(session({
      secret: config.session.secret,
      name: config.session.name,
      resave: false,
      store: new MemoryStore(),
      saveUninitialized: false,
    }))

    app.use(bodyParser.json())
    app.use(crossDomainEnabler)
    router(app, routes, { controllerDirectory: `${process.cwd()}/src/Controllers/`, controllerFileSuffix: '-controller.js', logRoutesList: false })

    errorHandlers.init(app)

    if (config.env === 'development' || config.env === 'production') {
      const http = require('http')
      const httpServer = http.createServer(app)
      httpServer.listen(config.port, () => {
        if (config.env === 'development') {
          console.log(`${config.session.name} service is running at http://localhost:${httpServer.address().port} for public usage`)
          db.applogModel.create({
            Event: "App opened at: " + new Date()
          }).catch(() => {

          })
        }
      })
    }

    module.exports = app
  })
  .catch((error) => {
    console.log('error: ', error);
    console.log("Closing App")
    process.exit(500)
  })




