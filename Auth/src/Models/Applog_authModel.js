module.exports = sequelize.define('applog_authModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Event: {
        type: Sequelize.STRING,
    },
}, {
    tableName: 'applog_auth', // replace with the name of your existing table
    timestamps: false
});