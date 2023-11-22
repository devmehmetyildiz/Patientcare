
const Sequelize = require('sequelize');
global.Sequelize = Sequelize
const db = {};
const config = require('../Config');


const makeSureMysqlThatConnect = () => new Promise((resolve, reject) => {

    console.log('Database module stated')
    const sequelize = new Sequelize(config.database.database, config.database.user, config.database.password, {
        dialect: 'mysql',
        host: config.database.host,
        logging: false,
        query: { raw: true }
    });
    global.sequelize = sequelize
    global.db = db
    sequelize.authenticate()
        .then(() => {
            const models = require('../Models/ModelRegistrar')
            db.sequelize = sequelize;
            db.Sequelize = Sequelize;
            Object.keys(models).forEach(model => {
                db[model] = models[model]
            })
            sequelize.sync({ /* force: true */ alter: true }).then(() => {
                console.log('Database synced successfully.');
                resolve()
            });
        })
        .catch(err => {
            console.error('Unable to connect to the database and ftp:', err);
            reject()
        });
})

module.exports = makeSureMysqlThatConnect;