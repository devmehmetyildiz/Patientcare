const config = require("../Config");
const Sequelize = require('sequelize');

const checkDatabaseConnection = async (req, res, next) => {
    try {
        await sequelize.authenticate();
        next();
    } catch (error) {
        console.error('Database connection lost. Attempting to reconnect...');

        try {
            const sequelize = new Sequelize(config.database.database, config.database.user, config.database.password, {
                dialect: 'mysql',
                host: config.database.host,
                logging: false,
                query: { raw: true }
            });
            global.sequelize = sequelize
            global.db = db

            await sequelize.authenticate();
            console.log('Reconnected to the database.');

            sequelize.sync({ alter: true }).then(() => {
                console.log('Database synced successfully.');
                resolve()
            });
        } catch (reconnectError) {
            res.status(500).send({
                type: "CONNECTION_ERROR",
                code: "DATABASE_CONNECTION_ERROR",
                description: {
                    en: "Can't Connect To Database",
                    tr: "Database Bağlantısı Kurulamadı"
                }[req.language || 'tr'],
                list: [
                    {
                        description: reconnectError?.name,
                        type: {
                            en: "DATABASE CONNECTION ERROR",
                            tr: "DATABASE BAĞLANTI HATASI"
                        }[req.language || 'tr'],
                        code: "DATABASE"
                    }
                ]
            });
        }
    }
};

module.exports = checkDatabaseConnection;