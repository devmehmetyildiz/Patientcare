module.exports = sequelize.define('applog_logModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Event: {
        type: Sequelize.STRING,
    }
}, {
    tableName: 'applog_logs', // replace with the name of your existing table
    timestamps: false
});