module.exports = sequelize.define('applog_settingModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Event: {
        type: Sequelize.STRING,
    },
}, {
    tableName: 'applog_setting', // replace with the name of your existing table
    timestamps: false
});